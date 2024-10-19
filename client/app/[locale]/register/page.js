import React from 'react';
import styles from './register.module.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import Image from 'next/legacy/image';
import Forms from '@/components/Forms/Forms';
import Link from 'next/link';

const page = () => {
  const fields = [
    {
      type: "text",
      name: "first_name",
      placeholder: "First Name",
      id: "firstName",
    },
    {
      type: "text",
      name: "last_name",
      placeholder: "Last Name",
      id: "lastName",
    },
    {
      type: "email",
      name: "email",
      placeholder: "Email",
      id: "email",
    },
    {
      type: "text",
      name: "phone_number",
      placeholder: "Phone Number",
      id: "phoneNumber",
    },
    {
      type: "text",
      name: "username",
      placeholder: "Username",
      id: "username",
    },
    {
      type: "password",
      name: "password",
      placeholder: "Password",
      id: "password",
    },
    {
      type: "password",
      name: "confirmPassword",
      placeholder: "Confirm Password",
      id: "confirmPassword",
    },
  ];
  
  return (
    <main>
      <Header />
      <div className={styles.container}>
        <div className={styles.formSection}>
          <Forms fields={fields} formType="Register"/>
          <div className={styles.actions}>
            <div className={styles.signupPrompt}>
              Already have an account? <Link href="/login">Login now!</Link>
            </div>
          </div>
        </div>
        <div className={styles.imageSide}>
          <Image alt='login' src="/images/logo/logo.png" layout="fill" objectFit="cover"  priority/>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default page;
