document.addEventListener("DOMContentLoaded", async function () {
    const navbar = document.getElementById("navbar");
    const footer = document.getElementById("footer");

    try {
        if (navbar) {
            const navRes = await fetch("./components/navbar.html");
            navbar.innerHTML = await navRes.text();
        }
        if (footer) {
            const footerRes = await fetch("./components/footer.html");
            footer.innerHTML = await footerRes.text();
        }
    } catch (error) {
        console.error("Component load error:", error);
    }
});
