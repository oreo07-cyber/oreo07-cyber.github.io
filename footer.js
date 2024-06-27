document.addEventListener("DOMContentLoaded", function() {
    const footerContentDiv = document.getElementById("footer-content");

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

    // Load footer content
    loadFooterContent();
});
