import React, { useContext, useState } from "react";
import {
  Avatar,
  Button,
  TextField,
  Box,
  Typography,
  Container,
  Snackbar,
} from "@mui/material";
import { IconButton, InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Authentication() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [formState, setFormState] = useState(0);
  const [open, setOpen] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const { handleRegister, handleLogin } = useContext(AuthContext);

  // --- ALL STYLES HERE ---
  const styles = {
    root: {
      minHeight: "100vh",
      background: "transparent",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      padding: "40px",
      overflow: "hidden",
    },

    // ⭐ Wrapper
    starsWrapper: {
      position: "fixed",
      inset: 0,
      overflow: "hidden",
      zIndex: -1,
    },

    // ⭐ Stars layer with animation
    stars: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "200%",
      backgroundImage: 'url("/landingImg.jpg")',
      backgroundRepeat: "repeat",
      backgroundSize: "auto",
      animation: "starsUp 30s linear infinite",
    },

    // ⭐ Keyframes inside sx
    "@keyframes starsUp": {
      from: { transform: "translateY(0)" },
      to: { transform: "translateY(-50%)" },
    },

    glassContainer: {
      p: 4,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: "rgba(30, 41, 59, 0.5)",
      backdropFilter: "blur(16px)",
      borderRadius: "24px",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      transition: "all 0.4s ease-in-out",
      cursor: "default",
      "&:hover": {
        transform: "scale(1.05)",
        borderColor: "#2563EB",
        boxShadow:
          "0 0 40px rgba(37, 99, 235, 0.4), inset 0 0 10px rgba(37, 99, 235, 0.1)",
      },
    },

    inputStyle: {
      mb: 2,
      "& .MuiOutlinedInput-root": {
        color: "white",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        "& fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
        "&:hover fieldset": { borderColor: "#60a5fa" },
        "&.Mui-focused fieldset": { borderColor: "#2563EB" },
      },
      "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.5)" },
      "& .MuiInputLabel-root.Mui-focused": { color: "#60a5fa" },
    },

    submitBtn: {
      mt: 3,
      py: 1.5,
      fontSize: "1rem",
      fontWeight: "bold",
      textTransform: "none",
      background: "linear-gradient(90deg, #2563EB, #092fd8)",
      boxShadow: "0 4px 15px rgba(37, 99, 235, 0.3)",
      transition: "all 0.5s ease-in-out",
      "&:hover": {
        background: "white",
        transform: "scale(1.03)",
        color: "#2563EB",
        border: "2px solid #2563EB",
        boxShadow: "0 6px 20px rgba(37, 99, 235, 0.6)",
      },
    },
  };

  let handleAuth = async () => {
    // Empty check
    if (!username || !password || (formState === 1 && (!name || !email))) {
      setError("Please fill all required fields");
      return;
    }
    // Gmail validation
    if (formState === 1 && !email.endsWith("@gmail.com")) {
      setError("Only Gmail addresses are allowed");
      return;
    }
    try {
      if (formState === 0) {
        await handleLogin(username, password);
      } else {
        const result = await handleRegister(
          name,
          username,
          email,
          password
        );
        setMessage(result);
        setOpen(true);
        setError("");
        setFormState(0);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Authentication Failed");
    }
  };

  const handleFormSwitch = (state) => {
    setFormState(state);
    setUsername("");
    setPassword("");
    setName("");
    setEmail("");
    setError("");
  };

  return (
    <Box sx={styles.root}>
      {/* ⭐ Stars Background */}
      <Box sx={styles.starsWrapper}>
        <Box sx={styles.stars}></Box>
      </Box>

      {/* Logo */}
      <Box
        onClick={() => navigate("/")}
        sx={{
          position: "absolute",
          top: 20,
          left: 40,
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <img
          src="/websiteLogo.png"
          style={{ width: "2rem", borderRadius: "3px", padding: "1px" }}
          alt="logo"
        />
        <Typography
          variant="h5"
          sx={{ ml: 1, fontWeight: "bold", color: "#2563EB" }}
        >
          Meet<span style={{ color: "#DC2626" }}>lance</span>
        </Typography>
      </Box>

      <Container maxWidth="xs">
        <Box sx={styles.glassContainer}>
          <Avatar
            sx={{
              m: 1,
              bgcolor: "#2563EB",
              mb: 2,
              boxShadow: "0 0 30px #2563EB",
            }}
          >
            <LockOutlinedIcon />
          </Avatar>

          <Typography
            variant="h5"
            sx={{ color: "white", fontWeight: 700, mb: 1 }}
          >
            {formState === 0 ? "Welcome Back" : "Create Account"}
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: "rgba(255,255,255,0.6)", mb: 3 }}
          >
            {formState === 0
              ? "Please enter your details to login"
              : "Join the professional network"}
          </Typography>

          <Box component="form" sx={{ width: "100%" }}>
            {formState === 1 && (
              <TextField
                fullWidth
                id="name"
                name="name"
                margin="normal"
                label="Full Name"
                value={name}
                required
                autoFocus
                sx={styles.inputStyle}
                onChange={(e) => setName(e.target.value)}
              />
            )}

            <TextField
              fullWidth
              id="username"
              name="username"
              margin="normal"
              label="Username"
              value={username}
              required
              sx={styles.inputStyle}
              onChange={(e) => setUsername(e.target.value)}
            />

            {formState === 1 && (
              <TextField
                fullWidth
                id="email"
                name="email"
                margin="normal"
                label="Email"
                type="email"
                value={email}
                sx={styles.inputStyle}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            )}

            <TextField
              fullWidth
              id="password"
              name="password"
              margin="normal"
              label="Password"
              value={password}
              type={showPassword ? "text" : "password"}
              required
              sx={styles.inputStyle}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: "white" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {error && (
              <Typography
                sx={{
                  color: "#f87171",
                  fontSize: "0.85rem",
                  textAlign: "center",
                  mt: 1,
                }}
              >
                {error}
              </Typography>
            )}

            <Button
              type="button"
              fullWidth
              variant="contained"
              sx={styles.submitBtn}
              onClick={handleAuth}
            >
              {formState === 0 ? "Login" : "Register Now"}
            </Button>

            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.7)" }}
              >
                {formState === 0
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <Box
                  component="span"
                  onClick={() =>
                    handleFormSwitch(formState === 0 ? 1 : 0)
                  }
                  sx={{
                    color: "#60a5fa",
                    cursor: "pointer",
                    fontWeight: "bold",
                    display: "inline-block",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.2)",
                      color: "#00ffff",
                      textShadow:
                        "0 0 10px #60a5fa, 0 0 20px #2563EB",
                    },
                  }}
                >
                  {formState === 0 ? "Sign Up" : "Log In"}
                </Box>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>

      <Snackbar open={open} autoHideDuration={4000} message={message} />
    </Box>
  );
}