document
  .getElementById('loginForm')
  ?.addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
      const response = await fetch('https://hva-mh-3-1.onrender.com/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Fetched Tasks:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed! Please try again.');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);

      alert('Login successful!');
      window.location.href = data.user.role === 'admin' ? 'admin_dashboard.html' : 'user_dashboard.html';
    } catch (error) {
      alert(error.message); 
    }
  });


document
  .getElementById('registerForm')
  ?.addEventListener('submit', async function (event) {
    event.preventDefault();

    const registerBtn = document.getElementById('registerBtn');
    if (registerBtn) {
      registerBtn.style.display = 'none'; 
    }

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    console.log({ name, email, password });

    const allowedDomains = ['gmail.com', 'hyperverge.com'];
    const domain = email.split('@')[1];

    if (!allowedDomains.includes(domain)) {
      alert('Only @gmail.com or @hyperverge.com emails are allowed.');
      return;
    }

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
