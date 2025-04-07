document.getElementById('loginForm')?.addEventListener('submit', async function (event) {
    event.preventDefault();
    console.log(typeof email);
    console.log(typeof password);
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    const response = await fetch(
      'https://hva-mh-3-1.onrender.com/api/users/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      if (data.user.role === 'admin') {
        window.location.href = 'admin_dashboard.html';
      } else {
        window.location.href = 'user_dashboard.html';
      }
    } else {
      alert('Invalid credentials');
    }
  });

document.getElementById('registerForm')?.addEventListener('submit', async function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
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
