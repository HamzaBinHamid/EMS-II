import React, { useState } from "react";
import { Card, CardActions, Box } from "@mui/material";
import Image from "next/image";
import { getImageUrl } from "@/lib/getImageUrl";
import { styled } from "@mui/material/styles";
import CustomButton from "./CustomButton";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useRouter } from "next/router";

interface BlogCardProps {
  imageFileName: string;
  alt?: string;
  buttonText?: string;
  navigateTo?: string; 
  onReadMore?: () => void; // 👈 Added prop
}

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 500,
  margin: theme.spacing(2, 3),
  borderRadius: Number(theme.shape.borderRadius) * 2,
  boxShadow: theme.shadows[5],
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: theme.shadows[10],
  },
  [theme.breakpoints.down("sm")]: {
    margin: theme.spacing(2),
  },
}));

const BlogCard: React.FC<BlogCardProps> = ({
  imageFileName,
  alt = "Blog image",
  buttonText = "Read more",
  navigateTo = "/features/FeePage",
  onReadMore, // 👈 Added here
}) => {
  const [imgSrc, setImgSrc] = useState<string>(() => {
    try {
      return getImageUrl(imageFileName);
    } catch (error) {
      console.error("Image fetch error:", error);
      return "/fallback.jpg";
    }
  });

  const router = useRouter();

  return (
    <StyledCard>
      {/* Image */}
      <Box
        sx={(theme) => ({
          position: "relative",
          width: "100%",
          aspectRatio: "16/9",
          overflow: "hidden",
          backgroundColor: theme.palette.grey[200],
          borderTopLeftRadius: Number(theme.shape.borderRadius) * 2,
          borderTopRightRadius: Number(theme.shape.borderRadius) * 2,
        })}
      >
        <Image
          src={imgSrc}
          alt={alt}
          fill
          style={{
            objectFit: "cover",
          }}
          sizes="(max-width: 600px) 100vw, 500px"
          priority
          onError={() => setImgSrc("/fallback.jpg")}
        />
      </Box>

      {/* Centered Button */}
      <CardActions sx={{ justifyContent: "center", p: 3 }}>
        <CustomButton
          onClick={() => {
            if (onReadMore) onReadMore(); // 👈 Trigger callback
            router.push(navigateTo);      // 👈 Navigate
          }}
          sx={{
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
            color: "#fff",
            fontWeight: 600,
            letterSpacing: "0.5px",
            borderRadius: "30px",
            fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
            padding: { xs: "6px 16px", sm: "8px 20px", md: "10px 26px" },
            boxShadow: (theme) => `0 4px 10px ${theme.palette.primary.main}40`,
            transition: "all 0.3s ease",
            "&:hover": {
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
              boxShadow: (theme) =>
                `0 6px 14px ${theme.palette.primary.dark}50`,
              transform: "translateY(-2px)",
            },
            "&:active": {
              transform: "translateY(0)",
              boxShadow: (theme) => `0 3px 6px ${theme.palette.primary.dark}40`,
            },
          }}
          endIcon={<ArrowForwardIcon />}
        >
          {buttonText}
        </CustomButton>
      </CardActions>
    </StyledCard>
  );
};

export default BlogCard;
