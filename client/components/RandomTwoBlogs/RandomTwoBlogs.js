"use client";
import React, { useEffect, useState } from "react";
import Paper from "@/components/Paper/Paper";
import Link from "next/link";
import { getRandomTwoBlogPosts } from "@/lib/actions/blogPost/actions";
import styles from "./RandomTwoBlogs.module.css";

const RandomTwoBlogs = () => {
  const [randomTwoBlogs, setRandomTwoBlogs] = useState([]);
  useEffect(() => {
    const fetchTwoRecentBlogs = async () => {
      const posts = await getRandomTwoBlogPosts();
      setRandomTwoBlogs(posts);
    };
    fetchTwoRecentBlogs();
  }, []);
  return (
    <div className={styles.paper}>
      {randomTwoBlogs.map((post) => (
        <Link
          href={`blog/${post.post_id}/${post.url}`}
          className={styles.links}
          key={post.post_id}
        >
          <Paper
            title={post.title}
            desc={post.shortDescription}
            alt={post.altName}
            image={`https://doctorazi.com/blogs/${post.author_id}/${post.post_id}/${post.imageUrl}`}
          />
        </Link>
      ))}
    </div>
  );
};

export default RandomTwoBlogs;
