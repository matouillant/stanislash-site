function loadComponent(id, url) {
    fetch(url).then(r => r.text()).then(d => document.getElementById(id).innerHTML = d);
}
document.addEventListener("DOMContentLoaded", () => {
    loadComponent("main-header", "components/header.html");
    loadComponent("main-footer", "components/footer.html");
});