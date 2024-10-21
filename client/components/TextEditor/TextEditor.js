"use client";
import React, { useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
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

const FroalaEditorComponent = dynamic(
  async () => {
    const result = await Promise.all([
      import("react-froala-wysiwyg"),
      import("froala-editor/js/plugins.pkgd.min.js"),
    ]);
    return result[0];
  },
  { ssr: false }
);
const FroalaEditorView = dynamic(
  () => import("react-froala-wysiwyg/FroalaEditorView"),
  { ssr: false }
);

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
  const [key, setKey] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [isEditMode, setIsEditMode] = useState(false);
  const { users, fetchCookies } = useContext(UserDataContext);

  useEffect(() => {
    fetchCookies();
    if (localStorage.getItem("mainPicture")) {
      setMainPicture(localStorage.getItem("mainPicture"));
    }
    console.log(localStorage.getItem("isEditMode"));
    // Check if isEditMode is set in localStorage
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
    // Load data from localStorage when the component mounts
    const savedTitle = localStorage.getItem("title");
    const savedShortDescription = localStorage.getItem("shortDescription");
    const savedUrl = localStorage.getItem("url");
    const savedContent = localStorage.getItem("model");
    const savedAltName = localStorage.getItem("altName");

    if (savedTitle) setTitle(savedTitle);
    if (savedShortDescription) setShortDescription(savedShortDescription);
    if (savedUrl) setUrl(savedUrl);
    if (savedContent) setContent(savedContent);
    if (savedAltName) setAltName(savedAltName);
  }, []);

  useEffect(() => {
    // Save data to localStorage whenever it changes
    localStorage.setItem("title", title);
    localStorage.setItem("shortDescription", shortDescription);
    localStorage.setItem("url", url);
    localStorage.setItem("model", content);
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
    const alt = event.target.value;
    setAltName(alt);
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
        // Extract file name from mainPicture
        const fileName = mainPicture ? mainPicture.name : null;
        // Convert URL to lowercase and replace spaces with hyphens
        const formattedUrl = url.toLowerCase().replace(/\s+/g, "-");
        // Checking Url
        const urlExists = await checkDuplicateUrl(url);
        if (urlExists) {
          setMessage("URL already exists. Please choose a unique URL.");
          setSeverity("error");
          setOpenSnackbar(true);
          setLoading(false);
          return;
        }

        // Construct postData object with the formatted URL
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
          // Add the blog post
          const postId = await addBlogPost(postData);

          // Add main image
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
        // Clear local storage after successful submission
        localStorage.removeItem("title");
        localStorage.removeItem("shortDescription");
        localStorage.removeItem("url");
        localStorage.removeItem("model");
        localStorage.removeItem("altName");
        localStorage.removeItem("mainPicture");
        localStorage.removeItem("editMode");

        // Clearing the fields
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

  const handleDeleteImage = async (imageSrc) => {
    try {
      await deleteBlogImage(imageSrc);
      setKey(!key);
    } catch (error) {
      console.error("Error deleting image:", error);
      // Handle error
    }
  };

  const handleResetToAdd = () => {
    localStorage.removeItem("title");
    localStorage.removeItem("shortDescription");
    localStorage.removeItem("url");
    localStorage.removeItem("model");
    localStorage.removeItem("altName");
    localStorage.removeItem("mainPicture");
    localStorage.removeItem("editMode");
    localStorage.removeItem("postId");
    setTitle("");
    setShortDescription("");
    setUrl("");
    setContent("");
    setMainPicture(null);
    setAltName("");
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
        <div className={styles.blogDetails}>
          <div className={styles.titleUrl}>
            <div className={styles.urlField}>
              <label>Blog URL:</label>
              <br />
              <TextField
                label="URL"
                variant="outlined"
                placeholder="Enter blog URL..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <div className={styles.title}>
              <label>Choose a title:</label>
              <br />
              <TextField
                label="Title"
                variant="outlined"
                placeholder="Choose a title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.shortDesc}>
            <label>Short description:</label>
            <TextField
              className={styles.textField}
              variant="outlined"
              multiline
              rows={4}
              placeholder="Enter a short description (max 150 chars)..."
              inputProps={{ maxLength: 150 }}
              value={shortDescription}
              onChange={handleShortDescriptionChange}
            />
            <Typography
              variant="body2"
              color={shortDescription.length <= 150 ? "textPrimary" : "error"}
            >
              {shortDescription.length}/150
            </Typography>
            <Typography>This will be shown in the meta tag</Typography>
          </div>
        </div>
        <div className={styles.imageDetails}>
          <div className={styles.imageAlt}>
            <div className={styles.mainPicture}>
              <label>Main Picture:</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleMainPictureChange}
                key={fileInputKey}
              />
              <br />
            </div>
            <div className={styles.altName}>
              <label>Alt Name:</label>
              <br />
              <TextField
                label="Alt Name"
                variant="outlined"
                placeholder="Enter alt name for the picture..."
                value={altName}
                onChange={handleAltNameChange}
              />
            </div>
            <br />
          </div>
          <div className={styles.imagePreview}>
            {mainPicture && (
              <>
                <img
                  src={
                    mainPicture.name ||
                    !mainPicture.includes("https://doctorazi.com:8443/blogs")
                      ? URL.createObjectURL(mainPicture)
                      : mainPicture
                  }
                  alt={altName}
                  className={styles.mainPicturePreview}
                  width={100}
                  height={100}
                />
                <label>{altName}</label>
              </>
            )}
            <br />
          </div>
        </div>
      </div>
      <div className={styles.mainBlog}>
        {title && (
          <GoogleSearchResult
            title={title}
            description={shortDescription}
            url={url}
          />
        )}
        <br />
        <div>
          <FroalaEditorComponent
            key={key}
            tag="textarea"
            config={{
              placeholderText: "Let's write a blog...",
              toolbarButtons: {
                moreText: {
                  buttons: [
                    "bold",
                    "italic",
                    "underline",
                    "strikeThrough",
                    "subscript",
                    "superscript",
                    "fontFamily",
                    "fontSize",
                    "textColor",
                    "backgroundColor",
                    "inlineClass",
                    "inlineStyle",
                    "clearFormatting",
                  ],
                },
                moreParagraph: {
                  buttons: [
                    "alignLeft",
                    "alignCenter",
                    "formatOLSimple",
                    "alignRight",
                    "alignJustify",
                    "formatOL",
                    "formatUL",
                    "paragraphFormat",
                    "paragraphStyle",
                    "lineHeight",
                    "outdent",
                    "indent",
                    "quote",
                  ],
                },
                moreRich: {
                  buttons: [
                    "insertLink",
                    "insertImage",
                    "insertVideo",
                    "insertTable",
                    "emoticons",
                    "fontAwesome",
                    "specialCharacters",
                    "embedly",
                    "insertFile",
                    "insertHR",
                  ],
                },
                moreMisc: {
                  buttons: [
                    "undo",
                    "redo",
                    "fullscreen",
                    "print",
                    "getPDF",
                    "spellChecker",
                    "selectAll",
                    "html",
                    "help",
                  ],
                  align: "right",
                  buttonsVisible: 2,
                },
              },
              imageUploadURL:
                "https://doctorazi.com:8443/api/blogImages/upload",
              imageUploadParam: "file",
              imageUploadMethod: "POST",
              imageMaxSize: 6 * 1024 * 1024, // 6MB max image size
              imageManagerLoadURL:
                "https://doctorazi.com:8443/api/blogImages/images",
              imageManagerDeleteURL:
                "https://doctorazi.com:8443/api/blogImages/delete", // Added this line for deleting an image
              imageManagerDeleteMethod: "DELETE",
              // imageEditButtons: ['imageAlt', 'imageReplace', 'imageRemove'],
              events: {
                "image.uploaded": function (response) {
                  const jsonResponse = JSON.parse(response);
                },
                "image.error": function (error) {
                  console.log("Image upload error:", error);
                },
                "imageManager.beforeDeleteImage": function (image) {
                  const imageSrc = image[0].src;
                  handleDeleteImage(imageSrc);

                  return false;
                },
              },
            }}
            model={content}
            onModelChange={setContent}
          />

          <br />
          <div className={`${styles.btns}`}>
            <button
              className={`btn btn-primary mx-auto ${styles.addBlog}`}
              onClick={handleAddBlogPost}
            >
              {isEditMode ? "Update Translate" : "Add Translation"}
            </button>
            {isEditMode && (
              <button
                onClick={handleResetToAdd}
                className={`btn btn-secondary ${styles.addBlog}`}
              >
                Reset to Add post
              </button>
            )}
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
          <br />
          {content !== "" && (
            <>
              <h3>Preview</h3>
              <div className={styles.previewContainer}>
                <h1>{title}</h1>
                <meta name="description" content={shortDescription} />
                <FroalaEditorView model={content} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
