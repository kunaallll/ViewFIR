// src/components/AddData.js
import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  MenuItem,
  Snackbar,
  CircularProgress,
} from "@mui/material";

const stateData = {
  Delhi: {
    districts: {
      "Central Delhi": [
        "Pahar Ganj",
        "Karol Bagh",
        "Connaught Place",
        "Rajender Nagar",
        "Darya Ganj",
      ],
      "North Delhi": [
        "Civil Lines",
        "Narela",
        "Burari",
        "Khera Dabar",
        "Sadar Bazar",
      ],
      "South Delhi": [
        "Kalkaji",
        "Greater Kailash",
        "Saket",
        "Chattarpur",
        "Mehrauli",
      ],
      "East Delhi": [
        "Laxmi Nagar",
        "Preet Vihar",
        "Vikas Marg",
        "Krishna Nagar",
        "Mayur Vihar",
      ],
      "West Delhi": [
        "Punjabi Bagh",
        "Janakpuri",
        "Dwarka",
        "Rajouri Garden",
        "Paschim Vihar",
      ],
      "North East Delhi": [
        "Seelampur",
        "Gokulpuri",
        "Shahdara",
        "Bhajanpura",
        "Jahangirpuri",
      ],
    },
  },
  UttarPradesh: {
    districts: {
      Noida: [
        "Sector 1",
        "Sector 2",
        "Sector 15",
        "Sector 16",
        "Sector 18",
        "Sector 63",
        "Sector 19",
        "Sector 20",
        "Sector 27",
        "Sector 34",
        "Sector 50",
        "Sector 62",
        "Sector 63",
        "Sector 75",
        "Sector 76",
        "Sector 78",
        "Sector 82",
      ],
      Ghaziabad: [
        "Anand Vihar",
        "Ashok Park",
        "Bagdogra",
        "Bhajanpura",
        "Bhopura",
        "Chandpur",
        "Crossings Republik",
        "Dasna",
        "Dhanapur",
        "Duhai",
        "Ghaziabad City",
        "Gobindpur",
        "Hapur Road",
        "Hariharpur",
        "Harsh Vihar",
        "Indirapuram",
        "Kavi Nagar",
        "Kaushambi",
        "Kheda",
        "Laxmi Nagar",
        "Madhya Mohalla",
        "Mohan Nagar",
        "Nand Nagri",
        "Nehru Nagar",
        "Neelam Vihar",
        "Raj Nagar Extension",
        "Rajendra Nagar",
        "Sanjay Nagar",
        "Satyanagar",
        "Shastri Nagar",
        "Shiv Vihar",
        "Shyampur",
        "Siddharth Vihar",
        "Sushant Vihar",
        "Vaibhav Khand",
        "Vaishali",
        "Vaishali Extension",
        "Vasundhara",
      ],
    },
  },
};

const AddData = () => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    year: "",
    state: "",
    district: "",
    city: "",
    address: "",
    phone_number: "",
    file: null,
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setFormData({ ...formData, state: selectedState, district: "", city: "" });

    if (selectedState) {
      const districtOptions = Object.keys(stateData[selectedState].districts);
      setDistricts(districtOptions);
    } else {
      setDistricts([]);
      setCities([]);
    }
  };

  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    setFormData({ ...formData, district: selectedDistrict, city: "" });

    if (selectedDistrict) {
      const cityOptions = stateData[formData.state].districts[selectedDistrict];
      setCities(cityOptions);
    } else {
      setCities([]);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"]; // example types
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (file && allowedTypes.includes(file.type) && file.size <= maxSize) {
      setFormData({ ...formData, file });
    } else {
      alert(
        "Invalid file type or size. Please upload a JPEG, PNG, or PDF file under 10MB."
      );
      setFormData({ ...formData, file: null }); // Reset file if invalid
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataObj = new FormData();
    for (const key in formData) {
      formDataObj.append(key, formData[key]);
    }

    try {
      // Check if the user uploaded a file
      if (formData.file) {
        // Handle file upload progress
        await axios.post(
          "https://viewfirbackend.onrender.com/items/add-item",
          formDataObj,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
            },
          }
        );
      } else {
        // Proceed without file upload progress tracking if no file is uploaded
        await axios.post(
          "https://viewfirbackend.onrender.com/items/add-item",
          formDataObj,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }

      // Success handling
      setSnackbar({
        open: true,
        message: "Item added successfully!",
        severity: "success",
      });

      // Reset form fields and progress
      setFormData({
        id: "",
        name: "",
        year: "",
        state: "",
        district: "",
        city: "",
        address: "",
        phone_number: "",
        file: null,
      });
      setUploadProgress(0); // Reset progress after successful completion
    } catch (error) {
      console.error("Error adding item:", error);

      // Handle the error scenario: notify user and reset button/progress states
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message ||
          "Failed to add item. Please try again.",
        severity: "error",
      });

      // Reset progress and loading state even on error
      setUploadProgress(0);
      setLoading(false); // Re-enable the button
    } finally {
      // Ensure loading is reset in all cases (whether success or failure)
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Add Data
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* FIR Number */}
          <Grid item xs={12}>
            <TextField
              name="id"
              label="FIR"
              value={formData.id}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>

          {/* Year */}
          <Grid item xs={12}>
            <TextField
              name="year"
              label="Year"
              value={formData.year}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>

          {/* State Dropdown */}
          <Grid item xs={12}>
            <TextField
              select
              name="state"
              label="State"
              value={formData.state}
              onChange={handleStateChange}
              fullWidth
              required
            >
              <MenuItem value="">
                <em>Select State</em>
              </MenuItem>
              {Object.keys(stateData).map((state) => (
                <MenuItem key={state} value={state}>
                  {state}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* District Dropdown */}
          <Grid item xs={12}>
            <TextField
              select
              name="district"
              label="District"
              value={formData.district}
              onChange={handleDistrictChange}
              fullWidth
              required
              disabled={!districts.length}
            >
              <MenuItem value="">
                <em>Select District</em>
              </MenuItem>
              {districts.map((district) => (
                <MenuItem key={district} value={district}>
                  {district}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* City Dropdown */}
          <Grid item xs={12}>
            <TextField
              select
              name="city"
              label="City"
              value={formData.city}
              onChange={handleInputChange}
              fullWidth
              required
              disabled={!cities.length}
            >
              <MenuItem value="">
                <em>Select City</em>
              </MenuItem>
              {cities.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Address */}
          <Grid item xs={12}>
            <TextField
              name="address"
              label="Address"
              multiline
              rows={4}
              value={formData.address}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="name"
              label="Name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>

          {/* Phone Number */}
          <Grid item xs={12}>
            <TextField
              name="phone_number"
              label="Phone Number"
              type="number"
              value={formData.phone_number}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>

          {/* File Upload (Optional) */}
          <Grid item xs={12}>
            <Button variant="contained" component="label" fullWidth>
              Upload File (Optional)
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              disabled={
                loading ||
                (formData.file && uploadProgress > 0 && uploadProgress < 100)
              } // Button disabled only while file is uploading
            >
              {loading ||
              (formData.file && uploadProgress > 0 && uploadProgress < 100) ? (
                <Box display="flex" alignItems="center">
                  <CircularProgress
                    variant="determinate"
                    value={uploadProgress} // Show progress for file upload only
                    size={24}
                  />
                  <Box ml={2}>{uploadProgress}%</Box>
                </Box>
              ) : (
                "Submit"
              )}
            </Button>
          </Grid>
        </Grid>
      </form>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
};

export default AddData;
