async function fetchingUserTasks() {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("No token found in localStorage.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/user/dashboard", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched Tasks:", data); // Debugging

        const taskListElement = document.getElementById("taskList");
        taskListElement.innerHTML = ""; // Clear existing tasks

        if (Array.isArray(data.tasks) && data.tasks.length > 0) {
            data.tasks.forEach(task => {
                const taskBox = document.createElement("div");
                taskBox.classList.add("task-box");

                const title = document.createElement("h3");
                title.textContent = task.title;

                const description = document.createElement("p");
                description.textContent = task.description;

                taskBox.appendChild(title);
                taskBox.appendChild(description);
                taskListElement.appendChild(taskBox);
            });
        } else {
            taskListElement.innerHTML = "<p>No tasks found</p>";
        }
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
}

fetchingUserTasks();
