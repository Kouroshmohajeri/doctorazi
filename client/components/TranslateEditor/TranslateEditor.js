"use client";
import React, { useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import styles from "./TranslateEditor.module.css";
import { UserDataContext } from "@/context/UserDatasContext";
import {
  getBlogPostByPostId,
  updateBlogPost,
  addTranslationToBlogPost,
} from "@/lib/actions/blogPost/actions";
import { getTranslatorByUserId } from "@/lib/actions/translator/actions";
import { translateContext } from "@/context/TranslateMode";
import { sideMenuContext } from "@/context/SideMenuContext";

// Dynamically import Quill to prevent SSR issues
const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const TranslateEditor = () => {
  const [translateTitle, setTranslateTitle] = useState("");
  const [translateShortDescription, setTranslateShortDescription] =
    useState("");
  const [translateContent, setTranslateContent] = useState("");
  const [existingTitle, setExistingTitle] = useState("");
  const [existingShortDescription, setExistingShortDescription] = useState("");
  const [existingContent, setExistingContent] = useState("");
  const [translatorId, setTranslatorId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("error");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { users, fetchCookies } = useContext(UserDataContext);
  const { isTranslateModeOn, setIsTranslateModeOn } =
    useContext(translateContext);
  const { setIsSelected } = useContext(sideMenuContext);

  useEffect(() => {
    fetchCookies();
  }, []);

  useEffect(() => {
    const fetchTranslatorId = async () => {
      try {
        const translatorData = await getTranslatorByUserId(users.id);
        setTranslatorId(translatorData.translatorId);
      } catch (error) {
        console.error("Error fetching author ID:", error.message);
      }
    };
    fetchTranslatorId();
  }, [users.id]);

  useEffect(() => {
    const fetchPostData = async () => {
      const postId = localStorage.getItem("translatePostId");
      if (postId) {
        try {
          const postData = await getBlogPostByPostId(postId);
          if (isTranslateModeOn) {
            setExistingTitle(postData.title);
            setExistingShortDescription(postData.shortDescription);
            setExistingContent(postData.content);
          } else {
            setExistingTitle(postData.translatedTitle);
            setExistingShortDescription(postData.translatedShortDescription);
            setExistingContent(postData.translatedContent);
          }
        } catch (error) {
          console.error("Error fetching post data:", error.message);
        }
      }
    };
    fetchPostData();
  }, []);

  useEffect(() => {
    const translatedTitleEdit = localStorage.getItem("translateTitleEdit");
    const translatedShortDescriptionEdit = localStorage.getItem(
      "translateShortDescriptionEdit"
    );
    const translatedContentEdit = localStorage.getItem("translateContentEdit");

    if (translatedTitleEdit) setTranslateTitle(translatedTitleEdit);
    if (translatedShortDescriptionEdit)
      setTranslateShortDescription(translatedShortDescriptionEdit);
    if (translatedContentEdit) setTranslateContent(translatedContentEdit);
  }, []);

  const handleTranslateShortDescriptionChange = (event) => {
    const input = event.target.value;
    if (input.length <= 150) {
      setTranslateShortDescription(input);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleAddTranslatePost = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to ${
        isTranslateModeOn ? "update" : "add"
      } this translation post?`
    );
    if (confirmed) {
      try {
        if (
          !translateTitle ||
          !translateShortDescription ||
          !translateContent
        ) {
          setMessage("Please fill in all fields");
          setSeverity("error");
          setOpenSnackbar(true);
          return;
        }

        setLoading(true);

        const translationData = {
          translatedTitle: translateTitle,
          translatedShortDescription: translateShortDescription,
          translatedContent: translateContent,
          translatorId: translatorId,
          isTranslated: true,
        };
        const postId = localStorage.getItem("translatePostId");
        await addTranslationToBlogPost(postId, translationData);

        setMessage("Uploaded successfully!");
        setSeverity("success");
        setOpenSnackbar(true);
        setLoading(false);
        localStorage.removeItem("postId");
        localStorage.removeItem("translateTitle");
        localStorage.removeItem("translateShortDescription");
        localStorage.removeItem("translateContent");
        localStorage.removeItem("translateEditMode");

        setTranslateTitle("");
        setTranslateShortDescription("");
        setTranslateContent("");
        setIsTranslateModeOn(true);
        setIsSelected(1);
      } catch (error) {
        setMessage("Error adding translation post");
        setSeverity("error");
        setOpenSnackbar(true);
        setLoading(false);
        console.error("Error adding translation post:", error);
      }
    }
  };

  const handleResetToAdd = () => {
    localStorage.removeItem("translateTitle");
    localStorage.removeItem("translateShortDescription");
    localStorage.removeItem("translateContent");
    localStorage.removeItem("translateEditMode");
    localStorage.removeItem("translatePostId");
    setTranslateTitle("");
    setTranslateShortDescription("");
    setTranslateContent("");
  };

  return (
    <div className={styles.editorContainer}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className={styles.gridContainer}>
        <div className={styles.translateColumn}>
          <TextField
            label="Translate Title"
            variant="outlined"
            fullWidth
            value={translateTitle}
            onChange={(e) => setTranslateTitle(e.target.value)}
            className={styles.textField}
          />
          <TextField
            label="Translate Short Description"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            placeholder="Enter a short description (max 150 chars)..."
            inputProps={{ maxLength: 150 }}
            value={translateShortDescription}
            onChange={handleTranslateShortDescriptionChange}
            className={styles.textField}
          />
          <Typography
            variant="body2"
            color={
              translateShortDescription.length <= 150 ? "textPrimary" : "error"
            }
          >
            {translateShortDescription.length}/150
          </Typography>
          <QuillEditor
            theme="snow"
            value={translateContent}
            onChange={setTranslateContent}
            placeholder="Let's write a blog..."
            modules={{
              toolbar: [
                [{ header: "1" }, { header: "2" }, { font: [] }],
                [{ align: [] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image", "video"],
                ["clean"], // Remove formatting button
              ],
            }}
          />
        </div>
        <div className={styles.existingColumn}>
          <Typography variant="h6">Existing Title:</Typography>
          <Typography variant="body1">{existingTitle}</Typography>
          <Typography variant="h6">Existing Short Description:</Typography>
          <Typography variant="body1">{existingShortDescription}</Typography>
          <Typography variant="h6">Existing Content:</Typography>
          <Typography variant="body1">{existingContent}</Typography>
        </div>
      </div>
      <div className={styles.previewContainer}>
        <Typography variant="h6">Preview:</Typography>
        <Typography variant="body1">{translateContent}</Typography>
      </div>
      <div className={styles.actions}>
        <button
          className={styles.submitButton}
          onClick={handleAddTranslatePost}
        >
          {!isTranslateModeOn ? "Update" : "Add"} Translation
        </button>
        <button className={styles.resetButton} onClick={handleResetToAdd}>
          Reset
        </button>
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
    </div>
  );
};

export default TranslateEditor;
