document.addEventListener("DOMContentLoaded", function() {
    const headerContentDiv = document.getElementById("header-content");

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

    // Load header content
    loadHeaderContent();
});
