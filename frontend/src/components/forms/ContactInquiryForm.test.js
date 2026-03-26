import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import ContactInquiryForm from './ContactInquiryForm';
import { submitContactInquiry } from '../../lib/inquiries';


jest.mock('../../lib/inquiries', () => ({
  submitContactInquiry: jest.fn(),
  getErrorMessage: jest.fn(),
}));


describe('ContactInquiryForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows the success state after a successful submission', async () => {
    submitContactInquiry.mockResolvedValue({
      message: 'Thanks for reaching out. We will get back to you shortly.',
    });

    render(<ContactInquiryForm />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Rachel Guest' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'rachel@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/phone/i), {
      target: { value: '480-555-1111' },
    });
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: 'Can you confirm the planned Shabbos setup?' },
    });

    fireEvent.click(screen.getByRole('button', { name: /send your message/i }));

    await waitFor(() => {
      expect(submitContactInquiry).toHaveBeenCalledWith({
        name: 'Rachel Guest',
        email: 'rachel@example.com',
        phone: '480-555-1111',
        message: 'Can you confirm the planned Shabbos setup?',
      });
    });

    expect(await screen.findByText(/thanks for reaching out/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toHaveValue('');
    expect(screen.getByLabelText(/email/i)).toHaveValue('');
    expect(screen.getByLabelText(/phone/i)).toHaveValue('');
    expect(screen.getByLabelText(/message/i)).toHaveValue('');
  });
});
