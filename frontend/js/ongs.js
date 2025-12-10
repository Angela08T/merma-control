const ongs = {
    currentOngs: [],

    async render() {
        const content = document.getElementById('content');
        content.innerHTML = utils.showLoading();

        try {
            const ongsData = await api.get('/ong');
            this.currentOngs = ongsData;

            content.innerHTML = `
                <h2 class="page-title">Gestión de ONGs</h2>

                <div class="actions">
                    <input type="text" id="searchOng" class="search-box" placeholder="Buscar ONG...">
                    <button class="btn" onclick="ongs.showAddModal()">Agregar ONG</button>
                </div>

                <div class="card">
                    <div id="ongsTable">${this.renderTable()}</div>
                </div>

                <div id="ongModal" class="modal"></div>
            `;

            document.getElementById('searchOng').addEventListener('input', (e) => {
                this.filterOngs(e.target.value);
            });
        } catch (error) {
            content.innerHTML = '<div class="alert alert-error">Error al cargar ONGs</div>';
        }
    },

    renderTable() {
        if (this.currentOngs.length === 0) {
            return utils.showEmpty('No hay ONGs registradas');
        }

        return `
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Dirección</th>
                        <th>Teléfono</th>
                        <th>Fecha de Registro</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.currentOngs.map(ong => `
                        <tr>
                            <td>${ong.name}</td>
                            <td>${ong.address}</td>
                            <td>${ong.phone}</td>
                            <td>${utils.formatDate(ong.created_at)}</td>
                            <td>
                                <button class="btn btn-small btn-secondary" onclick="ongs.showEditModal('${ong.id}')">Editar</button>
                                <button class="btn btn-small btn-secondary" onclick="ongs.deleteOng('${ong.id}')">Eliminar</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    },

    filterOngs(searchTerm) {
        if (!searchTerm) {
            this.render();
            return;
        }

        const filtered = this.currentOngs.filter(ong =>
            ong.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ong.address.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const temp = this.currentOngs;
        this.currentOngs = filtered;
        document.getElementById('ongsTable').innerHTML = this.renderTable();
        this.currentOngs = temp;
    },

    showAddModal() {
        const modal = document.getElementById('ongModal');
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Agregar ONG</h2>
                    <span class="close-modal" onclick="ongs.closeModal()">&times;</span>
                </div>
                <form id="ongForm" onsubmit="ongs.saveOng(event)">
                    <div class="form-group">
                        <label>Nombre</label>
                        <input type="text" name="name" required>
                    </div>
                    <div class="form-group">
                        <label>Dirección</label>
                        <input type="text" name="address" required>
                    </div>
                    <div class="form-group">
                        <label>Teléfono</label>
                        <input type="tel" name="phone" required>
                    </div>
                    <button type="submit" class="btn">Guardar</button>
                    <button type="button" class="btn btn-secondary" onclick="ongs.closeModal()">Cancelar</button>
                </form>
            </div>
        `;
        modal.classList.add('active');
    },

    showEditModal(id) {
        const ong = this.currentOngs.find(o => o.id === id);
        if (!ong) return;

        const modal = document.getElementById('ongModal');
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Editar ONG</h2>
                    <span class="close-modal" onclick="ongs.closeModal()">&times;</span>
                </div>
                <form id="ongForm" onsubmit="ongs.updateOng(event, '${id}')">
                    <div class="form-group">
                        <label>Nombre</label>
                        <input type="text" name="name" value="${ong.name}" required>
                    </div>
                    <div class="form-group">
                        <label>Dirección</label>
                        <input type="text" name="address" value="${ong.address}" required>
                    </div>
                    <div class="form-group">
                        <label>Teléfono</label>
                        <input type="tel" name="phone" value="${ong.phone}" required>
                    </div>
                    <button type="submit" class="btn">Actualizar</button>
                    <button type="button" class="btn btn-secondary" onclick="ongs.closeModal()">Cancelar</button>
                </form>
            </div>
        `;
        modal.classList.add('active');
    },

    async saveOng(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);

        try {
            await api.post('/ong', data);
            this.closeModal();
            utils.showAlert('ONG agregada exitosamente');
            this.render();
        } catch (error) {
            utils.showAlert('Error al agregar ONG', 'error');
        }
    },

    async updateOng(event, id) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);

        try {
            await api.put(`/ong/${id}`, data);
            this.closeModal();
            utils.showAlert('ONG actualizada exitosamente');
            this.render();
        } catch (error) {
            utils.showAlert('Error al actualizar ONG', 'error');
        }
    },

    async deleteOng(id) {
        if (!confirm('¿Está seguro de eliminar esta ONG?')) return;

        try {
            await api.delete(`/ong/${id}`);
            utils.showAlert('ONG eliminada exitosamente');
            this.render();
        } catch (error) {
            utils.showAlert('Error al eliminar ONG', 'error');
        }
    },

    closeModal() {
        document.getElementById('ongModal').classList.remove('active');
    }
};
