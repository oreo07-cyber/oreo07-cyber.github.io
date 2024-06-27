// Load footer content
const footerContent = document.getElementById('footer-content');

fetch('footer.html')
    .then(response => response.text())
    .then(data => {
        footerContent.innerHTML = data;
    });
