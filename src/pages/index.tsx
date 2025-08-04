import { Box, Container } from "@mui/material";
import { ImageCarousel, Navbar } from "@/components";

export default function Home() {
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
