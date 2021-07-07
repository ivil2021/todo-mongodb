const input = document.querySelector("#input");
const addBtn = document.querySelector("#addBtn");
const todoListContainer = document.querySelector("#todo-list-container");
const total = document.querySelector("#total");

let l = 0; // Number of elements in my todoList
let todosArr = [];

let todoList = new TodoList();

const serverContent = fetch("http://localhost:3333/todos")
  .then((res) => res.json())
  .then((data) => {
    todosArr = data;

    if (todosArr !== []) {
      todosArr.forEach((el) => {
        const todo = new Todo(el.name, el.isDone, el._id);
        todoList.addElement(todo);
      });
    }

    todosArrLengthUpdate(todoList);

    const list = todoList.getTodos();
    list.forEach((todoItem) => {
      let el = createTodoDOMElement(todoItem);
      todoListContainer.appendChild(el);
    });
  });

function createTodoDOMElement(testTodo) {
  // Creating a todo item DOM element
  let todoDOMElement = document.createElement("li");
  todoDOMElement.className = "li";
  todoDOMElement.id = testTodo.id;
  todoDOMElement.textContent = testTodo.name;

  if (testTodo.isDone) {
    todoDOMElement.classList.add("li-completed");
  }

  // Looking at mouse events / target / path / parent node
  let delBtnDOMElement = document.createElement("button"); // Create Del button at the end of the task
  delBtnDOMElement.className = "btn-delete-todo"; // Attach class to the button
  delBtnDOMElement.textContent = "Del"; // Add text Del to the button

  // Del button. Deleting the certain todo from todoList by pressing Del button
  delBtnDOMElement.addEventListener("click", (e) => {
    e.stopPropagation();

    // Confirmation window for deleting todos
    if (confirm("Are you sure?")) {
      let id = e.target.parentElement.id; // Getting an id of the parent element
      todoList.removeElement(id); // Removing from data
      document.getElementById(id).remove(); // Removing from html

      fetch("http://localhost:3333/todos", {
        method: "DELETE",
        body: JSON.stringify({ ids: [id] }),
        headers: {
          // It's necessary to point out the certain type of the text "application/json"
          "Content-Type": "application/json",
        },
      }).then(() => {
        todosArrLengthUpdate(todoList);
      });
      todosArrLengthUpdate(todoList);
    }
  });

  // Adding Del button to the list element
  todoDOMElement.appendChild(delBtnDOMElement);

  // Toggle class completed
  todoDOMElement.addEventListener("click", (e) => {
    let id = e.target.id;
    let todo = todoList.getElementById(id);

    fetch("http://localhost:3333/todos/" + id, {
      method: "PATCH",
      body: JSON.stringify({ isDone: todo.isDone }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      e.target.classList.toggle("li-completed");
      todo.toggle(!todo.isDone);
      todosArrLengthUpdate(todoList);
    });
  });

  return todoDOMElement;
}

// Add button event
addBtn.addEventListener("click", (e) => {
  fetch("http://localhost:3333/todos", {
    method: "POST",
    body: JSON.stringify({ name: input.value }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((data) => {
      console.log(data);
      return data.json();
    })
    .then((res) => {
      const todo = new Todo(res.name, res._id, res.isDone);
      console.log(res);
      todoList.addElement(todo);

      // Clearing our input field
      input.value = "";

      let todoDOMElement = createTodoDOMElement(todo);

      // Adding a todo item DOM element (with events attached) to todo list DOM element
      todoListContainer.appendChild(todoDOMElement);

      todosArrLengthUpdate(todoList);
    })
    .catch((error) => console.log(error));
});

function toggleTodosVisibility(visibleTodosIds) {
  todoList.getTodos().forEach((todo) => {
    let el = document.getElementById(todo.id);
    if (!visibleTodosIds.includes(todo.id)) {
      el.classList.add("hidden");
    } else {
      el.classList.remove("hidden");
    }
  });
}

// Active button event
document.querySelector(".activeBtn").addEventListener("click", (e) => {
  let visibleTodosIds = todoList.filterByStatus(ACTIVE).map((item) => item.id);
  toggleTodosVisibility(visibleTodosIds);
});

// Completed button event
document.querySelector(".completedBtn").addEventListener("click", (e) => {
  let visibleTodosIds = todoList
    .filterByStatus(COMPLETED)
    .map((item) => item.id);
  toggleTodosVisibility(visibleTodosIds);
});

// All button event
document.querySelector(".AllBtn").addEventListener("click", (e) => {
  let visibleTodosIds = todoList.filterByStatus(ALL).map((item) => item.id);
  toggleTodosVisibility(visibleTodosIds);
});

// Clear All button event
// Using a querySelector with .clearAllBtn class to make sure that we work with the Clear All button
document.querySelector(".clearAllBtn").addEventListener("click", (e) => {
  if (confirm("Are you sure?")) {
    todoList.clear();
    todoListContainer.innerHTML = "";

    fetch("http://localhost:3333/todos", {
      method: "DELETE",
      body: JSON.stringify([]),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
      todosArrLengthUpdate(todoList);
    });

    todosArrLengthUpdate(todoList);
  }
});

function todosArrLengthUpdate(todos) {
  l = todos.filterByStatus(ACTIVE).length;
  total.textContent = l + " tasks left";
}
