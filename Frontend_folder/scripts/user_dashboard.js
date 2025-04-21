document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem('token');

  const checkNavbar = setInterval(() => {
    const logoutButton = document.getElementById('logoutButton');
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');
    const home = document.getElementById('home');
    const userDashboard = document.getElementById('userDashboard');
    const userIconWrapper = document.getElementById('userIconWrapper');

    if (logoutButton && loginButton && registerButton) {
      clearInterval(checkNavbar);

      if (token) {
        logoutButton.style.display = 'inline-block';
        loginButton.style.display = 'none';
        registerButton.style.display = 'none';
        home.style.display = 'none';
        userDashboard.style.display = 'inline-block';
        if (userIconWrapper) userIconWrapper.style.display = 'block';
      }
    }
  }, 100);
});

async function fetchingUserTasks() {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found in localStorage.');
    return;
  }

  try {
    const response = await fetch('https://hva-mh-3-1.onrender.com/api/user/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const data = await response.json();

    const userName = data.user.name;
    const tasks = data.tasks;
    console.log('Logged in user:', userName);
    tasks.forEach(task => {
      console.log(`Task: ${task.title}`);
    });

    const taskListElement = document.getElementById('taskList');
    taskListElement.innerHTML = ''; 

    if (Array.isArray(tasks)) {
      tasks.forEach((task) => {
        const taskBox = createTaskBox(task.title, task.description);
        taskListElement.appendChild(taskBox);
      });
    }

    const userNameEl = document.getElementById('userName');
    const taskCountEl = document.getElementById('taskCount');
    const userIconWrapper = document.getElementById('userIconWrapper');

    if (userNameEl && taskCountEl && userIconWrapper) {
      userNameEl.textContent = userName || "User";
      taskCountEl.textContent = `Tasks: ${tasks?.length || 0}`;
      userIconWrapper.style.display = 'block';
    }

    displayUserTasks();

  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
}




fetchingUserTasks();

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "login.html";
}

// Function to create a task box (used by both API and local tasks)
function createTaskBox(titleText, descText) {
  const taskBox = document.createElement('div');
  taskBox.classList.add('task-box');

  const title = document.createElement('h3');
  title.textContent = titleText;

  const description = document.createElement('p');
  description.textContent = descText;

  taskBox.appendChild(title);
  taskBox.appendChild(description);
  return taskBox;
}

// Add new task to localStorage
async function addTask() {
  const title = document.getElementById('taskTitleInput').value.trim();
  const description = document.getElementById('taskDescriptionInput').value.trim();
  const token = localStorage.getItem('token');

  if (!title || !description) {
    alert('Please fill in both title and description.');
    return;
  }

  if (!token) {
    alert('User not logged in.');
    return;
  }

  try {
    const response = await fetch('https://hva-mh-3-1.onrender.com/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, description })
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    document.getElementById('taskTitleInput').value = '';
    document.getElementById('taskDescriptionInput').value = '';

    alert('Task added successfully!');
    fetchingUserTasks(); // Refresh task list
  } catch (err) {
    console.error('Error adding task:', err);
    alert('Failed to add task.');
  }
}

// Display tasks stored in localStorage
function displayUserTasks() {
  const userTasks = JSON.parse(localStorage.getItem('userTasks')) || [];
  const taskListElement = document.getElementById('taskList');

  userTasks.forEach((task) => {
    const taskBox = createTaskBox(task.title, task.description);
    taskListElement.appendChild(taskBox);
  });
}

// Toggle user info card when clicking user icon
document.addEventListener('click', function (event) {
  const iconWrapper = document.getElementById('userIconWrapper');
  const userInfoCard = document.getElementById('userInfoCard');

  if (iconWrapper && iconWrapper.contains(event.target)) {
    userInfoCard.style.display = userInfoCard.style.display === 'block' ? 'none' : 'block';
  } else {
    if (userInfoCard) userInfoCard.style.display = 'none';
  }
});
