function loadComponent(id, url, activePage) {
    fetch(url)
        .then(r => r.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
            if (id === 'main-header') {
                // Surligne le lien de la page actuelle
                const links = document.querySelectorAll('nav a');
                links.forEach(l => {
                    if(l.getAttribute('href') === activePage) l.classList.add('active');
                });
            }
        });
}

function initPage(page) {
    document.addEventListener("DOMContentLoaded", () => {
        loadComponent("main-header", "components/header.html", page);
        loadComponent("main-footer", "components/footer.html");
    });
}