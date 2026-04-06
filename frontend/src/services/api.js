const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = () => ({
  'Content-Type': 'application/json',
});

const handleResponse = async (resp) => {
  let data;
  try {
    data = await resp.json();
  } catch {
    data = null;
  }
  if (!resp.ok) {
    throw new Error(data?.error || data?.message || 'API error');
  }
  return data;
};


export const register = async (payload) => {
  const resp = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
    credentials: 'include',
  });
  return handleResponse(resp);
};

export const verifyOTP = async (payload) => {
  const resp = await fetch(`${BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
    credentials: 'include',
  });
  return handleResponse(resp);
};

export const resendOTP = async (payload) => {
  const resp = await fetch(`${BASE_URL}/auth/resend-otp`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
    credentials: 'include',
  });
  return handleResponse(resp);
};


export const login = async (payload) => {
  const resp = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
    credentials: 'include',
  });
  return handleResponse(resp);
};

export const logout = async () => {
  const resp = await fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  return handleResponse(resp);
};

export const getSessionUser = async () => {
  const resp = await fetch(`${BASE_URL}/auth/me`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(resp);
};

export const fetchTweets = async () => {
  const resp = await fetch(`${BASE_URL}/tweets`, {
    headers: getHeaders(),
    credentials: 'include',
  });
  return handleResponse(resp);
};

export const createTweet = async (payload, options = {}) => {
  const isFormData = payload instanceof FormData;

  const resp = await fetch(`${BASE_URL}/tweets`, {
    method: 'POST',
    headers: isFormData ? {} : getHeaders(),
    body: isFormData ? payload : JSON.stringify(payload),
    credentials: 'include',
  });
  return handleResponse(resp);
};
