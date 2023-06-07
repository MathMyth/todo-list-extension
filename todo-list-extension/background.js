chrome.runtime.onInstalled.addListener(function() {
    // Initialize the storage
    chrome.storage.sync.set({ todos: [] }, function() {
      console.log("TODO list initialized");
    });
  });
  
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
  