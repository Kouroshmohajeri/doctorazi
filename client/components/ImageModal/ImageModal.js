import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

const ImageModal = ({ open, onClose, imageUrl, folderName, path }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="image-modal-title"
      aria-describedby="image-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          outline: "none",
          borderRadius: "15px",
        }}
      >
        <img
          src={`https://doctorazi.com:8443/${path}/${folderName}/${imageUrl}`}
          alt={imageUrl}
        />
      </Box>
    </Modal>
  );
};

export default ImageModal;
