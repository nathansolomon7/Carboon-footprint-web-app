window.onload = init;

function init() {
    document.getElementById("sign_in_button")
        .addEventListener("click", signIn);
}

function signIn() {
    window.location.href = "../html/dashboard.html";
}