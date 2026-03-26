import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import BookingRequestForm from './BookingRequestForm';
import { submitBookingInquiry } from '../../lib/inquiries';


jest.mock('../../lib/inquiries', () => ({
  submitBookingInquiry: jest.fn(),
  getErrorMessage: jest.fn(),
}));


describe('BookingRequestForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows the success state after a successful stay request', async () => {
    submitBookingInquiry.mockResolvedValue({
      message: 'Your stay request has been received. We will follow up with availability and next steps.',
    });

    render(<BookingRequestForm />);

    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'David' },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'Levi' },
    });
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: 'david@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/phone/i), {
      target: { value: '480-555-2222' },
    });
    fireEvent.change(screen.getByLabelText(/check-in/i), {
      target: { value: '2030-05-10' },
    });
    fireEvent.change(screen.getByLabelText(/check-out/i), {
      target: { value: '2030-05-14' },
    });
    fireEvent.change(screen.getByLabelText(/guests/i), {
      target: { value: '6' },
    });
    fireEvent.change(screen.getByLabelText(/notes or kosher questions/i), {
      target: { value: 'Please let us know if the pool can be heated.' },
    });

    fireEvent.click(screen.getByRole('button', { name: /request your stay/i }));

    await waitFor(() => {
      expect(submitBookingInquiry).toHaveBeenCalledWith({
        first_name: 'David',
        last_name: 'Levi',
        email: 'david@example.com',
        phone: '480-555-2222',
        check_in_date: '2030-05-10',
        check_out_date: '2030-05-14',
        guests: 6,
        message: 'Please let us know if the pool can be heated.',
      });
    });

    expect(await screen.findByText(/your stay request has been received/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toHaveValue('');
    expect(screen.getByLabelText(/last name/i)).toHaveValue('');
    expect(screen.getByLabelText(/^email$/i)).toHaveValue('');
    expect(screen.getByLabelText(/phone/i)).toHaveValue('');
    expect(screen.getByLabelText(/check-in/i)).toHaveValue('');
    expect(screen.getByLabelText(/check-out/i)).toHaveValue('');
    expect(screen.getByLabelText(/guests/i)).toHaveValue(4);
    expect(screen.getByLabelText(/notes or kosher questions/i)).toHaveValue('');
  });
});
