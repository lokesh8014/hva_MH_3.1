document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem('token');

  const checkNavbar = setInterval(() => {
    const logoutButton = document.getElementById('logoutButton');
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');
    const home = document.getElementById('home');
    const adminDashboard = document.getElementById('adminDashboard');

    if (logoutButton && loginButton && registerButton) {
      clearInterval(checkNavbar); 

      if (token) {
        logoutButton.style.display = 'inline-block';
        loginButton.style.display = 'none';
        registerButton.style.display = 'none';
        home.style.display = 'none';
        adminDashboard.style.display = 'inline-block';
      }
    }
  }, 100); 
});

async function fetchingAllTasks() {
  const token = localStorage.getItem('token');

  const response = await fetch('https://hva-mh-3-1.onrender.com/api/admin/dashboard', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    alert('Unauthorized access. Redirecting to login.');
    window.location.href = 'login.html';
    return;
  }

  const data = await response.json();
  const taskListElement = document.getElementById('taskList');
  taskListElement.innerHTML = '';

  if (!data.users || data.users.length === 0) {
    taskListElement.innerHTML = '<p>No tasks found</p>';
    return;
  }

  data.users.forEach(user => {
    const userBox = document.createElement('div');
    userBox.classList.add('user-task-box');
    userBox.style.border = '1px solid #ccc';
    userBox.style.margin = '10px 500px';
    userBox.style.padding = '15px';
    userBox.style.borderRadius = '8px';
    userBox.style.backgroundColor = '#f9f9f9';

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
        taskBox.style.marginLeft = '20px';

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

fetchingAllTasks();

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}
