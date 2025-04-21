document.addEventListener("DOMContentLoaded", () => {
  console.log("Admin Dashboard loaded");
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token || role !== 'admin') {
    alert("Unauthorized access. Redirecting to login.");
    window.location.replace("login.html");
    return;
  }

  // Settingup navbar
  const logoutButton = document.getElementById('logoutButton');
  const loginButton = document.getElementById('loginButton');
  const registerButton = document.getElementById('registerButton');
  const home = document.getElementById('home');
  const adminDashboard = document.getElementById('adminDashboard');

  if (logoutButton && loginButton && registerButton) {
    logoutButton.style.display = 'inline-block';
    loginButton.style.display = 'none';
    registerButton.style.display = 'none';
    if (home) home.style.display = 'none';
    if (adminDashboard) adminDashboard.style.display = 'inline-block';
  }

  fetchingAllTasks();
});

async function fetchingAllTasks() {
  console.log("Calling fetchAllTasks...");
  const token = localStorage.getItem('token');
  if (!token) {
    alert('No token found. Redirecting to login.');
    window.location.replace('login.html');
    return;
  }

  const response = await fetch('https://hva-mh-3-1.onrender.com/api/admin/dashboard', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    alert('Unauthorized access. Redirecting to login.');
    const errorData = await response.json();
    console.error('Error:', errorData.message);
    console.error('Error Details:', errorData.error);
    alert('Error retrieving tasks: ' + errorData.message);
    window.location.replace('login.html');
    return;
  }

  console.log("Raw response", response);
  const data = await response.json();
  console.log("API Data:", data);
  const taskListElement = document.getElementById('taskList');
  taskListElement.innerHTML = '';

  if (!data.users || data.users.length === 0) {
    taskListElement.innerHTML = '<p>No tasks found</p>';
    return;
  }
  

  data.users.forEach(user => {
    const userBox = document.createElement('div');
    userBox.classList.add('user-task-box');

    const userHeading = document.createElement('h3');
    userHeading.textContent = `👤 ${user.name} (${user.email})`;
    userBox.appendChild(userHeading);

    if (user.tasks.length === 0) {
      const noTasks = document.createElement('p');
      noTasks.textContent = 'No tasks assigned.';
      userBox.appendChild(noTasks);
    } else {
      user.tasks.forEach(task => {
        const taskBox = document.createElement('div');
        taskBox.classList.add('task-box');

        const title = document.createElement('h4');
        title.textContent = task.title;

        const description = document.createElement('p');
        description.textContent = task.description || 'No Description';

        taskBox.appendChild(title);
        taskBox.appendChild(description);
        userBox.appendChild(taskBox);
      });
    }

    taskListElement.appendChild(userBox);
  });
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.replace("login.html"); 
}
