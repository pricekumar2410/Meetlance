// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Inter, sans-serif",

    h1: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 600,
    },
    h2: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 600,
    },
    h3: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 500,
    },
    p: {
        fontFamily: "'Inter', sans-serif"
    }
  },
});

export default theme;
