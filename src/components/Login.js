import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { auth } from "../firebase"; // Import the auth object
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth"; // Import necessary functions

const Login = ({ onLoginSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState(""); // Store only the 10-digit number
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value.replace("+91", ""); // Remove +91 before updating state
    // Only allow 10 digits for the phone number
    if (value.length <= 10 && /^[0-9]*$/.test(value)) {
      setPhoneNumber(value);
    }
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const requestOtp = async () => {
    setLoading(true);
    try {
      // Format the phone number with +91
      const formattedPhoneNumber = `+91${phoneNumber}`;

  const appVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
    size: "invisible",
    callback: (response) => {
      // reCAPTCHA solved - will proceed with submit function
    },
  });

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhoneNumber,
        appVerifier
      );
      setVerificationId(confirmationResult);
      setSnackbarMessage("OTP sent to your phone.");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error requesting OTP:", error);
      if (error.code === "auth/invalid-phone-number") {
        setSnackbarMessage(
          "Invalid phone number format. Please use 10 digits."
        );
      } else {
        setSnackbarMessage("Failed to send OTP. Please try again.");
      }
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };
  const verifyOtp = async () => {
    setLoading(true);
    try {
      // Add the country code back
      const data = await verificationId.confirm(otp);

      const token = await data.user.getIdToken();
      // Store the token in localStorage
      localStorage.setItem("token", token);

      // Callback to update user state in App.js
      onLoginSuccess(token);
      setSnackbarMessage("Login successful!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      if (error) {
        setSnackbarMessage(error || "Failed to verify OTP. Please try again.");
      } else {
        setSnackbarMessage("Failed to verify OTP. Please try again.");
      }
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 4,
        p: 2,
        border: "1px solid #ccc",
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <div id="recaptcha-container"></div>{" "}
      {/* ReCAPTCHA will be rendered here */}
      <TextField
        label="Phone Number"
        value={`+91${phoneNumber}`} // Display +91 in the input, but not in the state
        onChange={handlePhoneNumberChange}
        fullWidth
        required
        sx={{ mb: 2 }}
        placeholder="Enter 10-digit number"
      />
      <Button
        variant="contained"
        onClick={requestOtp}
        disabled={loading || phoneNumber.length !== 10}
      >
        {loading ? <CircularProgress size={24} /> : "Request OTP"}
      </Button>
      {verificationId && (
        <>
          <TextField
            label="OTP"
            value={otp}
            onChange={handleOtpChange}
            fullWidth
            required
            sx={{ mt: 2, mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={verifyOtp}
            disabled={loading || !otp}
          >
            {loading ? <CircularProgress size={24} /> : "Verify OTP"}
          </Button>
        </>
      )}
      <Snackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        autoHideDuration={4000}
      />
    </Box>
  );
};

export default Login;

// import React, { useEffect, useState } from "react";
// import {
//   TextField,
//   Button,
//   Typography,
//   Box,
//   Snackbar,
//   CircularProgress,
// } from "@mui/material";
// import { auth } from "../firebase"; // Import the auth object
// import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth"; // Import necessary functions

// const Login = ({ onLoginSuccess }) => {
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [verificationId, setVerificationId] = useState(null);
//   const [snackbarMessage, setSnackbarMessage] = useState("");

//   useEffect(() => {
//     // Ensure the reCAPTCHA container is present in the DOM before initializing
//     if (document.getElementById("recaptcha-container")) {
//       const appVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
//         size: "invisible", // Set this to 'invisible' or 'normal'
//         callback: (response) => {
//           // reCAPTCHA solved - will proceed with submit function
//         },
//         "expired-callback": () => {
//           // Response expired. Ask user to re-submit the request
//         },
//       }); // Pass the auth instance

//       return () => {
//         appVerifier.clear(); // Cleanup the verifier on unmount
//       };
//     }
//   }, []);

//   const handlePhoneNumberChange = (e) => {
//     const value = e.target.value.replace("+91", ""); // Remove +91 before updating state
//     if (value.length <= 10 && /^[0-9]*$/.test(value)) {
//       setPhoneNumber(value);
//     }
//   };

//   const requestOtp = async () => {
//     setLoading(true);
//     try {
//       // Format the phone number with +91
//       const formattedPhoneNumber = `+91${phoneNumber}`;

//       const appVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
//         size: "invisible",
//         callback: (response) => {
//           // reCAPTCHA solved - will proceed with submit function
//         },
//       });

//       const confirmationResult = await signInWithPhoneNumber(
//         auth,
//         formattedPhoneNumber,
//         appVerifier
//       );
//       setVerificationId(confirmationResult.verificationId);
//       setSnackbarMessage("OTP sent to your phone.");
//       setSnackbarOpen(true);
//     } catch (error) {
//       console.error("Error requesting OTP:", error);
//       if (error.code === "auth/invalid-phone-number") {
//         setSnackbarMessage(
//           "Invalid phone number format. Please use 10 digits."
//         );
//       } else {
//         setSnackbarMessage("Failed to send OTP. Please try again.");
//       }
//       setSnackbarOpen(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const verifyOtp = async () => {
//     setLoading(true);
//     try {
//       const formattedPhoneNumber = `+91${phoneNumber}`;
//       const response = await fetch("https://viewfirbackend.onrender.com/auth/verifyOtp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           phoneNumber: formattedPhoneNumber,
//           otp,
//           verificationId,
//         }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         const token = data.token; // Get the token from the response
//         localStorage.setItem("token", token); // Store the token in localStorage
//         onLoginSuccess(token); // Call the success callback
//         setSnackbarMessage("Login successful!");
//       } else {
//         setSnackbarMessage(data.message || "Failed to verify OTP.");
//       }
//       setSnackbarOpen(true);
//     } catch (error) {
//       console.error("Error verifying OTP:", error);
//       setSnackbarMessage("Failed to verify OTP. Please try again.");
//       setSnackbarOpen(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSnackbarClose = () => {
//     setSnackbarOpen(false);
//   };

//   return (
//     <Box
//       sx={{
//         maxWidth: 400,
//         mx: "auto",
//         mt: 4,
//         p: 2,
//         border: "1px solid #ccc",
//         borderRadius: 2,
//       }}
//     >
//       <Typography variant="h4" gutterBottom>
//         Login
//       </Typography>
//       <div id="recaptcha-container"></div>
//       <TextField
//         label="Phone Number"
//         value={`+91${phoneNumber}`}
//         onChange={handlePhoneNumberChange}
//         fullWidth
//         required
//         sx={{ mb: 2 }}
//         placeholder="Enter 10-digit number"
//       />
//       <Button
//         variant="contained"
//         onClick={requestOtp}
//         disabled={loading || phoneNumber.length !== 10}
//       >
//         {loading ? <CircularProgress size={24} /> : "Request OTP"}
//       </Button>
//       {verificationId && (
//         <>
//           <TextField
//             label="OTP"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             fullWidth
//             required
//             sx={{ mt: 2, mb: 2 }}
//           />
//           <Button
//             variant="contained"
//             onClick={verifyOtp}
//             disabled={loading || !otp}
//           >
//             {loading ? <CircularProgress size={24} /> : "Verify OTP"}
//           </Button>
//         </>
//       )}
//       <Snackbar
//         open={snackbarOpen}
//         onClose={handleSnackbarClose}
//         message={snackbarMessage}
//         autoHideDuration={4000}
//       />
//     </Box>
//   );
// };

// export default Login;
