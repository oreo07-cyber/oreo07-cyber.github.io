document.addEventListener("DOMContentLoaded", function() {
    const contentDiv = document.getElementById("content");

    // Function to load page content based on URL hash
    function loadPageContent() {
        let url = window.location.href;
        let hashIndex = url.indexOf("#");
        let hash = hashIndex !== -1 ? url.substring(hashIndex) : "#home";

        fetchContent(hash);
    }

    // Function to fetch and display content
    async function fetchContent(hash) {
        try {
            let response = await fetch(`${hash}.html`);
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

    // Load initial content based on URL hash
    loadPageContent();

    // Event listener for navigation links
    document.querySelectorAll(".navbar a").forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            let hash = this.getAttribute("href");
            fetchContent(hash);
            history.pushState(null, null, hash);
        });
    });

    // Handle back/forward browser buttons
    window.addEventListener("popstate", () => {
        loadPageContent();
    });
});
