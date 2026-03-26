import React, { useState } from 'react';

import { getErrorMessage, submitBookingInquiry } from '../../lib/inquiries';
import { formatPhoneNumber } from '../../lib/phone';


const getTodayString = () => new Date().toISOString().split('T')[0];

const initialState = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  check_in_date: '',
  check_out_date: '',
  guests: 4,
  message: '',
};


const BookingRequestForm = () => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ tone: '', message: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValue = name === 'phone' ? formatPhoneNumber(value) : value;
    setFormData((current) => ({ ...current, [name]: nextValue }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ tone: '', message: '' });

    try {
      const response = await submitBookingInquiry({
        ...formData,
        guests: Number(formData.guests),
      });
      setFormData(initialState);
      setErrors({});
      setStatus({ tone: 'success', message: response.message });
    } catch (error) {
      setErrors(error);
      setStatus({
        tone: 'error',
        message: getErrorMessage(error, 'We could not send your stay request right now. Please try again.'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-sm font-medium text-[#47372c]">
          First name
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-[#d9c2ac] bg-white/90 px-4 py-3 text-[#2f241d] outline-none transition focus:border-[#9a5a36] focus:ring-2 focus:ring-[#ead4c4]"
            required
          />
          {errors.first_name ? <span className="mt-1 block text-sm text-[#a13f2d]">{errors.first_name[0]}</span> : null}
        </label>
        <label className="block text-sm font-medium text-[#47372c]">
          Last name
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-[#d9c2ac] bg-white/90 px-4 py-3 text-[#2f241d] outline-none transition focus:border-[#9a5a36] focus:ring-2 focus:ring-[#ead4c4]"
            required
          />
          {errors.last_name ? <span className="mt-1 block text-sm text-[#a13f2d]">{errors.last_name[0]}</span> : null}
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-sm font-medium text-[#47372c]">
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-[#d9c2ac] bg-white/90 px-4 py-3 text-[#2f241d] outline-none transition focus:border-[#9a5a36] focus:ring-2 focus:ring-[#ead4c4]"
            required
          />
          {errors.email ? <span className="mt-1 block text-sm text-[#a13f2d]">{errors.email[0]}</span> : null}
        </label>
        <label className="block text-sm font-medium text-[#47372c]">
          Phone
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          inputMode="numeric"
          autoComplete="tel-national"
          maxLength="14"
          placeholder="(111) 111-1111"
          className="mt-2 w-full rounded-2xl border border-[#d9c2ac] bg-white/90 px-4 py-3 text-[#2f241d] outline-none transition focus:border-[#9a5a36] focus:ring-2 focus:ring-[#ead4c4]"
          required
        />
          {errors.phone ? <span className="mt-1 block text-sm text-[#a13f2d]">{errors.phone[0]}</span> : null}
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <label className="block text-sm font-medium text-[#47372c]">
          Check-in
          <input
            type="date"
            name="check_in_date"
            min={getTodayString()}
            value={formData.check_in_date}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-[#d9c2ac] bg-white/90 px-4 py-3 text-[#2f241d] outline-none transition focus:border-[#9a5a36] focus:ring-2 focus:ring-[#ead4c4]"
            required
          />
          {errors.check_in_date ? <span className="mt-1 block text-sm text-[#a13f2d]">{errors.check_in_date[0]}</span> : null}
        </label>
        <label className="block text-sm font-medium text-[#47372c]">
          Check-out
          <input
            type="date"
            name="check_out_date"
            min={formData.check_in_date || getTodayString()}
            value={formData.check_out_date}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-[#d9c2ac] bg-white/90 px-4 py-3 text-[#2f241d] outline-none transition focus:border-[#9a5a36] focus:ring-2 focus:ring-[#ead4c4]"
            required
          />
          {errors.check_out_date ? <span className="mt-1 block text-sm text-[#a13f2d]">{errors.check_out_date[0]}</span> : null}
        </label>
        <label className="block text-sm font-medium text-[#47372c]">
          Guests
          <input
            type="number"
            name="guests"
            min="1"
            max="8"
            value={formData.guests}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-[#d9c2ac] bg-white/90 px-4 py-3 text-[#2f241d] outline-none transition focus:border-[#9a5a36] focus:ring-2 focus:ring-[#ead4c4]"
            required
          />
          {errors.guests ? <span className="mt-1 block text-sm text-[#a13f2d]">{errors.guests[0]}</span> : null}
        </label>
      </div>

      <label className="block text-sm font-medium text-[#47372c]">
        Notes or kosher questions
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows="5"
          className="mt-2 w-full rounded-3xl border border-[#d9c2ac] bg-white/90 px-4 py-3 text-[#2f241d] outline-none transition focus:border-[#9a5a36] focus:ring-2 focus:ring-[#ead4c4]"
          placeholder="Tell us about your group, timing, or anything you want answered in the follow-up."
        />
      </label>

      {status.message ? (
        <div
          className={`rounded-2xl px-4 py-3 text-sm ${
            status.tone === 'success'
              ? 'border border-[#cdddbf] bg-[#f1f7e9] text-[#405828]'
              : 'border border-[#edc7be] bg-[#fff3ef] text-[#8e3629]'
          }`}
        >
          {status.message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-full bg-[#9a5a36] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#7f4525] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Sending your request...' : 'Request your stay'}
      </button>
    </form>
  );
};


export default BookingRequestForm;
