import React, { useContext, useState } from "react";
import {
  Avatar,
  Button,
  TextField,
  Box,
  Typography,
  Container,
  Link,
  Snackbar
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Authentication() {

  const navigate = useNavigate();

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [error, setError] = useState();
  const [message, setMessage] = useState();

  const [formState, setFormState] = useState(0);  // 0 means login and 1 means signup

  const [open, setOpen] = useState(false);

  const { handleRegister, handleLogin } = useContext(AuthContext);

  let handleAuth = async () => {
    try {
      if (formState === 0) {
        await handleLogin(username, password);
      }
      if (formState === 1) {
        const result = await handleRegister(name, username, email, password);
        console.log(result);
        setUsername("");
        setMessage(result);
        setOpen(true);
        setError("")
        setFormState(0)
        setPassword("")
      }
    } catch (err) {
      const message = err?.response?.data?.message;
      setError(message);
    }
  }

  return (
    <>
      <div>
        <nav
          onClick={() => {
            navigate("/");
          }}
          style={{ display: "flex", fontSize: "x-large", alignItems: "center", cursor: "pointer", color: "#2563EB" }}
        >
          <img src="/websiteLogo.png" className='logo' />
          <p style={{ marginTop: "5px", padding: "0.5rem" }}>
            <b>Meet<span style={{ color: "#DC2626" }}>lance</span></b>
          </p>
        </nav>
      </div>
      <div>
        <Container maxWidth="xs">
          <Box
            sx={{
              mt: 8,
              p: 4,
              boxShadow: 3,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>


            <div>
              <Button sx={{ mt: 2 }} variant={formState === 0 ? "contained" : ""} onClick={() => { setFormState(0) }}>
                Login
              </Button>
              <Button sx={{ mt: 2 }} variant={formState === 1 ? "contained" : ""} onClick={() => { setFormState(1) }}>
                Register
              </Button>
            </div>

            <Box component="form" sx={{ mt: 1 }}>
              {formState === 1 ?
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  margin="normal"
                  label="Full Name"
                  value={name}
                  required
                  autoFocus
                  onChange={(e) => setName(e.target.value)}
                />
                : <></>}

              <TextField
                fullWidth
                id="username"
                name="username"
                margin="normal"
                label="Username"
                value={username}
                required
                autoFocus
                onChange={(e) => setUsername(e.target.value)}
              />

              {formState === 1 ?
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  margin="normal"
                  label="Email"
                  value={email}
                  required
                  autoFocus
                  onChange={(e) => setEmail(e.target.value)}
                />
                : <></>
              }

              <TextField
                fullWidth
                id="password"
                name="password"
                margin="normal"
                label="Password"
                value={password}
                type="password"
                required
                autoFocus
                onChange={(e) => setPassword(e.target.value)}
              />
              <p style={{ color: "red" }}>{error}</p>

              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 3 }}
                onClick={handleAuth}
              >
                {formState === 0 ? "Login" : "Register"}
              </Button>


            </Box>
          </Box>
          <Snackbar
            open={open}
            autoHideDuration={4000}
            message={message}
          />
        </Container>
      </div>

    </>
  );
}
