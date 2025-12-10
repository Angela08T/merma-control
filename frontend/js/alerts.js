const alerts = {
    currentAlerts: [],

    async render() {
        const content = document.getElementById('content');
        content.innerHTML = utils.showLoading();

        try {
            const alertsData = await api.get('/alert');
            this.currentAlerts = alertsData;

            content.innerHTML = `
                <h2 class="page-title">Alertas del Sistema</h2>

                <div class="actions">
                    <select id="filterAlertStatus" class="search-box">
                        <option value="">Todos los estados</option>
                        <option value="OK">OK</option>
                        <option value="CRITICAL">CRITICAL</option>
                        <option value="EXPIRED">EXPIRED</option>
                        <option value="RETIRED">RETIRED</option>
                    </select>
                </div>

                <div class="card">
                    <div id="alertsTable">${this.renderTable()}</div>
                </div>
            `;

            document.getElementById('filterAlertStatus').addEventListener('change', () => {
                this.filterAlerts();
            });
        } catch (error) {
            content.innerHTML = '<div class="alert alert-error">Error al cargar alertas</div>';
        }
    },

    renderTable() {
        if (this.currentAlerts.length === 0) {
            return utils.showEmpty('No hay alertas registradas');
        }

        return `
            <table>
                <thead>
                    <tr>
                        <th>Fecha de Creación</th>
                        <th>Última Actualización</th>
                        <th>Stock ID</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.currentAlerts.map(alert => `
                        <tr>
                            <td>${utils.formatDateTime(alert.created_at)}</td>
                            <td>${utils.formatDateTime(alert.updated_at)}</td>
                            <td>${alert.stock_id}</td>
                            <td>${utils.getStatusBadge(alert.status)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    },

    filterAlerts() {
        const statusFilter = document.getElementById('filterAlertStatus').value;

        if (!statusFilter) {
            this.render();
            return;
        }

        const filtered = this.currentAlerts.filter(alert => alert.status === statusFilter);

        const temp = this.currentAlerts;
        this.currentAlerts = filtered;
        document.getElementById('alertsTable').innerHTML = this.renderTable();
        this.currentAlerts = temp;
    }
};
