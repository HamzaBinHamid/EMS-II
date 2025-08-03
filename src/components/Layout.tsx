// src/components/Layout.tsx
import { Box, CssBaseline } from "@mui/material";
import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

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
      <Footer />
    </>
  );
};

export default Layout;
