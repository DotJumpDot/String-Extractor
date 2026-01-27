function validateUser(user) {
  if (!user.email) {
    throw new Error("Email is required");
  }
  if (!user.password) {
    throw new Error("Password is required");
  }
}

function login(email, password) {
  if (!email) {
    throw new Error("Email is required");
  }
  if (!password) {
    throw new Error("Password is required");
  }
}

function showMessage(message) {
  alert("This is a test message");
  console.log("This is a test message");
  console.log("Another test message");
}

const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retryCount: 3,
};

function fetchData(url) {
  return fetch("https://api.example.com" + url);
}

function postData(url, data) {
  return fetch("https://api.example.com" + url, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
