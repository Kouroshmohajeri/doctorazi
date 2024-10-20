import Footer from "@/components/Footer/Footer";
import Forms from "@/components/Forms/Forms";
import Header from "@/components/Header/Header";
import React from "react";
import styles from "./login.module.css";
import Link from "next/link";
import Image from "next/legacy/image";

const Page = async () => {
  const fields = [
    {
      type: "text",
      name: "username",
      placeholder: "Enter email or username",
      id: "username",
    },
    {
      type: "password",
      name: "password",
      placeholder: "Enter password",
      id: "password",
    },
  ];

  return (
    <main>
      <Header />
      <div className={styles.container}>
        <div className={styles.formSection}>
          <Forms fields={fields} formType="Login" />
          <div className={styles.actions}>
            <div className={styles.linkWrapper}>
              <Link href="/forgot-password">Forgot password?</Link>
            </div>
            <div className={styles.signupPrompt}>
              Don&apos;t have an account?{" "}
              <Link href="/register">Register now!</Link>
            </div>
          </div>
        </div>
        <div className={styles.imageSide}>
          <Image
            alt="login"
            src="/images/logo/logo.png"
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default Page;
