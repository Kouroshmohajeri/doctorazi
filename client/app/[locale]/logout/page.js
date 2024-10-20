"use client";
import { Logout } from "@/lib/auth/userState";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect } from "react";

const Page = () => {
  const router = useRouter();
  useEffect(() => {
    const doLogout = async () => {
      try {
        await Logout("users/logout");
        localStorage.clear();
        router.push("/login"); // Redirect after successful logout
      } catch (error) {
        console.error("Logout failed:", error);
        // Optionally handle the error, e.g., display a message
      }
    };

    doLogout();
  }, [router]);
  return <div>Logging out...</div>;
};

export default Page;
