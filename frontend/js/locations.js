const locations = {
    currentLocations: [],

    async render() {
        const content = document.getElementById('content');
        content.innerHTML = utils.showLoading();

        try {
            const locationsData = await api.get('/location');
            this.currentLocations = locationsData;

            content.innerHTML = `
                <h2 class="page-title">Gestión de Ubicaciones</h2>

                <div class="actions">
                    <input type="text" id="searchLocation" class="search-box" placeholder="Buscar ubicación...">
                    <button class="btn" onclick="locations.showAddModal()">Agregar Ubicación</button>
                </div>

                <div class="card">
                    <div id="locationsTable">${this.renderTable()}</div>
                </div>

                <div id="locationModal" class="modal"></div>
            `;

            document.getElementById('searchLocation').addEventListener('input', (e) => {
                this.filterLocations(e.target.value);
            });
        } catch (error) {
            content.innerHTML = '<div class="alert alert-error">Error al cargar ubicaciones</div>';
        }
    },

    renderTable() {
        if (this.currentLocations.length === 0) {
            return utils.showEmpty('No hay ubicaciones registradas');
        }

        return `
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Fecha de Creación</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.currentLocations.map(location => `
                        <tr>
                            <td>${location.name}</td>
                            <td>${utils.formatDate(location.created_at)}</td>
                            <td>
                                <button class="btn btn-small btn-secondary" onclick="locations.showEditModal('${location.id}')">Editar</button>
                                <button class="btn btn-small btn-secondary" onclick="locations.deleteLocation('${location.id}')">Eliminar</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    },

    filterLocations(searchTerm) {
        if (!searchTerm) {
            this.render();
            return;
        }

        const filtered = this.currentLocations.filter(location =>
            location.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const temp = this.currentLocations;
        this.currentLocations = filtered;
        document.getElementById('locationsTable').innerHTML = this.renderTable();
        this.currentLocations = temp;
    },

    showAddModal() {
        const modal = document.getElementById('locationModal');
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Agregar Ubicación</h2>
                    <span class="close-modal" onclick="locations.closeModal()">&times;</span>
                </div>
                <form id="locationForm" onsubmit="locations.saveLocation(event)">
                    <div class="form-group">
                        <label>Nombre</label>
                        <input type="text" name="name" required>
                    </div>
                    <button type="submit" class="btn">Guardar</button>
                    <button type="button" class="btn btn-secondary" onclick="locations.closeModal()">Cancelar</button>
                </form>
            </div>
        `;
        modal.classList.add('active');
    },

    showEditModal(id) {
        const location = this.currentLocations.find(l => l.id === id);
        if (!location) return;

        const modal = document.getElementById('locationModal');
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Editar Ubicación</h2>
                    <span class="close-modal" onclick="locations.closeModal()">&times;</span>
                </div>
                <form id="locationForm" onsubmit="locations.updateLocation(event, '${id}')">
                    <div class="form-group">
                        <label>Nombre</label>
                        <input type="text" name="name" value="${location.name}" required>
                    </div>
                    <button type="submit" class="btn">Actualizar</button>
                    <button type="button" class="btn btn-secondary" onclick="locations.closeModal()">Cancelar</button>
                </form>
            </div>
        `;
        modal.classList.add('active');
    },

    async saveLocation(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);

        try {
            await api.post('/location', data);
            this.closeModal();
            utils.showAlert('Ubicación agregada exitosamente');
            this.render();
        } catch (error) {
            utils.showAlert('Error al agregar ubicación', 'error');
        }
    },

    async updateLocation(event, id) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);

        try {
            await api.put(`/location/${id}`, data);
            this.closeModal();
            utils.showAlert('Ubicación actualizada exitosamente');
            this.render();
        } catch (error) {
            utils.showAlert('Error al actualizar ubicación', 'error');
        }
    },

    async deleteLocation(id) {
        if (!confirm('¿Está seguro de eliminar esta ubicación?')) return;

        try {
            await api.delete(`/location/${id}`);
            utils.showAlert('Ubicación eliminada exitosamente');
            this.render();
        } catch (error) {
            utils.showAlert('Error al eliminar ubicación', 'error');
        }
    },

    closeModal() {
        document.getElementById('locationModal').classList.remove('active');
    }
};
