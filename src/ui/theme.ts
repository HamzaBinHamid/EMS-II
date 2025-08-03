import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1E88E5" },
    secondary: { main: "#F50057" },
    background: { default: "#FFFFFF", paper: "#F5F5F5" },
    text: { primary: "#212121", secondary: "#616161" },
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    button: { textTransform: "none", fontWeight: 600 },

    h3: {
      fontWeight: 700,
      fontSize: "3rem",
      lineHeight: 1.3,
      letterSpacing: "-0.5px",
      [`@media (max-width:600px)`]: {
        fontSize: "2rem",
      },
    },
    body1: {
      fontSize: "1.1rem",
      lineHeight: 1.7,
      [`@media (max-width:600px)`]: {
        fontSize: "0.95rem",
      },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "10px 16px",
          fontWeight: "600",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#110d36",
          color: "#FFFFFF",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          backgroundColor: "#F5F5F5",
          color: "#212121",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        },
      },
    },
  },
});

export default theme;
