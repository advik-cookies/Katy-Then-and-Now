document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;
    const links = document.querySelectorAll(".nav-link");
    
    links.forEach(link => {
        const href = link.getAttribute("href");
        if (href && path.endsWith(href)) {
            link.classList.add("active");
        }
        if ((path === "/" || path.endsWith("index.html")) && href === "index.html") {
            link.classList.add("active");
        }
    });
});