import React from "react";
import { Box, Typography, Button, Modal, CardMedia } from "@mui/material";
import type { Institute } from "@/types/institute";

interface InstituteModalProps {
  open: boolean;
  onClose: () => void;
  institute: Institute | null;
}

const InstituteModal: React.FC<InstituteModalProps> = ({
  open,
  onClose,
  institute,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="institute-modal-title"
      aria-describedby="institute-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 350, md: 400 }, // Responsive modal width
          bgcolor: "background.paper", // #F5F5F5 from theme
          borderRadius: 3,
          boxShadow: 24,
          p: { xs: 2, sm: 3, md: 4 }, // Responsive padding
        }}
      >
        {institute?.image_url ? (
          <CardMedia
            component="img"
            sx={{
              height: { xs: 100, sm: 120, md: 140 },
              objectFit: "contain",
              width: "100%",
              mb: 2,
              borderRadius: 2,
            }}
            image={institute.image_url}
            alt={`${institute.institute_name} image`}
          />
        ) : (
          <Box
            sx={{
              height: { xs: 100, sm: 120, md: 140 },
              width: "100%",
              bgcolor: "grey.200",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
              borderRadius: 2,
            }}
          >
            <Typography variant="body2" color="textSecondary">
              No Image
            </Typography>
          </Box>
        )}
        <Typography
          id="institute-modal-title"
          variant="h6"
          component="h2"
          gutterBottom
          sx={{
            fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" }, // Responsive font size
          }}
        >
          {institute?.institute_name || "Institute Details"}
        </Typography>
        <Typography
          id="institute-modal-description"
          variant="body1"
          color="textSecondary"
          sx={{
            fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" }, // Responsive font size
          }}
        >
          Category: {institute?.institute_category || "N/A"}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={onClose}
          sx={{ mt: 2 }}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default InstituteModal;
