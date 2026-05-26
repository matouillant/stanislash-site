
function loadComponent(id, url, activePage) {
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("Erreur de chargement");
            return response.text();
        })
        .then(data => {
            document.getElementById(id).innerHTML = data;
            
            // Mettre en gras le lien actif si on charge le header
            if (id === 'main-header') {
                const links = document.querySelectorAll('nav ul li a');
                links.forEach(link => {
                    if (link.getAttribute('href') === activePage) {
                        link.classList.add('active');
                    }
                });
            }
        })
        .catch(err => console.error(err));
}

// Initialisation globale
function initPage(pageName) {
    document.addEventListener("DOMContentLoaded", () => {
        loadComponent("main-header", "components/header.html", pageName);
        loadComponent("main-footer", "components/footer.html");
    });
}
