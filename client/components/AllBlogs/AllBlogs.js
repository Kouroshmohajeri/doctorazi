"use client";
import { getAllBlogPosts } from "@/lib/actions/blogPost/actions";
import React, { useEffect, useState } from "react";
import CardComponent from "@/components/Card/CardComponent";
import Link from "next/link";
import styles from "./AllBlogs.module.css";

const AllBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    const fetchAllBlogs = async () => {
      const post = await getAllBlogPosts();
      setBlogs(post);
    };
    fetchAllBlogs();
  }, []);
  return (
    <div className={styles.blogsContainer}>
      {blogs.map((post) => (
        <Link
          href={`blog/${post.post_id}/${post.url}`}
          className={styles.links}
          key={post.post_id}
        >
          <CardComponent
            title={post.title}
            src={`http://localhost:8443/blogs/${post.author_id}/${post.post_id}/${post.imageUrl}`}
            alt={post.altName}
            desc={post.shortDescription}
          />
        </Link>
      ))}
    </div>
  );
};

export default AllBlogs;
