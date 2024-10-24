import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import styles from "./FileModal.module.css";
import ImageModal from "../ImageModal/ImageModal";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import {
  deleteFileInFolder,
  getFilesInFolder,
} from "@/lib/actions/uploadClinicalRecords/actions";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import MyModal from "../MyModal/MyModal";
import {
  deletePrescriptionFileInFolder,
  getPrescriptionFile,
} from "@/lib/actions/prescriptions/actions";
import { downloadFile } from "@/lib/actions/downloader/actions";

const FileModal = ({ open, onClose, folderName, path, userType, fileType }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      let response;
      try {
        setLoading(true);
        if (fileType && fileType === "crecord") {
          response = await getFilesInFolder(folderName);
        } else {
          response = await getPrescriptionFile(folderName);
        }
        setFiles(response.files);
      } catch (error) {
        console.error("Error fetching files:", error);
      } finally {
        setLoading(false);
      }
    };

    if (open && folderName) {
      fetchFiles();
    }
  }, [open, folderName, refresh]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseImageModal = () => {
    setSelectedImage(null);
  };

  const handleConfirmationOpen = (file) => {
    setFileToDelete(file);
    setConfirmationOpen(true);
  };

  const handleConfirmationClose = () => {
    setConfirmationOpen(false);
  };

  const deleteHandler = async () => {
    try {
      setDeleting(true);
      if (fileType && fileType === "crecord") {
        await deleteFileInFolder(folderName, fileToDelete);
      } else {
        await deletePrescriptionFileInFolder(folderName, fileToDelete);
      }
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error deleting file:", error);
    } finally {
      setDeleting(false);
      setConfirmationOpen(false);
    }
  };

  const handleDownload = async (folder, file) => {
    try {
      await downloadFile(folder, file);
      // Optional: Handle success or notify the user here
    } catch (error) {
      console.error("Error handling download:", error);
      // Optional: Handle error or notify the user
    }
  };

  return (
    <>
      <Backdrop open={deleting} sx={{ zIndex: 999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            borderRadius: "15px",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Files in Folder
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <ul className={styles.listContainer}>
              {files.map((file, index) => (
                <li key={index} className={styles.listItem}>
                  <img
                    src={`https://doctorazi.com/api/${path}/${folderName}/${file}`}
                    width={100}
                    height={100}
                    onClick={() => handleImageClick(file)}
                  />
                  {file}
                  {fileType === "precord" && (
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => handleDownload(folderName, file)}
                    >
                      Download
                    </button>
                  )}
                  {((userType === 2 && fileType === "precord") ||
                    (userType === 1 && fileType === "crecord")) && (
                    <>
                      <button
                        className={styles.btnDelete}
                        onClick={() => handleConfirmationOpen(file)}
                      >
                        <CloseSharpIcon />
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Box>
      </Modal>
      <ImageModal
        open={!!selectedImage}
        onClose={handleCloseImageModal}
        imageUrl={selectedImage}
        path={path}
        folderName={folderName}
      />
      <MyModal
        open={confirmationOpen}
        onClose={handleConfirmationClose}
        onConfirm={deleteHandler}
        title="Confirm Deletion"
        description={`Are you sure you want to delete ${fileToDelete}?`}
        currentUserRole="user"
      />
    </>
  );
};

export default FileModal;
