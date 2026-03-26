import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, TextField, Button, Grid, Box, Alert } from '@mui/material';
import { format } from 'date-fns';
import axios from 'axios';

const ManageBooking = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/bookings/get_booking_details/`, {
        booking_id: bookingId,
        email: email
      });

      setBooking(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch booking details');
    } finally {
      setLoading(false);
    }
  };

  const BookingDetails = ({ booking }) => (
    <Box mt={4}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Booking Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Booking ID:</strong> {booking.id}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Guest Name:</strong> {booking.first_name} {booking.last_name}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Check-in:</strong> {format(new Date(booking.check_in_date), 'MMMM d, yyyy')}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Check-out:</strong> {format(new Date(booking.check_out_date), 'MMMM d, yyyy')}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Number of Guests:</strong> {booking.guests}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Total Amount:</strong> ${booking.total_price}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Status:</strong> {booking.payment_status}
            </Typography>
          </Grid>
          {booking.property && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Property Details
              </Typography>
              <Typography variant="subtitle1">
                <strong>Name:</strong> {booking.property.name}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Address:</strong> {booking.property.address}
              </Typography>
              {booking.property.images && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">
                    <strong>Property Images:</strong>
                  </Typography>
                  <Grid container spacing={2}>
                    {booking.property.images.map((image, index) => (
                      <Grid item xs={12} sm={4} key={index}>
                        <img 
                          src={image} 
                          alt={`Property ${index + 1}`} 
                          style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Grid>
          )}
        </Grid>
      </Paper>
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage Your Booking
      </Typography>
      
      {!booking && (
        <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
          <Typography variant="body1" gutterBottom>
            Please enter your email address to view your booking details
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mt: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? 'Loading...' : 'View Booking'}
            </Button>
          </form>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Paper>
      )}

      {booking && <BookingDetails booking={booking} />}
    </Container>
  );
};

export default ManageBooking;
