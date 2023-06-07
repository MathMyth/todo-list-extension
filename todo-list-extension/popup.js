document.addEventListener("DOMContentLoaded", function() {
    var todoList = document.getElementById("todoList");
    var todoInput = document.getElementById("todoInput");
    var addButton = document.getElementById("addButton");
  
    addButton.addEventListener("click", function() {
      var todoText = todoInput.value;
      if (todoText.trim() !== "") {
        addTodoItem(todoText);
        todoInput.value = "";
      }
    });
  
    todoInput.addEventListener("keydown", function(event) {
      if (event.key === "Enter") {
        var todoText = todoInput.value;
        if (todoText.trim() !== "") {
          addTodoItem(todoText);
          todoInput.value = "";
        }
      }
    });
  
    todoList.addEventListener("click", function(event) {
      var target = event.target;
      if (target.tagName === "INPUT") {
        var listItem = target.parentNode;
        if (target.checked) {
          listItem.classList.add("completed");
        } else {
          listItem.classList.remove("completed");
        }
      } else if (target.classList.contains("delete-btn")) {
        var listItem = target.parentNode;
        var todoText = listItem.querySelector("label").textContent;
        deleteTodoItem(todoText);
        listItem.remove();
      }
    });
  
    function addTodoItem(todoText) {
      var listItem = document.createElement("li");
      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      var label = document.createElement("label");
      label.textContent = todoText;
      var deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-btn");
      deleteBtn.textContent = "Delete";
      listItem.appendChild(checkbox);
      listItem.appendChild(label);
      listItem.appendChild(deleteBtn);
      todoList.appendChild(listItem);
      saveTodoItem(todoText);
    }
  
    function saveTodoItem(todoText) {
      chrome.identity.getProfileUserInfo(function(userInfo) {
        var email = userInfo.email;
        chrome.storage.sync.get(email, function(result) {
          var todos = result[email];
          if (!todos) {
            todos = [];
          }
          todos.push(todoText);
          var data = {};
          data[email] = todos;
          chrome.storage.sync.set(data);
        });
      });
    }
  
    function deleteTodoItem(todoText) {
      chrome.identity.getProfileUserInfo(function(userInfo) {
        var email = userInfo.email;
        chrome.storage.sync.get(email, function(result) {
          var todos = result[email];
          if (todos) {
            var index = todos.indexOf(todoText);
            if (index !== -1) {
              todos.splice(index, 1);
              var data = {};
              data[email] = todos;
              chrome.storage.sync.set(data);
            }
          }
        });
      });
    }
  
    function loadTodoList() {
      chrome.identity.getProfileUserInfo(function(userInfo) {
        var email = userInfo.email;
        chrome.storage.sync.get(email, function(result) {
          var todos = result[email];
          if (todos) {
            todos.forEach(function(todo) {
              addTodoItem(todo);
            });
          }
        });
      });
    }
  
    loadTodoList();
  });
  