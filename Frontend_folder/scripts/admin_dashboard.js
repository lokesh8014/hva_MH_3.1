async function fetchingAllTasks() {
  const token = localStorage.getItem('token');

  const response = await fetch(
    'https://hva-mh-3-1.onrender.com/api/admin/dashboard',
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) {
    alert('Unauthorized access. Redirecting to login.');
    window.location.href = 'login.html';
    return;
  }

  const data = await response.json();
  const taskListElement = document.getElementById('taskList');
  taskListElement.innerHTML = '';

  if (!data.tasks || data.tasks.length === 0) {
    taskListElement.innerHTML = '<p>No tasks found</p>';
    return;
  }

  data.tasks.forEach((task) => {
    const taskBox = document.createElement('div');
    taskBox.classList.add('task-box');

    const title = document.createElement('h3');
    title.textContent = task.title;

    const description = document.createElement('p');
    description.textContent = task.description || 'No Description';

    taskBox.appendChild(title);
    taskBox.appendChild(description);
    taskListElement.appendChild(taskBox);
  });
}

fetchingAllTasks();
