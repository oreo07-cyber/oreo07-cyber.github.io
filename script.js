document.addEventListener("DOMContentLoaded", function() {
    const contentDiv = document.getElementById("content");
    const headerContentDiv = document.getElementById("header-content");
    const footerContentDiv = document.getElementById("footer-content");

    // Function to load header content
    async function loadHeaderContent() {
        try {
            let response = await fetch("header.html");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            let html = await response.text();
            headerContentDiv.innerHTML = html;
        } catch (error) {
            console.error("Fetch error:", error);
            headerContentDiv.innerHTML = "<p>Error loading header content.</p>";
        }
    }

    // Function to load footer content
    async function loadFooterContent() {
        try {
            let response = await fetch("footer.html");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            let html = await response.text();
            footerContentDiv.innerHTML = html;
        } catch (error) {
            console.error("Fetch error:", error);
            footerContentDiv.innerHTML = "<p>Error loading footer content.</p>";
        }
    }

    // Function to load page content based on URL hash
    function loadPageContent() {
        let url = window.location.href;
        let hashIndex = url.indexOf("#");
        let hash = hashIndex !== -1 ? url.substring(hashIndex + 1) : "home";

        fetchContent(hash);
    }

    // Function to fetch and display content
    async function fetchContent(pageName) {
        try {
            let response = await fetch(`${pageName}.html`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            let html = await response.text();
            contentDiv.innerHTML = html;
        } catch (error) {
            console.error("Fetch error:", error);
            contentDiv.innerHTML = "<p>Error loading content.</p>";
        }
    }

    // Load header and footer content
    loadHeaderContent();
    loadFooterContent();

    // Handle navigation
    document.querySelectorAll(".navbar a").forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            let pageName = this.getAttribute("href").substring(1);
            fetchContent(pageName);
            history.pushState(null, null, `#${pageName}`);
        });
    });

    // Handle initial page load and back/forward navigation
    window.addEventListener("popstate", loadPageContent);

    // Initial page load
    loadPageContent();
});
