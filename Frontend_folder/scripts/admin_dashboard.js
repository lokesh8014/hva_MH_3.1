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
  fetchingAllTasks();
});


// Fetching and displaying all users and their tasks (for admin)
async function fetchingAllTasks() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("https://hva-mh-3-1.onrender.com/api/admin/dashboard", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });

    if (!response.ok) {
      alert("Unauthorized access. Redirecting to login.");
      window.location.href = "login.html";
      return;
    }

    const data = await response.json();
    console.log("Fetched data:", data);

    const taskListElement = document.getElementById("taskList");
    taskListElement.innerHTML = "";

    const users = data.users || [data.user];
    if (!users || users.length === 0) {
      taskListElement.innerHTML = "<p>No tasks found</p>";
      return;
    }

    let totalTasks = 0;

    users.forEach(user => {
      const userBox = document.createElement("div");
      userBox.className = "user-task-box";

      const userHeading = document.createElement("h3");
      userHeading.textContent = `👤 ${user.name} (${user.email})`;
      userBox.appendChild(userHeading);

      if (!user.tasks || user.tasks.length === 0) {
        const noTasks = document.createElement("p");
        noTasks.textContent = "No tasks assigned.";
        userBox.appendChild(noTasks);
      } else {
        user.tasks.forEach(task => {
          const taskBox = document.createElement("div");
          taskBox.className = "task-box";

          const title = document.createElement("h4");
          title.textContent = task.title;

          const description = document.createElement("p");
          description.textContent = task.description || "No Description";

          taskBox.appendChild(title);
          taskBox.appendChild(description);
          userBox.appendChild(taskBox);
          totalTasks++;
        });
      }

      taskListElement.appendChild(userBox);
    });

    const taskCountElement = document.getElementById("taskCount");
    if (taskCountElement) {
      taskCountElement.textContent = `Tasks: ${totalTasks}`;
    }

  } catch (error) {
    console.error("Error fetching tasks:", error);
    alert("Server error. Try again later.");
  }
}

// Logout logic
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}
