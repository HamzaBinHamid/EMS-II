import { Button, Tooltip, CircularProgress } from "@mui/material";
import { MdLogin } from "react-icons/md";
import { useRouter } from "next/router";
import { useState } from "react";

const LoginButton = ({ loginPageUrl = "/login", ...props }) => {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleClick = async () => {
    setIsNavigating(true);
    try {
      await router.push(loginPageUrl);
    } finally {
      setIsNavigating(false);
    }
  };

  return (
    <Tooltip title="Login to your account" arrow>
      <Button
        onClick={handleClick}
        startIcon={isNavigating ? <CircularProgress size={18} /> : <MdLogin size={18} />}
        disabled={isNavigating}
        {...props}
        sx={{
          color: "white",
          fontWeight: 600,
          ...props.sx,
        }}
      >
        {isNavigating ? "Redirecting..." : "Login"}
      </Button>
    </Tooltip>
  );
};

export default LoginButton;
