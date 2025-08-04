import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router"; // ✅ NEW
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { getLogoUrl } from "@/lib/getImageUrl";
import LoginButton from "@/components/LoginButton";

const navItems: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "Fee Structure", href: "/fee-structure" },
  { label: "Our Teachers", href: "/our-teachers" },
  { label: "Courses", href: "/courses" },
  { label: "Contacts", href: "/contacts" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const logoUrl = getLogoUrl();

  const router = useRouter(); // ✅ NEW

  // ✅ Close drawer on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setMobileMenuOpen(false);
    };
    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router]);

  return (
    <>
      {/* SEO Meta */}
      <Head>
        <title>EMS | Education Management System</title>
        <meta
          name="description"
          content="Explore EMS Academy's professional courses, fee structures, expert teachers, and more. Advance your career with in-demand skills."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/" />
        <meta property="og:title" content="EMS | Education Management System" />
        <meta
          property="og:description"
          content="Explore EMS Academy's professional courses, fee structures, expert teachers, and more. Advance your career with in-demand skills."
        />
        <meta property="og:image" content={logoUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://yourdomain.com/" />
        <meta
          name="twitter:title"
          content="EMS | Education Management System"
        />
        <meta
          name="twitter:description"
          content="Explore EMS Academy's professional courses, fee structures, expert teachers, and more. Advance your career with in-demand skills."
        />
        <meta name="twitter:image" content={logoUrl} />
        <link rel="icon" href={logoUrl} type="image/png" />
        <link rel="canonical" href="https://yourdomain.com/" />
      </Head>

      {/* Navbar */}
      <AppBar
        position="fixed"
        color="default"
        elevation={0}
        sx={{ width: "100%", top: 0, left: 0 }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setMobileMenuOpen(true)}
              sx={{ display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo (centered on small screens) */}
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: isMobile ? "center" : "flex-start",
            }}
          >
            <Link href="/" style={{ textDecoration: "none" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  transition: "transform 0.2s ease-in-out",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "scale(1.05)",
                    color: theme.palette.primary.main,
                  },
                  "&:active": {
                    transform: "scale(0.98)",
                  },
                }}
              >
                <Image src={logoUrl} alt="Logo" width={120} height={60} />
              </Box>
            </Link>
          </Box>

          {!isMobile && (
            <Box sx={{ display: "flex", gap: 2 }}>
              {navItems.map(({ label, href }) => {
                const isActive = router.pathname === href;
                return (
                  <Link key={label} href={href} passHref legacyBehavior>
                    <Button
                      color="inherit"
                      sx={{
                        textTransform: "none",
                        fontWeight: isActive ? 700 : 500,
                        fontSize: isActive ? "1.05rem" : "1rem",
                        color: isActive
                          ? theme.palette.common.white
                          : "inherit",
                        backgroundColor: isActive
                          ? theme.palette.primary.main
                          : "transparent",
                        borderRadius: 1,
                        px: 2,
                        py: 1,
                        "&:hover": {
                          backgroundColor: isActive
                            ? theme.palette.primary.dark
                            : theme.palette.action.hover,
                          color: theme.palette.primary.main,
                          transform: "scale(1.05)",
                        },
                        "&:active": {
                          transform: "scale(0.95)",
                        },
                      }}
                    >
                      {label}
                    </Button>
                  </Link>
                );
              })}
            </Box>
          )}

          <LoginButton />
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box sx={{ width: 250, p: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton onClick={() => setMobileMenuOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List>
            {navItems.map(({ label, href }) => (
              <ListItem disablePadding key={label}>
                <Link href={href} passHref legacyBehavior>
                  <ListItemButton
                    sx={{
                      bgcolor:
                        router.pathname === href
                          ? theme.palette.primary.main
                          : "transparent",
                      color:
                        router.pathname === href
                          ? theme.palette.common.white
                          : "inherit",
                      "&:hover": {
                        backgroundColor:
                          router.pathname === href
                            ? theme.palette.primary.dark
                            : theme.palette.action.hover,
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    <ListItemText
                      primary={label}
                      primaryTypographyProps={{
                        fontWeight: router.pathname === href ? 700 : 500,
                        fontSize: router.pathname === href ? "1.05rem" : "1rem",
                      }}
                    />
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
          </List>

          <Button
            fullWidth
            color="inherit"
            sx={{
              mt: 1,
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
                color: theme.palette.primary.main,
                transform: "scale(1.02)",
              },
              "&:active": {
                transform: "scale(0.98)",
              },
            }}
          >
            Log in
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
