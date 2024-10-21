"use client";
import React, { useContext, useEffect, useState } from "react";
import styles from "./RecentBlogs.module.css";
import Label from "../Label/Label";
import RecentBlogCard from "../RecentBlogCard/RecentBlogCard";
import Image from "next/legacy/image";
import Link from "next/link";
import { languageContext } from "@/context/LanguageContext";
import { getLastFourBlogPosts } from "@/lib/actions/blogPost/actions";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";

const RecentBlogs = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const { t, currentLang } = useContext(languageContext);

  useEffect(() => {
    const fetchRecentBlogs = async () => {
      const posts = await getLastFourBlogPosts();
      setBlogPosts(posts);
    };
    fetchRecentBlogs();
  }, []);

  return (
    <div className={styles.RecentBlogsContainer}>
      <div className={styles.sectionLabel}>
        <Label currentLang={currentLang}>{t("Labels:RecentPosts")}</Label>
      </div>
      <div className="container">
        <div className="row">
          <div className={styles.cardContainer}>
            {blogPosts.map((post) => (
              <Card key={post.post_id} className={styles.BlogCard}>
                <CardActionArea
                  component={Link}
                  href={`blog/${post.post_id}/${post.url}`}
                >
                  <CardMedia
                    component="img"
                    alt={post.title}
                    height="140"
                    image={`http://doctorazi.com:8443/blogs/${post.author_id}/${post.post_id}/${post.imageUrl}`}
                    title={post.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {post.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {post.shortDescription}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentBlogs;
