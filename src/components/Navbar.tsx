import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
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
import LogoutButton from "@/components/LogoutButton";
import { useAuth } from "@/context/AuthContext";
import AdmissionFormModal from "./AdmissionFormModal";
import FeeStructureModal from "./FeeStructureModal";

export default function Navbar() {
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const logoUrl = getLogoUrl();
  const router = useRouter();
  const { user, role } = useAuth();

  // Role-based portal path
  const getPortalPath = () => {
    if (!user) return "/login"; // Not logged in
    switch (role) {
      case "admin":
        return "/portal/admin";
      case "teacher":
        return "/portal/teacher";
      case "student":
        return "/portal/student";
      case "parent":
        return "/portal/parent";
      default:
        return "/login"; // Fallback
    }
  };

  const navItems: { label: string; href: string; onClick?: () => void }[] = [
    { label: "Home", href: "/" },
    {
      label: "Fee Structure",
      href: "#",
      onClick: () => setIsFeeModalOpen(true),
    },
    {
      label: "Apply Online",
      href: "#",
      onClick: () => setIsAdmissionModalOpen(true),
    },
    { label: "Portal", href: getPortalPath() },
  ];

  // Close drawer on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setMobileMenuOpen(false);
    };
    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router]);

  // Handle navigation item clicks
  const handleNavItemClick = (item: typeof navItems[0]) => {
    if (item.onClick) {
      item.onClick();
      setMobileMenuOpen(false); // Close mobile menu when clicking modal items
    }
  };

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

          {/* Logo */}
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: isMobile ? "center" : "flex-start",
            }}
          >
            {(!isMobile || !user) && (
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
            )}
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 2 }}>
              {navItems.map((item) => {
                const isActive = router.pathname === item.href;
                return item.onClick ? (
                  // Items with onClick (modals)
                  <Button
                    key={item.label}
                    color="inherit"
                    onClick={() => handleNavItemClick(item)}
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
                    {item.label}
                  </Button>
                ) : (
                  // Regular link items
                  <Link key={item.label} href={item.href} passHref legacyBehavior>
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
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </Box>
          )}

          {/* Right Side - Auth Buttons */}
          {user ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, ml: 2 }}>
              <Box
                sx={{
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  color: theme.palette.mode,
                }}
              >
                {user.email}
              </Box>
              <LogoutButton />
            </Box>
          ) : (
            <LoginButton />
          )}
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
            {navItems.map((item) => (
              <ListItem disablePadding key={item.label}>
                {item.onClick ? (
                  // Items with onClick (modals)
                  <ListItemButton
                    onClick={() => handleNavItemClick(item)}
                    sx={{
                      color: "inherit",
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontWeight: 500,
                        fontSize: "1rem",
                      }}
                    />
                  </ListItemButton>
                ) : (
                  // Regular link items
                  <Link href={item.href} passHref legacyBehavior>
                    <ListItemButton
                      sx={{
                        bgcolor:
                          router.pathname === item.href
                            ? theme.palette.primary.main
                            : "transparent",
                        color:
                          router.pathname === item.href
                            ? theme.palette.common.white
                            : "inherit",
                        "&:hover": {
                          backgroundColor:
                            router.pathname === item.href
                              ? theme.palette.primary.dark
                              : theme.palette.action.hover,
                          color: theme.palette.primary.main,
                        },
                      }}
                    >
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontWeight: router.pathname === item.href ? 700 : 500,
                          fontSize: router.pathname === item.href ? "1.05rem" : "1rem",
                        }}
                      />
                    </ListItemButton>
                  </Link>
                )}
              </ListItem>
            ))}
          </List>

          {/* Mobile Auth Button */}
          {user ? (
            <LogoutButton />
          ) : (
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
                "&:active": { transform: "scale(0.98)" },
              }}
              onClick={() => router.push("/login")}
            >
              Log in
            </Button>
          )}
        </Box>
      </Drawer>

      {/* Modals */}
      <AdmissionFormModal
        open={isAdmissionModalOpen}
        onClose={() => setIsAdmissionModalOpen(false)}
      />
      
      <FeeStructureModal
        open={isFeeModalOpen}
        onClose={() => setIsFeeModalOpen(false)}
        onSave={(data) => {
          // Handle fee structure data saving
          console.log('Fee structure data:', data);
          setIsFeeModalOpen(false);
        }}
      />
    </>
  );
}