document.getElementById('loginForm')?.addEventListener('submit', async function (event) {
  event.preventDefault();

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();

  console.log("Sending Login Payload:", { email, password });

  const response = await fetch('https://hva-mh-3-1.onrender.com/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (response.ok) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.user.role);
    window.location.href = data.user.role === 'admin' ? 'admin_dashboard.html' : 'user_dashboard.html';
  } else {
    alert(data.message || 'Invalid credentials');
  }
});



document.getElementById('registerForm')?.addEventListener('submit', async function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value.trim();
    console.log({ name, email, password });

    const response = await fetch('https://hva-mh-3-1.onrender.com/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (response.ok) {
      alert('Registration successful! Please login.');
      window.location.href = 'login.html';
    } else {
      alert('Registration failed');
    }
  });
