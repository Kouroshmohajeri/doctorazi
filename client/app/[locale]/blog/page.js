import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import TimeLine from "@/components/TimeLine/TimeLine";
import React from "react";
import styles from "./Blog.module.css";
import Label from "@/components/Label/Label";
import RandomTwoBlogs from "@/components/RandomTwoBlogs/RandomTwoBlogs";
import AllBlogs from "@/components/AllBlogs/AllBlogs";
export const metadata = {
  title: "Blog",
};
const page = async ({ params }) => {
  const { locale } = params;
  return (
    <main>
      <Header />
      <TimeLine source={"/images/23485395_44.jpg"} headLine={"Blog:Header"} />
      <RandomTwoBlogs />
      <Label currentLang={locale}>
        {locale === "fa" ? "پست های اخیر" : "Recent Blogs"}
      </Label>
      <div className={styles.recentPosts}>
        <AllBlogs />
      </div>
      <Footer />
    </main>
  );
};

export default page;
