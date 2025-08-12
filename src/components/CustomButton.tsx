import { Button, ButtonProps, useTheme } from "@mui/material";
import { FC } from "react";

interface CustomButtonProps extends ButtonProps {
  children: React.ReactNode;
}

const CustomButton: FC<CustomButtonProps> = ({ children, sx, ...props }) => {
  const theme = useTheme();

  return (
    <Button
      color="inherit"
      sx={{
        textTransform: "none",
        fontWeight: 600,
        transition: theme.transitions.create(["background-color", "color"], {
          duration: theme.transitions.duration.standard, // 300ms
          easing: theme.transitions.easing.easeInOut,
        }),
        "&:hover": {
          backgroundColor: theme.palette.primary.main, // #1E88E5
          color: theme.palette.primary.contrastText, // Ensure readable text
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