// src/components/Layout.tsx
import { Box, CssBaseline } from "@mui/material";
import { ReactNode } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <CssBaseline />
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, mt: { xs: 7, sm: 8 }, px: 2 }}>
        {children}
      </Box>
    </>
  );
};

export default Layout;
