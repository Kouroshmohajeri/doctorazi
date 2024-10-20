import { i18nRouter } from "next-i18n-router";
import i18nConfig from "./i18nConfig";
import { serverSideDecoder } from "./lib/decode";
import { NextResponse } from "next/server";

// Maps user types to their respective dashboard paths
const userDashboardPaths = {
  1: "dashboard/clients",
  2: "dashboard/doctor",
  3: "dashboard/author",
  4: "dashboard/head-author",
  5: "dashboard/translator",
  6: "dashboard/management",
};

export const middleware = async (request) => {
  const token = request.cookies.get("token")?.value;
  const lang = request.cookies.get("NEXT_LOCALE")?.value || "en";
  const localePrefix = lang === "fa" ? "" : "en/";

  // Check for token and attempt to decode (if necessary)
  let userInfo = null;
  let expired = false;
  let expirationDuration;

  if (token) {
    try {
      userInfo = await serverSideDecoder(token);
      if (userInfo.success === true) {
        expired = false;
        expirationDuration = userInfo.expiredAt;
      }
      if (userInfo === 1) {
        expired = true;
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  const userType = userInfo?.user_type;
  const currentPath = request.nextUrl.pathname;

  // Redirect logged-in users trying to access login or register page
  if (
    token &&
    (currentPath.endsWith("/login") || currentPath.endsWith("/register"))
  ) {
    const userDashboardPath = `/${localePrefix}${
      userDashboardPaths[userType] || ""
    }`;
    return NextResponse.redirect(
      `${request.nextUrl.origin}${userDashboardPath}`
    );
  }
  // Handle logout for expired tokens or no token in protected areas
  if (
    (expired || !token) &&
    (currentPath.includes("/dashboard/") ||
      currentPath.includes("/appointment"))
  ) {
    // Logout logic (e.g., remove cookies, call Logout API)
    if (!token) {
      return NextResponse.redirect(
        `${request.nextUrl.origin}/${localePrefix}login`
      );
    }
    return NextResponse.redirect(
      `${request.nextUrl.origin}/${localePrefix}logout`
    );
  }

  // Other authorization logic and i18n routing
  if (userType) {
    const userDashboardPath = `/${localePrefix}${
      userDashboardPaths[userType] || ""
    }`;
    const isAccessingOtherDashboard =
      currentPath.startsWith(`/${localePrefix}dashboard`) &&
      currentPath !== userDashboardPath;
    if (isAccessingOtherDashboard) {
      return NextResponse.redirect(
        `${request.nextUrl.origin}${userDashboardPath}`
      );
    }
  }

  return i18nRouter(request, i18nConfig);
};

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
