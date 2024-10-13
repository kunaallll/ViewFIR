require('dotenv').config();
import React, { useState, useEffect } from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { Container, AppBar, Toolbar, Typography, Button } from "@mui/material";
import AddData from "./components/AddData";
import ViewData from "./components/ViewData";
import ErrorBoundary from "./components/ErrorBoundary";
import Login from "./components/Login"; // Import the Login component
import { auth } from "./firebase"; // Import your Firebase initialization

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Hook for navigation
  useEffect(() => {
    const token = localStorage.getItem("token"); // Get the token from localStorage
    if (token) {
      setUser(token); // Set the token as user
    }
  }, []);

  const handleLoginSuccess = (token) => {
    localStorage.setItem("token", token);
    setUser(token);
    // Redirect to view page or desired route
    navigate("/view"); // You will need to use the `useNavigate` hook
  };

  const handleLogout = () => {
    auth.signOut();
    localStorage.removeItem("token"); // Remove token on logout
    setUser(null); // Reset user state
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            DP Summon Cell
          </Typography>
          {user ? (
            <>
              <Button color="inherit" component={Link} to="/add">
                Add Data
              </Button>
              <Button color="inherit" component={Link} to="/view">
                View Data
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <ErrorBoundary>
          <Routes>
            <Route
              path="/add"
              element={user ? <AddData /> : <Navigate to="/" />}
            />
            <Route
              path="/view"
              element={user ? <ViewData /> : <Navigate to="/" />}
            />
            <Route
              path="/"
              element={
                user ? (
                  <Navigate to="/view" />
                ) : (
                  <Login onLoginSuccess={handleLoginSuccess} />
                )
              }
            />
          </Routes>
        </ErrorBoundary>
      </Container>
    </>
  );
}

export default App;
