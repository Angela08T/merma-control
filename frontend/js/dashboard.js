const dashboard = {
    async render() {
        const content = document.getElementById('content');
        content.innerHTML = utils.showLoading();

        try {
            const [stocks, alerts] = await Promise.all([
                api.get('/stock'),
                api.get('/alert')
            ]);

            const stats = this.calculateStats(stocks, alerts);

            content.innerHTML = `
                <h2 class="page-title">Dashboard</h2>

                <div class="stats-grid">
                    <div class="stat-card">
                        <h3>Total Productos en Stock</h3>
                        <div class="number">${stats.totalStock}</div>
                    </div>
                    <div class="stat-card ok">
                        <h3>Estado OK</h3>
                        <div class="number">${stats.ok}</div>
                    </div>
                    <div class="stat-card critical">
                        <h3>Estado Crítico</h3>
                        <div class="number">${stats.critical}</div>
                    </div>
                    <div class="stat-card expired">
                        <h3>Productos Expirados</h3>
                        <div class="number">${stats.expired}</div>
                    </div>
                </div>

                <div class="card">
                    <h3>Alertas Recientes</h3>
                    ${this.renderRecentAlerts(alerts)}
                </div>

                <div class="card">
                    <h3>Stock Próximo a Vencer</h3>
                    ${this.renderExpiringStock(stocks)}
                </div>
            `;
        } catch (error) {
            content.innerHTML = '<div class="alert alert-error">Error al cargar el dashboard</div>';
        }
    },

    calculateStats(stocks, alerts) {
        const stats = {
            totalStock: stocks.length,
            ok: stocks.filter(s => s.status === 'OK').length,
            critical: stocks.filter(s => s.status === 'CRITICAL').length,
            expired: stocks.filter(s => s.status === 'EXPIRED').length,
        };
        return stats;
    },

    renderRecentAlerts(alerts) {
        if (!alerts || alerts.length === 0) {
            return utils.showEmpty('No hay alertas');
        }

        const recentAlerts = alerts.slice(0, 5);
        return `
            <table>
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>ID Stock</th>
                    </tr>
                </thead>
                <tbody>
                    ${recentAlerts.map(alert => `
                        <tr>
                            <td>${utils.formatDateTime(alert.created_at)}</td>
                            <td>${utils.getStatusBadge(alert.status)}</td>
                            <td>${alert.stock_id}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    },

    renderExpiringStock(stocks) {
        const now = new Date();
        const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        const expiringStock = stocks
            .filter(stock => {
                const expiredDate = new Date(stock.expired_at);
                return expiredDate <= thirtyDaysFromNow && expiredDate > now;
            })
            .slice(0, 5);

        if (expiringStock.length === 0) {
            return utils.showEmpty('No hay stock próximo a vencer');
        }

        return `
            <table>
                <thead>
                    <tr>
                        <th>Lote</th>
                        <th>Producto ID</th>
                        <th>Cantidad</th>
                        <th>Fecha de Expiración</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    ${expiringStock.map(stock => `
                        <tr>
                            <td>${stock.batch}</td>
                            <td>${stock.product_id}</td>
                            <td>${stock.quantity}</td>
                            <td>${utils.formatDate(stock.expired_at)}</td>
                            <td>${utils.getStatusBadge(stock.status)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
};
