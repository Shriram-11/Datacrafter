document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("https://datacrafters.onrender.com/api/login/", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (data.success) {
    localStorage.setItem("token", data.data.access);
    window.location.href = "upload_csv.html"; // Redirect to CSV upload page
    } else {
    alert("Login failed: " + data.message);
    }
});

document.getElementById("logout").addEventListener("click", () => {
    // Clear the access token from localStorage
    localStorage.removeItem("token");

    // Redirect to the login page
    window.location.href = "login.html"; // or the appropriate login page URL
});

document.getElementById("logout").addEventListener("click", () => {
    // Clear the access token from localStorage
    localStorage.removeItem("token");

    // Redirect to the login page
    window.location.href = "login.html"; // or the appropriate login page URL
});
