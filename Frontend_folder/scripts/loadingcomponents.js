document.addEventListener("DOMContentLoaded", function () {
    const navbar = document.getElementById("navbar");
    const footer = document.getElementById("footer");

    if (navbar) {
        fetch("./components/navbar.html")
            .then(response => response.text())
            .then(data => navbar.innerHTML = data)
            .catch(error => console.error("Navbar load error:", error));
    }

    if (footer) {
        fetch("./components/footer.html")
            .then(response => response.text())
            .then(data => footer.innerHTML = data)
            .catch(error => console.error("Footer load error:", error));
    }
});
