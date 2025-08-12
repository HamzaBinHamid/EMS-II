//src/components/LoginButton.tsx
import { Button, useTheme, Tooltip, ButtonProps } from "@mui/material";
import { MdLogin } from "react-icons/md";
import Head from "next/head";
import { FC } from "react";

interface LoginButtonProps extends ButtonProps {
  /**
   * Optional href for the login page
   * @default "/login"
   */
  loginPageUrl?: string;
}

const LoginButton: FC<LoginButtonProps> = ({ loginPageUrl = "/login", ...props }) => {
  const theme = useTheme();

  return (
    <>
      {/* SEO Meta for Login */}
      <Head>
        <link rel="canonical" href={loginPageUrl} />
        <meta name="robots" content="noindex" />
      </Head>

      <Tooltip title="Access your dashboard" arrow enterDelay={500}>
        <Button
          component="a"
          href={loginPageUrl}
          startIcon={<MdLogin size={18} aria-hidden="true" />}
          color="inherit"
          variant="text"
          aria-label="Log in to your account"
          role="button"
          sx={{
            fontWeight: 600,
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            padding: { xs: "2px 6px", sm: "3px 8px" },
            transition: theme.transitions.create(
              ["background-color", "color"],
              { duration: 300 }
            ),
            color: theme.palette.common.white,
            "&:hover": {
              backgroundColor: theme.palette.mode === 'dark' 
                ? theme.palette.primary.light 
                : theme.palette.primary.dark,
              "& svg": {
                color: theme.palette.primary.contrastText,
              },
            },
            minWidth: "auto",
            minHeight: "36px",
            "&:focus-visible": {
              outline: `2px solid ${theme.palette.secondary.main}`,
              outlineOffset: "2px",
            },
            ...props.sx, // Merge custom sx props
          }}
          {...props} // Spread remaining props
        >
          <span itemProp="name">Log in</span>
        </Button>
      </Tooltip>
    </>
  );
};

export default LoginButton;