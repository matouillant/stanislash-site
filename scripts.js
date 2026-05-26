function loadComponent(elementId, url) {
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("Fichier non trouvé");
            return response.text();
        })
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
        })
        .catch(err => console.error(err));
}

document.addEventListener("DOMContentLoaded", () => {
    loadComponent("main-header", "components/header.html");
    loadComponent("main-footer", "components/footer.html");
});