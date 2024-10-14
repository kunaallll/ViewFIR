// src/components/ViewData.js
import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Link as MuiLink,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

const ViewData = () => {
  const [searchParams, setSearchParams] = useState({
    year: "",
    id: "",
  });

  const [itemData, setItemData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // State to handle error messages

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null); // Reset any previous errors
    try {
      const { year, id } = searchParams;
      // Ensure year and id are treated as strings
      const response = await axios.post(
        `https://viewfirbackend.onrender.com/items/view-item`,
        {
          year: String(year), // Pass year and id in the body
          id: String(id),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure you're passing the token
          },
        }
      );
      setItemData(response.data);
    } catch (error) {
      console.error("Error fetching item:", error);
      setError("Item not found. Please check the ID and Year."); // Update error message
      setItemData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError(null); // Close the snackbar
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
      <Typography variant="h4" gutterBottom>
        View Data
      </Typography>
      <Grid container spacing={2}>
        {/* ID */}
        <Grid item xs={12}>
          <TextField
            name="id"
            label="FIR"
            type="number"
            value={searchParams.id}
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
            value={searchParams.year}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </Grid>

        {/* Search Button */}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSearch}
          >
            Search
          </Button>
        </Grid>
      </Grid>

      {/* Loading Indicator */}
      {loading ? (
        <CircularProgress sx={{ mt: 4 }} />
      ) : (
        itemData && (
          <Card sx={{ mt: 4 }}>
            <CardContent>
              <Typography variant="h5">Person Details</Typography>
              <Typography variant="body1">
                <strong>FIR:</strong> {itemData.id}
              </Typography>
              <Typography variant="body1">
                <strong>Year:</strong> {itemData.year}
              </Typography>
              <Typography variant="body1">
                <strong>District:</strong> {itemData.district}
              </Typography>
              <Typography variant="body1">
                <strong>City:</strong> {itemData.city}
              </Typography>
              <Typography variant="body1">
                <strong>Address:</strong> {itemData.address}
              </Typography>
              <Typography variant="body1">
                <strong>Name:</strong> {itemData.name}
              </Typography>
              <Typography variant="body1">
                <strong>Phone Number:</strong> {itemData.phone_number}
              </Typography>
              <Typography variant="body1">
                <strong>Upload Date:</strong>{" "}
                {itemData.upload_date
                  ? new Date(
                      itemData.upload_date._seconds * 1000
                    ).toLocaleString()
                  : "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong>Last Viewed:</strong>{" "}
                {itemData.recent_view
                  ? new Date(
                      itemData.recent_view._seconds * 1000
                    ).toLocaleString()
                  : "Never"}
              </Typography>
            </CardContent>
            <CardActions>
              {itemData.file_url && (
                <Button
                  size="small"
                  color="primary"
                  component={MuiLink}
                  href={itemData.file_url}
                  target="_blank"
                >
                  View File
                </Button>
              )}
            </CardActions>
          </Card>
        )
      )}

      {/* Error Snackbar */}
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={error}
      />
    </Box>
  );
};

export default ViewData;
