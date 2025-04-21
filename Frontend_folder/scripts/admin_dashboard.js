document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem('token');

  const logoutButton = document.getElementById('logoutButton');
  const loginButton = document.getElementById('loginButton');
  const registerButton = document.getElementById('registerButton');
  const home = document.getElementById('home');
  const adminDashboard = document.getElementById('adminDashboard');

  if (token) {
    logoutButton.style.display = 'inline-block';
    loginButton.style.display = 'none';
    registerButton.style.display = 'none';
    home.style.display = 'none';
    adminDashboard.style.display = 'inline-block';
  } else {
    logoutButton.style.display = 'none';
    loginButton.style.display = 'inline-block';
    registerButton.style.display = 'inline-block';
    home.style.display = 'inline-block';
    adminDashboard.style.display = 'none';

    if (!window.location.href.includes('login.html')) {
      window.location.href = 'login.html';
    }
  }

  fetchingAllTasks();
});



async function fetchingAllTasks() {
  const token = localStorage.getItem('token');

  try {
    const response = await fetch('https://hva-mh-3-1.onrender.com/api/admin/dashboard', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
        
      },
    });

    if (!response.ok) {
      alert('Unauthorized access. Redirecting to login.');
      window.location.href = 'login.html';
      return;
    }

    const data = await response.json();  // Correct placement of 'data' initialization
    console.log("Fetched data:", data);  // Now logging after data is available

    const taskListElement = document.getElementById('taskList');
    taskListElement.innerHTML = '';

    const users = data.users || [data.user];  

    if (!users || users.length === 0) {
      taskListElement.innerHTML = '<p>No tasks found</p>';
      return;
    }

    users.forEach(user => {
      const userBox = document.createElement('div');
      userBox.className = 'user-task-box';

      const userHeading = document.createElement('h3');
      userHeading.textContent = `👤 ${user.name} (${user.email})`;
      userBox.appendChild(userHeading);

      if (!user.tasks || user.tasks.length === 0) {
        const noTasks = document.createElement('p');
        noTasks.textContent = 'No tasks assigned.';
        userBox.appendChild(noTasks);
      } else {
        user.tasks.forEach(task => {
          const taskBox = document.createElement('div');
          taskBox.className = 'task-box';

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

  } catch (error) {
    console.error('Error fetching tasks:', error);
    alert('Server error. Try again later.');
  }
}


function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}
