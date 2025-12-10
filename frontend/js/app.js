const app = {
    currentPage: 'dashboard',

    init() {
        this.setupNavigation();
        this.loadPage('dashboard');
    },

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.loadPage(page);

                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    },

    loadPage(page) {
        this.currentPage = page;

        const pages = {
            dashboard: () => dashboard.render(),
            products: () => products.render(),
            stock: () => stock.render(),
            donations: () => donations.render(),
            alerts: () => alerts.render(),
            categories: () => categories.render(),
            locations: () => locations.render(),
            ongs: () => ongs.render(),
            users: () => users.render()
        };

        if (pages[page]) {
            pages[page]();
        } else {
            document.getElementById('content').innerHTML = '<div class="alert alert-error">Página no encontrada</div>';
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
