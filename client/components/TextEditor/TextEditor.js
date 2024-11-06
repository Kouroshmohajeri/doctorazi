"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  TextField,
  Typography,
  Snackbar,
  CircularProgress,
  Backdrop,
  Button,
  Grid,
  Paper,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
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
import "react-quill/dist/quill.snow.css"; // Import Quill's CSS
import ReactQuill from "react-quill"; // Import React Quill
import styles from "./TextEditor.module.css";
import Image from "next/image";

const TextEditor = () => {
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [url, setUrl] = useState("");
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
  const [editorContent, setEditorContent] = useState("");

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
    if (savedContent) setEditorContent(savedContent);
    if (savedAltName) setAltName(savedAltName);
  }, []);

  useEffect(() => {
    localStorage.setItem("title", title);
    localStorage.setItem("shortDescription", shortDescription);
    localStorage.setItem("url", url);
    localStorage.setItem("content", editorContent);
    localStorage.setItem("altName", altName);
  }, [title, shortDescription, url, editorContent, altName]);

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
        const content = editorContent;

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
            if (
              !mainPicture.name &&
              mainPicture.includes("https://doctorazi.com:8443/blogs/")
            ) {
              const updatePostData = {
                authorId,
                title,
                shortDescription,
                content,
                url: formattedUrl,
                altName,
                imageUrl: fileName,
              };
              await updateBlogPost(updatePostId, updatePostData);
            } else {
              const file = localStorage.getItem("mainPicture");
              const updateFileName = file.split("/").pop();
              await deleteImage(authorId, updatePostId, updateFileName);
              await uploadImage(mainPicture, authorId, updatePostId);
              await updateBlogPost(updatePostId, postData);
            }
          }
        }
        setMessage("Uploaded successfully!");
        setSeverity("success");
        setOpenSnackbar(true);
        setLoading(false);
        localStorage.removeItem("title");
        localStorage.removeItem("shortDescription");
        localStorage.removeItem("url");
        localStorage.removeItem("content");
        localStorage.removeItem("altName");
        localStorage.removeItem("mainPicture");
        localStorage.removeItem("editMode");

        setTitle("");
        setShortDescription("");
        setUrl("");
        setEditorContent(""); // Clear the editor
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

  const handleDeleteImage = async () => {
    setMainPicture(null);
    setFileInputKey(Date.now()); // Reset file input
  };

  const handleResetToAdd = () => {
    localStorage.removeItem("title");
    localStorage.removeItem("shortDescription");
    localStorage.removeItem("url");
    localStorage.removeItem("content");
    localStorage.removeItem("altName");
    localStorage.removeItem("mainPicture");
    localStorage.removeItem("editMode");
    localStorage.removeItem("postId");
    setTitle("");
    setShortDescription("");
    setUrl("");
    setEditorContent(""); // Clear the editor
    setMainPicture(null);
    setAltName("");
  };

  const googlePreview = (
    <div className={styles.googlePreview}>
      <div>
        <Typography variant="h6" style={{ fontWeight: "bold" }}>
          <span style={{ color: "#4285F4" }}>G</span>
          <span style={{ color: "#EA4335" }}>o</span>
          <span style={{ color: "#FABC05" }}>o</span>
          <span style={{ color: "#4285F4" }}>g</span>
          <span style={{ color: "#34A853" }}>l</span>
          <span style={{ color: "#EA4335" }}>e</span> Preview
        </Typography>
        <div className={styles.googlePreviewCard}>
          <div className={styles.previewLink}>
            <Image
              src="/images/logo/logo.jpg"
              width="30"
              height="30"
              style={{ borderRadius: "50%" }}
            />
            <div className={styles.details}>
              <Typography variant="body2">DoctorAzi</Typography>

              <Typography variant="body2" className={styles.googlePreviewUrl}>
                {url
                  ? `https://doctorazi.com/${url}`
                  : "https://doctorazi.com/your-url"}
              </Typography>
            </div>
          </div>
          <Typography className={styles.googlePreviewTitle}>
            {title || "Your Blog Title"}
          </Typography>
          <Typography
            variant="body2"
            className={styles.googlePreviewDescription}
          >
            {shortDescription || "Short description of your blog post..."}
          </Typography>
        </div>
      </div>
      <div>
        {mainPicture && (
          <Image
            src={URL.createObjectURL(mainPicture)}
            alt={altName}
            width="100"
            height="100"
            className={styles.googleImage}
          />
        )}
      </div>
    </div>
  );

  return (
    <Paper className={styles.container}>
      <Typography variant="h4" className={styles.title}>
        {isEditMode ? "Edit Blog Post" : "Add Blog Post"}
      </Typography>
      <Grid container spacing={2} className={styles.formContainer}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="URL"
            variant="outlined"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Short Description"
            variant="outlined"
            multiline
            rows={3}
            value={shortDescription}
            onChange={handleShortDescriptionChange}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <div className={styles.buttons}>
            <Button
              variant="contained"
              component="label"
              className={styles.uploadButton}
            >
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleMainPictureChange}
                hidden
                key={fileInputKey}
              />
            </Button>
            {mainPicture && (
              <>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleDeleteImage}
                  className={styles.deleteButton}
                >
                  Delete Image
                </Button>
              </>
            )}
          </div>
          {mainPicture && (
            <TextField
              fullWidth
              label="Alt Name"
              variant="outlined"
              value={altName}
              onChange={handleAltNameChange}
              required
            />
          )}
        </Grid>
      </Grid>
      {googlePreview}
      <ReactQuill
        value={editorContent}
        onChange={setEditorContent}
        placeholder="Write your blog content here..."
        className={styles.quillEditor}
      />
      <div className={styles.submitButton}>
        <Button variant="contained" color="primary" onClick={handleAddBlogPost}>
          {isEditMode ? "Update Blog Post" : "Add Blog Post"}
        </Button>
      </div>
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
      <Backdrop open={loading} className={styles.backdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Paper>
  );
};

export default TextEditor;
