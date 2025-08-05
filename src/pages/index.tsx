import { Box, Container } from "@mui/material";
import { ImageCarousel, Navbar, PageLoader } from "@/components";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time (you can replace this with actual loading logic)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <Navbar />
      <Box sx={{ mt: { xs: 8, sm: 10 } }}>
        <Container maxWidth="lg">
          <ImageCarousel />
        </Container>
      </Box>
    </>
  );
}