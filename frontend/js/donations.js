const donations = {
    currentDonations: [],
    ongs: [],
    users: [],
    stocks: [],

    async render() {
        const content = document.getElementById('content');
        content.innerHTML = utils.showLoading();

        try {
            const [donationsData, ongsData, usersData, stocksData] = await Promise.all([
                api.get('/donation'),
                api.get('/ong'),
                api.get('/user'),
                api.get('/stock')
            ]);

            this.currentDonations = donationsData;
            this.ongs = ongsData;
            this.users = usersData;
            this.stocks = stocksData;

            content.innerHTML = `
                <h2 class="page-title">Gestión de Donaciones</h2>

                <div class="actions">
                    <input type="text" id="searchDonation" class="search-box" placeholder="Buscar por ONG...">
                    <button class="btn" onclick="donations.showAddModal()">Nueva Donación</button>
                </div>

                <div class="card">
                    <div id="donationsTable">${this.renderTable()}</div>
                </div>

                <div id="donationModal" class="modal"></div>
            `;

            document.getElementById('searchDonation').addEventListener('input', (e) => {
                this.filterDonations(e.target.value);
            });
        } catch (error) {
            content.innerHTML = '<div class="alert alert-error">Error al cargar donaciones</div>';
        }
    },

    renderTable() {
        if (this.currentDonations.length === 0) {
            return utils.showEmpty('No hay donaciones registradas');
        }

        return `
            <table>
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>ONG</th>
                        <th>Usuario</th>
                        <th>URL Recibo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.currentDonations.map(donation => `
                        <tr>
                            <td>${utils.formatDate(donation.created_at)}</td>
                            <td>${this.getOngName(donation.ong_id)}</td>
                            <td>${this.getUserName(donation.user_id)}</td>
                            <td><a href="${donation.receipt_url}" target="_blank">Ver recibo</a></td>
                            <td>
                                <button class="btn btn-small btn-secondary" onclick="donations.viewDetails('${donation.id}')">Ver Detalles</button>
                                <button class="btn btn-small btn-secondary" onclick="donations.deleteDonation('${donation.id}')">Eliminar</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    },

    getOngName(ongId) {
        const ong = this.ongs.find(o => o.id === ongId);
        return ong ? ong.name : 'N/A';
    },

    getUserName(userId) {
        const user = this.users.find(u => u.id === userId);
        return user ? `${user.name} ${user.lastname}` : 'N/A';
    },

    filterDonations(searchTerm) {
        if (!searchTerm) {
            this.render();
            return;
        }

        const filtered = this.currentDonations.filter(donation => {
            const ongName = this.getOngName(donation.ong_id).toLowerCase();
            return ongName.includes(searchTerm.toLowerCase());
        });

        const temp = this.currentDonations;
        this.currentDonations = filtered;
        document.getElementById('donationsTable').innerHTML = this.renderTable();
        this.currentDonations = temp;
    },

    showAddModal() {
        const modal = document.getElementById('donationModal');
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Nueva Donación</h2>
                    <span class="close-modal" onclick="donations.closeModal()">&times;</span>
                </div>
                <form id="donationForm" onsubmit="donations.saveDonation(event)">
                    <div class="form-group">
                        <label>ONG</label>
                        <select name="ong_id" required>
                            <option value="">Seleccionar ONG</option>
                            ${this.ongs.map(ong => `
                                <option value="${ong.id}">${ong.name}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Usuario Responsable</label>
                        <select name="user_id" required>
                            <option value="">Seleccionar usuario</option>
                            ${this.users.map(user => `
                                <option value="${user.id}">${user.name} ${user.lastname}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>URL del Recibo</label>
                        <input type="url" name="receipt_url" placeholder="https://..." required>
                    </div>
                    <div class="form-group">
                        <label>Stock a Donar</label>
                        <select id="stockSelect" name="stock_id">
                            <option value="">Seleccionar stock</option>
                            ${this.stocks.filter(s => s.status === 'OK').map(s => `
                                <option value="${s.id}">Lote: ${s.batch} - Cantidad: ${s.quantity}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Cantidad a Donar</label>
                        <input type="number" id="contributionQuantity" name="quantity" min="1" placeholder="Cantidad">
                    </div>
                    <button type="submit" class="btn">Guardar</button>
                    <button type="button" class="btn btn-secondary" onclick="donations.closeModal()">Cancelar</button>
                </form>
            </div>
        `;
        modal.classList.add('active');
    },

    async viewDetails(id) {
        const donation = this.currentDonations.find(d => d.id === id);
        if (!donation) return;

        try {
            const contributions = await api.get(`/contribution?donation_id=${id}`);

            const modal = document.getElementById('donationModal');
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Detalles de Donación</h2>
                        <span class="close-modal" onclick="donations.closeModal()">&times;</span>
                    </div>
                    <div>
                        <p><strong>ONG:</strong> ${this.getOngName(donation.ong_id)}</p>
                        <p><strong>Usuario:</strong> ${this.getUserName(donation.user_id)}</p>
                        <p><strong>Fecha:</strong> ${utils.formatDate(donation.created_at)}</p>
                        <p><strong>Recibo:</strong> <a href="${donation.receipt_url}" target="_blank">Ver recibo</a></p>

                        <h3 style="margin-top: 20px;">Contribuciones</h3>
                        ${contributions && contributions.length > 0 ? `
                            <table>
                                <thead>
                                    <tr>
                                        <th>Stock ID</th>
                                        <th>Cantidad</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${contributions.map(c => `
                                        <tr>
                                            <td>${c.stock_id}</td>
                                            <td>${c.quantity}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        ` : '<p>No hay contribuciones registradas</p>'}

                        <button class="btn btn-secondary" onclick="donations.closeModal()" style="margin-top: 20px;">Cerrar</button>
                    </div>
                </div>
            `;
            modal.classList.add('active');
        } catch (error) {
            utils.showAlert('Error al cargar detalles', 'error');
        }
    },

    async saveDonation(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = {
            ong_id: formData.get('ong_id'),
            user_id: formData.get('user_id'),
            receipt_url: formData.get('receipt_url')
        };

        try {
            const donation = await api.post('/donation', data);

            const stockId = formData.get('stock_id');
            const quantity = formData.get('quantity');

            if (stockId && quantity) {
                await api.post('/contribution', {
                    donation_id: donation.id,
                    stock_id: stockId,
                    quantity: parseInt(quantity)
                });
            }

            this.closeModal();
            utils.showAlert('Donación registrada exitosamente');
            this.render();
        } catch (error) {
            utils.showAlert('Error al registrar donación', 'error');
        }
    },

    async deleteDonation(id) {
        if (!confirm('¿Está seguro de eliminar esta donación?')) return;

        try {
            await api.delete(`/donation/${id}`);
            utils.showAlert('Donación eliminada exitosamente');
            this.render();
        } catch (error) {
            utils.showAlert('Error al eliminar donación', 'error');
        }
    },

    closeModal() {
        document.getElementById('donationModal').classList.remove('active');
    }
};
