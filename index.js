// Get references to HTML elements
const input = document.getElementById('todo-input');       // Text input field
const addBtn = document.getElementById('add-btn');      // Add button
const todoList = document.getElementById('todo-list'); // <ul> element to display todos

// Get saved todos from localStorage (if any)

const saved = localStorage.getItem('todos');


// If there are saved todos, parse them; otherwise, use an empty array
const todos = saved ? JSON.parse(saved) : [];



// Function to save todos array to localStorage
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}



// Function to create a single todo list item (HTML node)
function createTodoNode(todo, index) {
  // Create the <li> element
  const li = document.createElement('li');

  // Create a checkbox for marking completion
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = !!todo.completed; // true or false

  // When checkbox changes, toggle completion state
  checkbox.addEventListener('change', () => {
    todo.completed = checkbox.checked; // Update completion
    saveTodos();                       // Save updated todos
    render();                          // Re-render the list
  });

  // Create a span to show the todo text
  const textspan = document.createElement('span');
  textspan.textContent = todo.text;           // Display the text
  textspan.style.margin = '0 8px';            // Add some spacing
  textspan.style.textDecoration = todo.completed ? 'line-through' : 'none'; // Strike if completed

  // Double-click to edit the todo text
  textspan.addEventListener('dblclick', () => {
    const newText = prompt('Edit todo:', todo.text); // Ask for new text
    if (newText !== null) {                          // If user didn’t cancel
      todo.text = newText.trim();                    // Update text
      saveTodos();                                   // Save changes
      render();                                      // Refresh UI
    }
  });

  // Create a delete button for each todo
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';

  // When delete button is clicked, remove the todo
  deleteBtn.addEventListener('click', () => {
    todos.splice(index, 1); // Remove the todo at this index
    saveTodos();            // Save updated todos
    render();               // Refresh UI
  });

  // Append checkbox, text, and delete button inside <li>
  li.appendChild(checkbox);
  li.appendChild(textspan);
  li.appendChild(deleteBtn);

  // Return the fully built <li> to be added to the list
  return li;
}

// Function to render all todos onto the page
function render() {
  todoList.innerHTML = ''; // Clear the existing list first

  // Loop through each todo and create its <li> node
  todos.forEach((todo, index) => {
    const node = createTodoNode(todo, index);
    todoList.appendChild(node); // Add each todo item to the <ul>
  });
}

// Function to add a new todo
function addTodo() {
  const text = input.value.trim(); // Get text from input field and remove extra spaces
  if (!text) return;               // If empty, do nothing

  // Add new todo object to array
  todos.push({ text, completed: false });

  input.value = '';  // Clear the input box
  saveTodos();       // Save updated todos
  render();          // Re-render the list
}

// When user clicks "Add", call addTodo()
addBtn.addEventListener('click', addTodo);

// Optional: allow pressing Enter key to add todos too
input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTodo();
});

// Initial render when page loads
render();
