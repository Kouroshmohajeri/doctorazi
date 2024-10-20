import React, { useContext, useEffect, useState } from "react";
import CardComponent from "../Card/CardComponent";
import { UserDataContext } from "@/context/UserDatasContext";
import {
  getTranslatedBlogPostsByTranslatorId,
  deleteBlogPost,
  deleteFolder,
  addTranslationToBlogPost,
} from "@/lib/actions/blogPost/actions";
import styles from "../BlogsManagement/PostsManagement.module.css";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import DeleteOutlineSharpIcon from "@mui/icons-material/DeleteOutlineSharp";
import EditSharpIcon from "@mui/icons-material/EditSharp";
import { sideMenuContext } from "@/context/SideMenuContext";
import { ClinicalRecordContext } from "@/context/ClinicalRecordContext";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Link from "next/link";
import TextField from "@mui/material/TextField";
import { getTranslatorByUserId } from "@/lib/actions/translator/actions";
import { translateContext } from "@/context/TranslateMode";

const MyTranslations = ({ heading }) => {
  const { users, fetchCookies } = useContext(UserDataContext);
  const { setIsSelected } = useContext(sideMenuContext);
  const { refresh, setRefresh } = useContext(ClinicalRecordContext);
  const { isTranslateModeOn, setIsTranslateModeOn } =
    useContext(translateContext);
  const [translatorId, setTranslatorId] = useState(0);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [backdropOpen, setBackdropOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteOption, setDeleteOption] = useState(null);

  useEffect(() => {
    fetchCookies();
  }, []);

  useEffect(() => {
    const fetchTranslatorId = async () => {
      try {
        if (users.id) {
          const response = await getTranslatorByUserId(users.id);
          setTranslatorId(response.translatorId);
        }
      } catch (error) {
        console.log("Error fetching translator ID: ", error);
      }
    };
    fetchTranslatorId();
  }, [users.id]);

  const fetchPosts = async () => {
    try {
      const posts = await getTranslatedBlogPostsByTranslatorId(translatorId);
      if (posts) {
        setPosts(Array.isArray(posts) ? posts : [posts]);
        setFilteredPosts(Array.isArray(posts) ? posts : [posts]);
      }
    } catch (error) {
      console.log("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    if (translatorId) {
      fetchPosts();
    }
  }, [translatorId, refresh]);

  const onClickPostHandler = (post) => {
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
    localStorage.setItem("translateTitleEdit", post.translatedTitle);
    localStorage.setItem(
      "translateShortDescriptionEdit",
      post.translatedShortDescription
    );
    localStorage.setItem("translateContentEdit", post.translatedContent);
    localStorage.setItem("translateEditMode", true);
    setIsSelected(3);
    setIsTranslateModeOn(false);
  };

  const handleClickOpen = (post) => {
    setPostToDelete(post);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPostToDelete(null);
    setDeleteOption(null);
  };

  const handleConfirmDelete = async (allowOthersToTranslate) => {
    if (postToDelete) {
      setBackdropOpen(true);
      try {
        let translationData;
        if (allowOthersToTranslate) {
          translationData = {
            translatedTitle: "",
            translatedShortDescription: "",
            translatedContent: "",
            translatorId: null,
            isTranslated: false,
          };
        } else {
          translationData = {
            translatedTitle: "",
            translatedShortDescription: "",
            translatedContent: "",
            translatorId: translatorId,
            isTranslated: true,
          };
        }
        await addTranslationToBlogPost(postToDelete.post_id, translationData);

        setSnackbarSeverity("success");
        setSnackbarMessage("Translation deleted successfully");
        setRefresh(!refresh);
      } catch (error) {
        setSnackbarSeverity("error");
        setSnackbarMessage("Error deleting translation");
        console.log("Error deleting: ", error);
      } finally {
        setBackdropOpen(false);
        setSnackbarOpen(true);
        handleClose();
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
                src={`http://doctorazi.com:8800/blogs/${post.author_id}/${post.post_id}/${post.imageUrl}`}
                alt={post.altName}
                desc={post.shortDescription}
              />
            </Link>
            <ButtonGroup
              disableElevation
              variant="outlined"
              aria-label="Disabled button group"
            >
              <Button onClick={() => onClickPostHandler(post)}>
                <EditSharpIcon />
              </Button>
              <Button onClick={() => handleClickOpen(post)}>
                <DeleteOutlineSharpIcon sx={{ color: "crimson" }} />
              </Button>
            </ButtonGroup>
          </div>
        ))}
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Post"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want others to be able to translate this post?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => handleConfirmDelete(true)}>Yes</Button>
          <Button onClick={() => handleConfirmDelete(false)}>No</Button>
        </DialogActions>
      </Dialog>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backdropOpen}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MyTranslations;
