"use client";
import React, { useContext, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import "trix/dist/trix.css"; // Import Trix CSS
import styles from "./TextEditor.module.css";
import GoogleSearchResult from "../GoogleSearchResult/GoogleSearchResult";
import { UserDataContext } from "@/context/UserDatasContext";
import { getAuthorByUserId } from "@/lib/actions/authors/actions";
import {
  addBlogPost,
  deleteImage,
  updateBlogPost,
  uploadImage,
} from "@/lib/actions/blogPost/actions";
import {
  checkDuplicateUrl,
  deleteBlogImage,
} from "@/lib/actions/blogImage/actions";

// Import Trix editor (requires `window` object)
if (typeof window !== "undefined") {
  require("trix");
}

const TextEditor = () => {
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");
  const [mainPicture, setMainPicture] = useState(null);
  const [altName, setAltName] = useState("");
  const [authorId, setAuthorId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("error");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [isEditMode, setIsEditMode] = useState(false);
  const { users, fetchCookies } = useContext(UserDataContext);

  useEffect(() => {
    fetchCookies();
    if (localStorage.getItem("mainPicture")) {
      setMainPicture(localStorage.getItem("mainPicture"));
    }
    if (localStorage.getItem("isEditMode")) {
      setIsEditMode(true);
    }
  }, []);

  useEffect(() => {
    const fetchAuthorId = async () => {
      try {
        const authorData = await getAuthorByUserId(users.id);
        setAuthorId(authorData.authorId);
      } catch (error) {
        console.error("Error fetching author ID:", error.message);
      }
    };
    fetchAuthorId();
  }, [users.id]);

  useEffect(() => {
    const savedTitle = localStorage.getItem("title");
    const savedShortDescription = localStorage.getItem("shortDescription");
    const savedUrl = localStorage.getItem("url");
    const savedContent = localStorage.getItem("content");
    const savedAltName = localStorage.getItem("altName");

    if (savedTitle) setTitle(savedTitle);
    if (savedShortDescription) setShortDescription(savedShortDescription);
    if (savedUrl) setUrl(savedUrl);
    if (savedContent) setContent(savedContent);
    if (savedAltName) setAltName(savedAltName);
  }, []);

  useEffect(() => {
    localStorage.setItem("title", title);
    localStorage.setItem("shortDescription", shortDescription);
    localStorage.setItem("url", url);
    localStorage.setItem("content", content);
    localStorage.setItem("altName", altName);
  }, [title, shortDescription, url, content, altName]);

  const handleShortDescriptionChange = (event) => {
    const input = event.target.value;
    if (input.length <= 150) {
      setShortDescription(input);
    }
  };

  const handleMainPictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newName = file.name.replace(/\s+/g, "");
      const newFile = new File([file], newName, { type: file.type });
      setMainPicture(newFile);
    }
  };

  const handleAltNameChange = (event) => {
    setAltName(event.target.value);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleAddBlogPost = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to ${
        isEditMode ? "update" : "add"
      } this blog post?`
    );
    if (confirmed) {
      try {
        if (
          !title ||
          !shortDescription ||
          !url ||
          !mainPicture ||
          !altName ||
          !content
        ) {
          setMessage("Please fill in all fields");
          setSeverity("error");
          setOpenSnackbar(true);
          return;
        }

        setLoading(true);
        const fileName = mainPicture ? mainPicture.name : null;
        const formattedUrl = url.toLowerCase().replace(/\s+/g, "-");
        const urlExists = await checkDuplicateUrl(url);
        if (urlExists) {
          setMessage("URL already exists. Please choose a unique URL.");
          setSeverity("error");
          setOpenSnackbar(true);
          setLoading(false);
          return;
        }

        const postData = {
          authorId,
          title,
          shortDescription,
          content,
          url: formattedUrl,
          altName,
          imageUrl: fileName,
          imageFile: mainPicture,
        };
        if (!isEditMode) {
          const postId = await addBlogPost(postData);
          await uploadImage(mainPicture, authorId, postId);
        } else {
          const updatePostId = localStorage.getItem("postId");
          if (updatePostId) {
            const file = localStorage.getItem("mainPicture");
            const updateFileName = file.split("/").pop();
            await deleteImage(authorId, updatePostId, updateFileName);
            await uploadImage(mainPicture, authorId, updatePostId);
            await updateBlogPost(updatePostId, postData);
          }
        }
        setMessage("Uploaded successfully!");
        setSeverity("success");
        setOpenSnackbar(true);
        setLoading(false);
        localStorage.clear();

        setTitle("");
        setShortDescription("");
        setUrl("");
        setContent("");
        setMainPicture(null);
        setAltName("");
        setFileInputKey(Date.now());
      } catch (error) {
        setMessage("Error adding blog post");
        setSeverity("error");
        setOpenSnackbar(true);
        setLoading(false);
        console.error("Error adding blog post:", error);
      }
    }
  };

  return (
    <div className={styles.editorContainer}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className={styles.detailsImage}>
        <TextField
          label="URL"
          variant="outlined"
          placeholder="Enter blog URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <TextField
          label="Title"
          variant="outlined"
          placeholder="Choose a title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          variant="outlined"
          multiline
          rows={4}
          placeholder="Enter a short description (max 150 chars)..."
          inputProps={{ maxLength: 150 }}
          value={shortDescription}
          onChange={handleShortDescriptionChange}
        />
        <Typography>{shortDescription.length}/150</Typography>
        <input
          type="file"
          accept="image/*"
          onChange={handleMainPictureChange}
          key={fileInputKey}
        />
        <TextField
          label="Alt Name"
          variant="outlined"
          placeholder="Enter alt name for the picture..."
          value={altName}
          onChange={handleAltNameChange}
        />
      </div>
      <div className={styles.mainBlog}>
        <GoogleSearchResult
          title={title}
          description={shortDescription}
          url={url}
        />
        <trix-editor
          input="content"
          onChange={(event) => setContent(event.target.innerHTML)}
        ></trix-editor>
        <input id="content" type="hidden" value={content} />
        <button onClick={handleAddBlogPost}>
          {isEditMode ? "Update Translate" : "Add Translation"}
        </button>
        {isEditMode && (
          <button onClick={() => localStorage.clear()}>
            Reset to Add Post
          </button>
        )}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={handleCloseSnackbar}
            severity={severity}
          >
            {message}
          </MuiAlert>
        </Snackbar>
      </div>
    </div>
  );
};

export default TextEditor;
