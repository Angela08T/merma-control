const utils = {
    formatDate(date) {
        return new Date(date).toLocaleDateString('es-PE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    },

    formatDateTime(date) {
        return new Date(date).toLocaleString('es-PE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    showAlert(message, type = 'success') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;

        const content = document.getElementById('content');
        content.insertBefore(alertDiv, content.firstChild);

        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    },

    getStatusBadge(status) {
        const badges = {
            OK: 'badge-ok',
            CRITICAL: 'badge-critical',
            EXPIRED: 'badge-expired',
            RETIRED: 'badge-retired'
        };
        return `<span class="badge ${badges[status]}">${status}</span>`;
    },

    getRolBadge(rol) {
        const badges = {
            ADMINISTRATOR: 'badge-admin',
            SUPERVISOR: 'badge-supervisor'
        };
        return `<span class="badge ${badges[rol]}">${rol}</span>`;
    },

    showLoading() {
        return '<div class="loading">Cargando...</div>';
    },

    showEmpty(message) {
        return `<div class="empty-state">
            <h3>${message}</h3>
            <p>No hay datos para mostrar</p>
        </div>`;
    }
};
