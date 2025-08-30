import { Button, ButtonProps, useTheme, useMediaQuery, Box, CircularProgress } from "@mui/material";
import { FC, memo, useCallback } from "react";

interface CustomButtonProps extends ButtonProps {
  children: React.ReactNode;
  loading?: boolean | null; // Allow null to match ButtonProps
}

const CustomButton: FC<CustomButtonProps> = memo(({ children, sx, loading = false, disabled, onClick, ...props }) => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMd = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isLg = useMediaQuery(theme.breakpoints.up("lg"));

  const getFontSize = useCallback(() => {
    if (isLg) return "1.125rem";
    if (isMd) return "1rem";
    if (isSm) return "0.9375rem";
    return "0.875rem";
  }, [isSm, isMd, isLg]);

  const getPadding = useCallback(() => {
    if (isLg) return "8px 20px";
    if (isMd) return "6px 16px";
    if (isSm) return "5px 14px";
    return "4px 12px";
  }, [isSm, isMd, isLg]);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      try {
        if (onClick && !loading && !disabled) {
          onClick(event);
        }
      } catch (error) {
        console.error("Button click error:", error);
      }
    },
    [onClick, loading, disabled]
  );

  return (
    <Button
      color="inherit"
      variant="contained"
      disabled={disabled || loading === true} // Treat null as false
      onClick={handleClick}
      sx={{
        textTransform: "none",
        fontWeight: 600,
        fontSize: getFontSize(),
        padding: getPadding(),
        minWidth: { xs: 80, sm: 100 },
        borderRadius: 1,
        transition: theme.transitions.create(["background-color", "color", "transform", "box-shadow"], {
          duration: theme.transitions.duration.short,
          easing: theme.transitions.easing.easeInOut,
        }),
        "&:hover": {
          backgroundColor: disabled || loading === true ? undefined : theme.palette.primary.dark,
          color: disabled || loading === true ? undefined : theme.palette.primary.contrastText,
          transform: disabled || loading === true ? "none" : "scale(1.05)",
          boxShadow: disabled || loading === true ? "none" : theme.shadows[4],
        },
        "&:active": {
          transform: disabled || loading === true ? "none" : "scale(0.98)",
        },
        position: "relative",
        overflow: "hidden",
        "&:disabled": {
          opacity: 0.6,
          cursor: "not-allowed",
          backgroundColor: theme.palette.action.disabledBackground,
        },
        ...sx,
      }}
      aria-label={typeof children === "string" ? children : props["aria-label"] || "Custom button"}
      role="button"
      {...props}
    >
      {loading === true ? (
        <Box
          component="span"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: theme.palette.action.disabledBackground,
          }}
          aria-live="polite"
        >
          <CircularProgress size={20} color="inherit" aria-label="Loading" />
        </Box>
      ) : (
        children
      )}
    </Button>
  );
});

CustomButton.displayName = "CustomButton";

export default CustomButton;