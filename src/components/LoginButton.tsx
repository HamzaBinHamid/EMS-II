import { useTheme, Tooltip, ButtonProps } from "@mui/material";
import { MdLogin } from "react-icons/md";
import Head from "next/head";
import { FC } from "react";
import CustomButton from "@/components/CustomButton";

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
        <CustomButton
          component="a"
          href={loginPageUrl}
          startIcon={<MdLogin size={18} aria-hidden="true" />}
          variant="text"
          aria-label="Log in to your account"
          role="button"
          loading={false} // Explicitly set loading to false
          sx={{
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            padding: { xs: "2px 6px", sm: "3px 8px" },
            color: theme.palette.common.white,
            "&:hover": {
              backgroundColor: theme.palette.primary.main, // #1E88E5
              color: theme.palette.primary.contrastText,
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
        </CustomButton>
      </Tooltip>
    </>
  );
};

export default LoginButton;