// import i18nConfig from "@/i18nConfig";
// import { i18nRouter } from "next-i18n-router";

// export const i18nMiddleware =(request)=>{
//     return i18nRouter(request,i18nConfig);
// }
import { NextResponse } from 'next/server';
import { Locale, NegotiationResult } from 'negotiator';
import { defaultLocale, i18n } from '../i18nConfig.js';

export function middleware(request) {
    const parsedCookies = Object.fromEntries(
      Object.entries(request.cookies).map(([key, value]) => [key, decodeURIComponent(value)])
    );

    const { supportedLocales: locales, defaultLocale: defaultLocaleFromNegotiation } =
      i18n.services.negotiator(request.headers.get('accept-language'), parsedCookies);

    // Filter supported locales
    const selectedLocale = locales.find((locale) => i18n.supportedLngs.includes(locale.value)) ||
       new Locale(defaultLocale);

    const localePathResult = negotiateLocalePath(selectedLocale, request.nextUrl);

    const isLocalePath = localePathResult.isLocalePath;
    const locale = localePathResult.locale;

    i18n.changeLanguage(locale);

    // Redirect to prefixed path with locale if not already there (optional)
    if (!isLocalePath && !locale.default) {
        return NextResponse.redirect(new URL(localePathResult.localePath, request.url));
    }

    return NextResponse.next();
}

function negotiateLocalePath(locale, url) {
    const localePrefixes = new Set(i18n.locales.flatMap((l) => l.locales));
    const parsedUrl = new URL(url);

    // If the initial URL path already includes a locale prefix
    if (localePrefixes.has(parsedUrl.pathname.split('/')[1])) {
        return { isLocalePath: true, locale };
    }

    // Prefix locale to path
    parsedUrl.pathname = `/${locale.code}${parsedUrl.pathname}`;

    return { isLocalePath: false, locale, localePath: parsedUrl.toString() };
}
