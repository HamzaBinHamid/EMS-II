import { Box, Button, Container, Typography } from "@mui/material";
import Link from "next/link";
import Head from "next/head";

export default function NotFound() {
  return (
    <>
      <Head>
        <title>404 - Page Not Found</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="The page you are looking for does not exist." />
      </Head>

      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          textAlign: "center",
          px: 3,
        }}
      >
        <Typography variant="h1" color="primary" fontWeight="bold" sx={{ fontSize: { xs: "3rem", md: "5rem" } }}>
          404
        </Typography>
        <Typography variant="h4" fontWeight="bold" mt={2} sx={{ fontSize: { xs: "1.8rem", md: "2.5rem" } }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="textSecondary" mt={2} sx={{ fontSize: { xs: "1rem", md: "1.2rem" } }}>
          Sorry, we couldn’t find the page you’re looking for.
        </Typography>
        <Box mt={4} display="flex" gap={2} flexDirection={{ xs: "column", sm: "row" }}>
          <Button component={Link} href="/" variant="contained" color="primary" sx={{ width: { xs: "100%", sm: "auto" } }}>
            Go Back Home
          </Button>
          <Button component={Link} href="/contact" variant="outlined" sx={{ width: { xs: "100%", sm: "auto" } }}>
            Contact Support
          </Button>
        </Box>
      </Container>
    </>
  );
}
