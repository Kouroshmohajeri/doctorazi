import React, { useContext, useEffect, useState } from "react";
import CardComponent from "../Card/CardComponent";
import { UserDataContext } from "@/context/UserDatasContext";
import { getNotTranslatedBlogPosts } from "@/lib/actions/blogPost/actions";
import styles from "../BlogsManagement/PostsManagement.module.css";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import { sideMenuContext } from "@/context/SideMenuContext";
import Link from "next/link";
import TextField from "@mui/material/TextField";
import TranslateIcon from "@mui/icons-material/Translate";
import { translateContext } from "@/context/TranslateMode";

export default function UnTranslatedPosts({ heading }) {
  const { users, fetchCookies } = useContext(UserDataContext);
  const { isTranslateModeOn, setIsTranslateModeOn } =
    useContext(translateContext);

  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const { setIsSelected } = useContext(sideMenuContext);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCookies();
  }, []);

  const fetchPosts = async () => {
    try {
      const posts = await getNotTranslatedBlogPosts();
      if (posts) {
        setPosts(Array.isArray(posts) ? posts : [posts]);
        setFilteredPosts(Array.isArray(posts) ? posts : [posts]);
      }
    } catch (error) {
      console.log("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const onClickTranslateHandler = (post) => {
    // Reseting Editor
    localStorage.removeItem("translatePostId");
    localStorage.removeItem("translateTitle");
    localStorage.removeItem("translateShortDescription");
    localStorage.removeItem("translateContent");
    localStorage.removeItem("translateTitleEdit");
    localStorage.removeItem("translateShortDescriptionEdit");
    localStorage.removeItem("translateContentEdit");
    localStorage.removeItem("translateEditMode");
    // Setting editor for update
    localStorage.setItem("translatePostId", post.post_id);
    localStorage.setItem("translateTitle", post.title);
    localStorage.setItem("translateShortDescription", post.shortDescription);
    localStorage.setItem("translateContent", post.content);
    localStorage.setItem("translateEditMode", true);
    setIsSelected(3);
    setIsTranslateModeOn(true);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.shortDescription.toLowerCase().includes(query)
    );
    setFilteredPosts(filtered);
  };

  return (
    <div>
      <h1>{heading}</h1>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <div className={styles.posts}>
        {filteredPosts.map((post) => (
          <div key={post.post_id} className={styles.post}>
            <Link
              href={`/blog/${post.post_id}/${post.url}`}
              className={styles.links}
            >
              <CardComponent
                title={post.title}
                src={`http://doctorazi.com:8443/blogs/${post.author_id}/${post.post_id}/${post.imageUrl}`}
                alt={post.altName}
                desc={post.shortDescription}
              />
            </Link>
            <ButtonGroup
              disableElevation
              variant="outlined"
              aria-label="Disabled button group"
            >
              <Button
                onClick={() => {
                  onClickTranslateHandler(post);
                }}
              >
                <TranslateIcon />
              </Button>
            </ButtonGroup>
          </div>
        ))}
      </div>
    </div>
  );
}
