import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Box, Button, Alert, CircularProgress } from '@mui/material';

const PaymentForm = ({ amount, onSuccess, onError, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.log('Stripe or Elements not loaded');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      console.log('Starting payment confirmation...');
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking-confirmation`,
        },
      });

      if (error) {
        console.error('Payment error:', error);
        setErrorMessage(error.message || 'An error occurred during payment');
        onError(error);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', paymentIntent);
        onSuccess(paymentIntent);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setErrorMessage(err.message || 'An unexpected error occurred');
      onError(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 500, mx: 'auto', p: 2 }}>
      <Box sx={{ mb: 2 }}>
        <PaymentElement />
      </Box>
      
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={isProcessing || !stripe || !elements || !clientSecret}
        sx={{ mt: 2 }}
      >
        {isProcessing ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CircularProgress size={24} sx={{ mr: 1 }} />
            Processing...
          </Box>
        ) : (
          `Pay $${(amount / 100).toFixed(2)}`
        )}
      </Button>
    </Box>
  );
};

export default PaymentForm;
