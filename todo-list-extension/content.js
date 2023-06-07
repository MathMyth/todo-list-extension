chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "addTodoItem") {
      var todoText = request.todoText;
      // Perform action with the todoText
      sendResponse({ message: "Todo item added successfully" });
    }
  });
  