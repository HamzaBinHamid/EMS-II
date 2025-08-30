import React, { useRef, useState } from "react";
import Slider from "react-slick";
import { Box, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import {
  carousel1,
  carousel2,
  carousel4,
  carousel5,
  t1,
  t2,
  t3,
  t4,
  t5,
  t6,
  t7,
  t8,
  t9,
} from "@/lib/getImageUrl";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Type for the Slider component reference
type SliderType = typeof Slider;

const images = [
  { url: carousel4(), alt: "Love to Learn" },
  { url: t1(), alt: "Teachers" },
  { url: t2(), alt: "Teachers" },
  { url: t3(), alt: "Teachers" },
  { url: t4(), alt: "Teachers" },
  { url: t5(), alt: "Teachers" },
  { url: t6(), alt: "Teachers" },
  { url: t7(), alt: "Teachers" },
  { url: t8(), alt: "Teachers" },
  { url: t9(), alt: "Teachers" },
  { url: carousel2(), alt: "Books" },
  { url: carousel5(), alt: "Library" },
  { url: carousel1(), alt: "Teach" },
];

const IMAGE_HEIGHT = 400;
const IMAGE_HEIGHT_MOBILE = 350;

const Arrow = ({
  onClick,
  direction,
}: {
  onClick?: () => void;
  direction: "left" | "right";
}) => {
  const theme = useTheme();
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: "absolute",
        top: "50%",
        [direction === "left" ? "left" : "right"]: 8,
        transform: "translateY(-50%)",
        zIndex: 2,
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
        width: 30,
        height: 30,
        transition: "background-color 0.3s",
        "&:hover": {
          bgcolor: theme.palette.background.paper,
        },
      }}
    >
      {direction === "left" ? (
        <ArrowBackIos fontSize="small" />
      ) : (
        <ArrowForwardIos fontSize="small" />
      )}
    </IconButton>
  );
};

const ImageCarousel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const sliderRef = useRef<SliderType>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    fade: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    pauseOnHover: true,
    beforeChange: (_: number, next: number) => setCurrentSlide(next),
    appendDots: (dots: React.ReactNode) => (
      <Box
        component="ul"
        sx={{
          m: 0,
          p: 0,
          position: "absolute",
          bottom: 16,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          listStyle: "none",
          zIndex: 3,
        }}
      >
        {React.Children.map(dots, (_dot, index) => (
          <Box
            key={index}
            sx={{
              width: currentSlide === index ? 10 : 8,
              height: currentSlide === index ? 10 : 8,
              bgcolor:
                currentSlide === index
                  ? theme.palette.primary.main
                  : theme.palette.action.active,
              borderRadius: "50%",
              display: "inline-block",
              cursor: "pointer",
              margin: "0 4px",
              transition: "all 0.3s ease",
            }}
            onClick={() => sliderRef.current?.slickGoTo(index)}
          />
        ))}
      </Box>
    ),
    customPaging: () => (
      <Box
        sx={{
          width: 8,
          height: 8,
          bgcolor: theme.palette.action.active,
          borderRadius: "50%",
          display: "inline-block",
          transition: "all 0.3s ease",
        }}
      />
    ),
  };

  return (
    <Box
      sx={{
        width: "100%",
        px: { xs: 0, sm: 2 },
        py: { xs: 1, sm: 2 },
        position: "relative",
        overflow: "hidden",
        borderRadius: 2,
        boxShadow: 3,
        bgcolor: theme.palette.background.paper,
      }}
    >
      <Arrow direction="left" onClick={() => sliderRef.current?.slickPrev()} />
      <Arrow direction="right" onClick={() => sliderRef.current?.slickNext()} />

      <Slider ref={sliderRef} {...settings}>
        {images.map(({ url, alt }, idx) => (
          <Box
            key={idx}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: isMobile ? IMAGE_HEIGHT_MOBILE : IMAGE_HEIGHT,
              width: "100%",
              overflow: "hidden",
            }}
          >
            <Box
              component="img"
              src={url}
              alt={alt}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 2,
                boxShadow: theme.shadows[3],
                transition: "transform 0.5s, filter 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                  filter: "brightness(0.9)",
                },
              }}
            />
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default ImageCarousel;
