document.getElementById("signupform").addEventListener("submit", async (e) => {
e.preventDefault();
const username = document.getElementById("signupUsername").value; // Ensure unique ID for signup username
const password = document.getElementById("signupPassword").value; // Ensure unique ID for signup password
console.log(username);
try {
const response = await fetch("https://datacrafters.onrender.com/api/signup/", {
    method: "POST",
    headers: {
    "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
});

const data = await response.json();
if (data.success) {
    alert("Signup successful! Please log in.");
    window.location.href = "login.html"; // Redirect to login page
} else {
    alert("Signup failed: " + data.message);
}
} catch (error) {
console.error("Error during signup request:", error);
alert("An error occurred. Please try again.");
}
});

document.getElementById("logout").addEventListener("click", () => {
    // Clear the access token from localStorage
    localStorage.removeItem("token");

    // Redirect to the login page
    window.location.href = "login.html"; // or the appropriate login page URL
});
