// Wait for the HTML document to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // 1. SELECTING DOM ELEMENTS
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');

    // 2. LOAD TASKS FROM LOCAL STORAGE
    const loadTasks = () => {
        // Retrieve tasks from local storage or initialize with an empty array
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks.forEach(task => createTaskElement(task.text, task.completed));
    };

    // 3. SAVE TASKS TO LOCAL STORAGE
    const saveTasks = () => {
        const tasks = [];
        // Select all task items and save their text and completion status
        document.querySelectorAll('.task-item').forEach(taskItem => {
            tasks.push({
                text: taskItem.querySelector('span').textContent, // Get text from span
                completed: taskItem.classList.contains('completed')
            });
        });
        // Convert the array to a JSON string and store it
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // 4. CREATE A NEW TASK ELEMENT IN THE HTML
    const createTaskElement = (taskText, isCompleted) => {
        const li = document.createElement('li');
        li.className = 'task-item';
        if (isCompleted) {
            li.classList.add('completed');
        }

        // Create a span for the task text. This allows the line-through
        // style to apply only to the text, not the button.
        const taskSpan = document.createElement('span');
        taskSpan.textContent = taskText;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';

        // Append the text span and delete button to the list item
        li.appendChild(taskSpan);
        li.appendChild(deleteBtn);

        // Add the new list item to the main task list
        taskList.appendChild(li);
    };

    // 5. FUNCTION TO HANDLE ADDING A NEW TASK
    const addTask = () => {
        const taskText = taskInput.value.trim(); // Get text and remove whitespace
        if (taskText === '') {
            // Use a less obtrusive way to notify user, but alert is simple for this example
            alert('Please enter a task!');
            return; // Stop if input is empty
        }
        createTaskElement(taskText, false);
        saveTasks();
        taskInput.value = ''; // Clear the input field
        taskInput.focus(); // Return cursor to the input field
    };
    
    // 6. EVENT LISTENERS
    // Listen for a click on the "Add" button
    addTaskBtn.addEventListener('click', addTask);
    
    // Listen for the "Enter" key press in the input field
    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    // Use event delegation for toggling completion and deleting tasks
    taskList.addEventListener('click', (event) => {
        const taskItem = event.target.closest('.task-item');
        if (!taskItem) return; // Exit if the click was not inside a task item

        // Check if the delete button was the specific target of the click
        if (event.target.classList.contains('delete-btn')) {
            taskList.removeChild(taskItem);
        } else {
            // Otherwise, the click was on the task item itself (or its text)
            taskItem.classList.toggle('completed');
        }
        
        // Save the updated state after either action
        saveTasks();
    });

    // Initial load of tasks when the page is first opened
    loadTasks();
});
