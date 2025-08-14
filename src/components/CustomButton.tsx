import { Button, ButtonProps, useTheme, useMediaQuery } from "@mui/material";
import { FC } from "react";

interface CustomButtonProps extends ButtonProps {
  children: React.ReactNode;
}

const CustomButton: FC<CustomButtonProps> = ({ children, sx, ...props }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Button
      color="inherit"
      sx={{
        textTransform: "none",
        fontWeight: 600,
        fontSize: isMobile ? "0.875rem" : "1rem", // Smaller font on mobile
        padding: isMobile ? "8px 16px" : "10px 24px", // Adjusted padding
        transition: theme.transitions.create(
          ["background-color", "color", "transform", "box-shadow"],
          {
            duration: theme.transitions.duration.standard, // 300ms
            easing: theme.transitions.easing.easeInOut,
          }
        ),
        "&:hover": {
          backgroundColor: theme.palette.primary.main, // #1E88E5
          color: theme.palette.primary.contrastText, // Readable text
          transform: "scale(1.05)", // Slight scale-up effect
          boxShadow: theme.shadows[4], // Add shadow on hover
        },
        "&:active": {
          transform: "scale(0.98)", // Slight scale-down on click
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;