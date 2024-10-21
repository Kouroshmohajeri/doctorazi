import React, { useContext, useEffect, useState } from "react";
import CardComponent from "../Card/CardComponent";
import { UserDataContext } from "@/context/UserDatasContext";
import { getAuthorByUserId } from "@/lib/actions/authors/actions";
import {
  deleteBlogPost,
  deleteFolder,
  getRejectedBlogPosts,
  getRejectedBlogPostsByAuthorId,
  updateRejectStatus,
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
import RemoveCircleOutlineSharpIcon from "@mui/icons-material/RemoveCircleOutlineSharp";
import Link from "next/link";
import TextField from "@mui/material/TextField";
import CheckCircleOutlineSharpIcon from "@mui/icons-material/CheckCircleOutlineSharp";

export default function RejectedPosts({ heading }) {
  const { users, fetchCookies } = useContext(UserDataContext);
  const [authorId, setAuthorId] = useState(0);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [postToReject, setPostToReject] = useState(null);
  const [backdropOpen, setBackdropOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const { setIsSelected } = useContext(sideMenuContext);
  const { refresh, setRefresh } = useContext(ClinicalRecordContext);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCookies();
  }, []);

  useEffect(() => {
    const fetchAuthorDatas = async () => {
      try {
        const author = await getAuthorByUserId(users.id);
        if (author) {
          setAuthorId(author.authorId);
        }
      } catch (error) {
        console.log("Error fetching author: ", error);
      }
    };
    fetchAuthorDatas();
  }, [users.id]);

  const fetchPosts = async () => {
    try {
      let posts;
      if (users.type === 4) {
        posts = await getRejectedBlogPosts();
      } else {
        posts = await getRejectedBlogPostsByAuthorId(authorId);
      }
      if (posts) {
        setPosts(Array.isArray(posts) ? posts : [posts]);
        setFilteredPosts(Array.isArray(posts) ? posts : [posts]);
      }
    } catch (error) {
      console.log("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    if (authorId || users.type === 4) {
      fetchPosts();
    }
  }, [authorId, refresh, users.type]);

  const onClickPostHandler = (post) => {
    localStorage.removeItem("title");
    localStorage.removeItem("shortDescription");
    localStorage.removeItem("url");
    localStorage.removeItem("model");
    localStorage.removeItem("altName");
    localStorage.removeItem("mainPicture");
    localStorage.removeItem("editMode");
    localStorage.removeItem("postId");
    // Setting editor for update
    localStorage.setItem("postId", post.post_id);
    localStorage.setItem("title", post.title);
    localStorage.setItem("shortDescription", post.shortDescription);
    localStorage.setItem("url", post.url);
    localStorage.setItem("model", post.content);
    localStorage.setItem("altName", post.altName);
    localStorage.setItem("editMode", true);
    localStorage.setItem(
      "mainPicture",
      `http://doctorazi.com:8443/blogs/${authorId}/${post.post_id}/${post.imageUrl}`
    );
    setIsSelected(1);
  };

  const handleClickOpenDelete = (post) => {
    setPostToDelete(post);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setPostToDelete(null);
  };

  const handleClickOpenReject = (post) => {
    setPostToReject(post);
    setOpenReject(true);
  };

  const handleCloseReject = () => {
    setOpenReject(false);
    setPostToReject(null);
  };

  const handleConfirmDelete = async () => {
    if (postToDelete) {
      setBackdropOpen(true);
      try {
        await deleteBlogPost(postToDelete.post_id);
        await deleteFolder(authorId, postToDelete.post_id);
        setSnackbarSeverity("success");
        setSnackbarMessage("Post deleted successfully");
        setRefresh(!refresh);
      } catch (error) {
        setSnackbarSeverity("error");
        setSnackbarMessage("Error deleting post");
        console.log("Error deleting: ", error);
      } finally {
        setBackdropOpen(false);
        setSnackbarOpen(true);
        handleCloseDelete();
      }
    }
  };

  const handleConfirmReject = async () => {
    if (postToReject) {
      setBackdropOpen(true);
      try {
        await updateRejectStatus(postToReject.post_id, false, users.id);
        setSnackbarSeverity("success");
        setSnackbarMessage("Post retrieved successfully");
        setRefresh(!refresh);
      } catch (error) {
        setSnackbarSeverity("error");
        setSnackbarMessage("Error retrieving post");
        console.log("Error retrieving: ", error);
      } finally {
        setBackdropOpen(false);
        setSnackbarOpen(true);
        handleCloseReject();
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
                src={`http://doctorazi.com:8443/blogs/${authorId}/${post.post_id}/${post.imageUrl}`}
                alt={post.altName}
                desc={post.shortDescription}
              />
            </Link>
            <ButtonGroup
              disableElevation
              variant="outlined"
              aria-label="Disabled button group"
            >
              {authorId === post.author_id && (
                <Button
                  onClick={() => {
                    onClickPostHandler(post);
                  }}
                >
                  <EditSharpIcon />
                </Button>
              )}
              <Button
                onClick={() => {
                  handleClickOpenDelete(post);
                }}
              >
                <DeleteOutlineSharpIcon sx={{ color: "crimson" }} />
              </Button>
              {users.type === 4 && (
                <Button
                  onClick={() => {
                    handleClickOpenReject(post);
                  }}
                >
                  <CheckCircleOutlineSharpIcon sx={{ color: "#058c42" }} />
                </Button>
              )}
            </ButtonGroup>
          </div>
        ))}
      </div>
      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Post"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this post? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openReject}
        onClose={handleCloseReject}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Reject Post"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to retrieve this post? You can reject it from
            All blogs.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReject}>Cancel</Button>
          <Button onClick={handleConfirmReject} autoFocus>
            Reject
          </Button>
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
}
