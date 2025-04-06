const spinner = document.getElementById('spinner');

// Login
document.getElementById('loginForm')?.addEventListener('submit', async function (event) {
  event.preventDefault();
  spinner.style.display = 'block';

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('https://hva-mh-3-1.onrender.com/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    spinner.style.display = 'none';

    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      window.location.href = data.user.role === 'admin' ? 'admin_dashboard.html' : 'user_dashboard.html';
    } else {
      alert(data.message || 'Invalid credentials');
    }
  } catch (error) {
    spinner.style.display = 'none';
    alert('Login failed. Please try again later.');
  }
});

// Register
document.getElementById('registerForm')?.addEventListener('submit', async function (event) {
  event.preventDefault();
  spinner.style.display = 'block';

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('https://hva-mh-3-1.onrender.com/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    spinner.style.display = 'none';

    if (response.ok) {
      alert('Registration successful! Please login.');
      window.location.href = 'login.html';
    } else {
      const data = await response.json();
      alert(data.message || 'Registration failed.');
    }
  } catch (error) {
    spinner.style.display = 'none';
    alert('Registration failed. Please try again later.');
  }
});
