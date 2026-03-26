import React, { useState } from 'react';

import { getErrorMessage, submitContactInquiry } from '../../lib/inquiries';


const initialState = {
  name: '',
  email: '',
  phone: '',
  message: '',
};


const ContactInquiryForm = () => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ tone: '', message: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ tone: '', message: '' });

    try {
      const response = await submitContactInquiry(formData);
      setFormData(initialState);
      setErrors({});
      setStatus({ tone: 'success', message: response.message });
    } catch (error) {
      setErrors(error);
      setStatus({
        tone: 'error',
        message: getErrorMessage(error, 'We could not send your message right now. Please try again.'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-sm font-medium text-[#47372c]">
          Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-[#d9c2ac] bg-white/90 px-4 py-3 text-[#2f241d] outline-none transition focus:border-[#9a5a36] focus:ring-2 focus:ring-[#ead4c4]"
            required
          />
          {errors.name ? <span className="mt-1 block text-sm text-[#a13f2d]">{errors.name[0]}</span> : null}
        </label>
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
      </div>

      <label className="block text-sm font-medium text-[#47372c]">
        Phone
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="mt-2 w-full rounded-2xl border border-[#d9c2ac] bg-white/90 px-4 py-3 text-[#2f241d] outline-none transition focus:border-[#9a5a36] focus:ring-2 focus:ring-[#ead4c4]"
        />
      </label>

      <label className="block text-sm font-medium text-[#47372c]">
        Message
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows="5"
          className="mt-2 w-full rounded-3xl border border-[#d9c2ac] bg-white/90 px-4 py-3 text-[#2f241d] outline-none transition focus:border-[#9a5a36] focus:ring-2 focus:ring-[#ead4c4]"
          required
        />
        {errors.message ? <span className="mt-1 block text-sm text-[#a13f2d]">{errors.message[0]}</span> : null}
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
        {isSubmitting ? 'Sending...' : 'Send your message'}
      </button>
    </form>
  );
};


export default ContactInquiryForm;
