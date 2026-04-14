const showAlert = (message, type = 'danger') => {
  const alertBox = document.getElementById('alert-box');
  alertBox.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
};

document.getElementById('login-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const identifier = document.getElementById('login-identifier').value;
  const password = document.getElementById('login-password').value;

  try {
    const data = await api.post('/auth/login', { identifier, password });
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      window.location.href = 'dashboard.html';
    } else {
      showAlert(data.message || 'Login failed');
    }
  } catch (error) {
    showAlert('Server error. Please try again later.');
  }
});

document.getElementById('register-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const mobile = document.getElementById('reg-mobile').value;
  const password = document.getElementById('reg-password').value;
  const confirm = document.getElementById('reg-confirm').value;

  if (password !== confirm) {
    return showAlert('Passwords do not match');
  }

  try {
    const data = await api.post('/auth/register', { name, email, mobile, password });
    if (data.token) {
      showAlert('Registration successful! Please login.', 'success');
      // Switch to login tab
      document.getElementById('pills-login-tab').click();
    } else {
      showAlert(data.message || 'Registration failed');
    }
  } catch (error) {
    showAlert('Server error. Please try again later.');
  }
});
