// Load header content
const headerContent = document.getElementById('header-content');

fetch('header.html')
    .then(response => response.text())
    .then(data => {
        headerContent.innerHTML = data;
    });
