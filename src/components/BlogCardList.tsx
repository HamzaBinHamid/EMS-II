import React from "react";
import BlogCard from "@/components/BlogCard";
import { Box, Typography } from "@mui/material";

// Define card data type
interface CardData {
  imageFileName: string;
  buttonText?: string;
  navigateTo?: string;
  openModal?: string; // allow modal option
}

const BlogCardList: React.FC = () => {
  const cards: CardData[] = [
    {
      imageFileName: "fee.png",
      buttonText: "Fee Structure",
      openModal: "feeStructure",
    },
    {
      imageFileName: "admission.png",
      buttonText: "Apply Online",
    openModal: "admissionForm",
    },
  ];

  if (!cards || cards.length === 0) {
    return (
      <Typography variant="body1" align="center" sx={{ mt: 4 }}>
        No articles available at the moment.
      </Typography>
    );
  }

  return (
    <Box
      component="section"
      aria-label="Latest blog posts"
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(2, 1fr)",
          lg: "repeat(2, 1fr)",
        },
        gap: 3,
        p: { xs: 2, sm: 3, md: 4 },
        maxWidth: "1200px",
        margin: "auto",
      }}
    >
      {cards.map((card, index) => (
        <BlogCard
          key={`card-${index}`}
          imageFileName={card.imageFileName}
          buttonText={card.buttonText}
          navigateTo={card.navigateTo}
          openModal={card.openModal}
        />
      ))}
    </Box>
  );
};

export default BlogCardList;
