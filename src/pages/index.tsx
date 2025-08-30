import { memo, useEffect } from "react";
import { Box, Container, useTheme, useMediaQuery } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { ImageCarousel, Navbar, PageLoader } from "@/components";
import { carousel1, carousel2, carousel4, carousel5 } from "@/lib/getImageUrl";
import BlogCardList from "@/components/BlogCardList";
import Footer from "@/components/Footer";

const fetchInitialData = async () => {
  // Simulate fetching initial data (replace with actual API call)
  await new Promise((resolve) => setTimeout(resolve, 100));
  return { status: "success" };
};

const Home = memo(() => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMd = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isLg = useMediaQuery(theme.breakpoints.up("lg"));

  const { isLoading } = useQuery({
    queryKey: ["initialData"],
    queryFn: fetchInitialData,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Garbage collection after 10 minutes
    retry: 1,
  });

  // Preload carousel images for faster rendering
  useEffect(() => {
    const images = [carousel1(), carousel2(), carousel4(), carousel5()];
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <Head>
        <title>Home - Your App Name</title>
        <meta
          name="description"
          content="Welcome to Your App Name. Explore our features and services."
        />
        <meta
          name="keywords"
          content="home, welcome, your app name, features, services"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://yourappname.com" />
      </Head>
      <Navbar />
      <Box
        sx={{
          mt: { xs: 8, sm: 9, md: 10, lg: 12 },
          mb: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Container maxWidth={isLg ? "lg" : isMd ? "md" : isSm ? "sm" : "xs"}>
          <ImageCarousel />
          <BlogCardList />
          <Footer />
        </Container>
      </Box>
    </>
  );
});

Home.displayName = "Home";

export default Home;
