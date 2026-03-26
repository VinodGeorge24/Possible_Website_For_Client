const API_ROOT = process.env.REACT_APP_API_URL || 'http://localhost:8000';

async function submitJson(path, payload) {
  const response = await fetch(`${API_ROOT}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw data;
  }

  return data;
}

export function submitContactInquiry(payload) {
  return submitJson('/api/inquiries/contact/', payload);
}

export function submitBookingInquiry(payload) {
  return submitJson('/api/inquiries/booking/', payload);
}

export function getErrorMessage(error, fallbackMessage) {
  if (!error || typeof error !== 'object') {
    return fallbackMessage;
  }

  if (typeof error.detail === 'string') {
    return error.detail;
  }

  const [firstEntry] = Object.entries(error);
  if (!firstEntry) {
    return fallbackMessage;
  }

  const [, value] = firstEntry;
  if (Array.isArray(value) && value.length) {
    return value[0];
  }

  if (typeof value === 'string') {
    return value;
  }

  return fallbackMessage;
}
