// If served by Express (port 5000), use relative path. Otherwise fallback to localhost:5000.
const BASE_URL = window.location.port === '5000'
  ? '/api'
  : 'http://localhost:5000/api';

const api = {
  getHeaders: () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  },

  post: async (endpoint, data) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: api.getHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  },

  get: async (endpoint) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: api.getHeaders()
    });
    return response.json();
  },
  
  put: async (endpoint, data) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: api.getHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
  }
};

// Global Logout Listener
document.addEventListener('click', (e) => {
  if (e.target.closest('.logout-btn')) {
    api.logout();
  }
});

window.api = api;
