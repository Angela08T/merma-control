const stock = {
    currentStock: [],
    products: [],
    locations: [],
    users: [],

    async render() {
        const content = document.getElementById('content');
        content.innerHTML = utils.showLoading();

        try {
            const [stockData, productsData, locationsData, usersData] = await Promise.all([
                api.get('/stock'),
                api.get('/product'),
                api.get('/location'),
                api.get('/user')
            ]);

            this.currentStock = stockData;
            this.products = productsData;
            this.locations = locationsData;
            this.users = usersData;

            content.innerHTML = `
                <h2 class="page-title">Gestión de Inventario</h2>

                <div class="actions">
                    <input type="text" id="searchStock" class="search-box" placeholder="Buscar por lote...">
                    <select id="filterStatus" class="search-box" style="flex: 0.5;">
                        <option value="">Todos los estados</option>
                        <option value="OK">OK</option>
                        <option value="CRITICAL">CRITICAL</option>
                        <option value="EXPIRED">EXPIRED</option>
                        <option value="RETIRED">RETIRED</option>
                    </select>
                    <button class="btn" onclick="stock.showAddModal()">Agregar Stock</button>
                </div>

                <div class="card">
                    <div id="stockTable">${this.renderTable()}</div>
                </div>

                <div id="stockModal" class="modal"></div>
            `;

            document.getElementById('searchStock').addEventListener('input', (e) => {
                this.filterStock();
            });

            document.getElementById('filterStatus').addEventListener('change', (e) => {
                this.filterStock();
            });
        } catch (error) {
            content.innerHTML = '<div class="alert alert-error">Error al cargar inventario</div>';
        }
    },

    renderTable() {
        if (this.currentStock.length === 0) {
            return utils.showEmpty('No hay stock registrado');
        }

        return `
            <table>
                <thead>
                    <tr>
                        <th>Lote</th>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Ubicación</th>
                        <th>Fecha de Expiración</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.currentStock.map(s => `
                        <tr>
                            <td>${s.batch}</td>
                            <td>${this.getProductName(s.product_id)}</td>
                            <td>${s.quantity}</td>
                            <td>${this.getLocationName(s.location_id)}</td>
                            <td>${utils.formatDate(s.expired_at)}</td>
                            <td>${utils.getStatusBadge(s.status)}</td>
                            <td>
                                <button class="btn btn-small btn-secondary" onclick="stock.showEditModal('${s.id}')">Editar</button>
                                <button class="btn btn-small btn-secondary" onclick="stock.deleteStock('${s.id}')">Eliminar</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    },

    getProductName(productId) {
        const product = this.products.find(p => p.id === productId);
        return product ? product.name : 'N/A';
    },

    getLocationName(locationId) {
        const location = this.locations.find(l => l.id === locationId);
        return location ? location.name : 'N/A';
    },

    filterStock() {
        const searchTerm = document.getElementById('searchStock').value.toLowerCase();
        const statusFilter = document.getElementById('filterStatus').value;

        let filtered = [...this.currentStock];

        if (searchTerm) {
            filtered = filtered.filter(s => s.batch.toLowerCase().includes(searchTerm));
        }

        if (statusFilter) {
            filtered = filtered.filter(s => s.status === statusFilter);
        }

        const temp = this.currentStock;
        this.currentStock = filtered;
        document.getElementById('stockTable').innerHTML = this.renderTable();
        this.currentStock = temp;
    },

    showAddModal() {
        const modal = document.getElementById('stockModal');
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Agregar Stock</h2>
                    <span class="close-modal" onclick="stock.closeModal()">&times;</span>
                </div>
                <form id="stockForm" onsubmit="stock.saveStock(event)">
                    <div class="form-group">
                        <label>Lote</label>
                        <input type="text" name="batch" required>
                    </div>
                    <div class="form-group">
                        <label>Cantidad</label>
                        <input type="number" name="quantity" min="1" required>
                    </div>
                    <div class="form-group">
                        <label>Producto</label>
                        <select name="product_id" required>
                            <option value="">Seleccionar producto</option>
                            ${this.products.map(p => `
                                <option value="${p.id}">${p.name}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Ubicación</label>
                        <select name="location_id" required>
                            <option value="">Seleccionar ubicación</option>
                            ${this.locations.map(l => `
                                <option value="${l.id}">${l.name}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Usuario</label>
                        <select name="user_id" required>
                            <option value="">Seleccionar usuario</option>
                            ${this.users.map(u => `
                                <option value="${u.id}">${u.name} ${u.lastname}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Fecha de Expiración</label>
                        <input type="date" name="expired_at" required>
                    </div>
                    <div class="form-group">
                        <label>Estado</label>
                        <select name="status" required>
                            <option value="OK">OK</option>
                            <option value="CRITICAL">CRITICAL</option>
                            <option value="EXPIRED">EXPIRED</option>
                            <option value="RETIRED">RETIRED</option>
                        </select>
                    </div>
                    <button type="submit" class="btn">Guardar</button>
                    <button type="button" class="btn btn-secondary" onclick="stock.closeModal()">Cancelar</button>
                </form>
            </div>
        `;
        modal.classList.add('active');
    },

    showEditModal(id) {
        const stockItem = this.currentStock.find(s => s.id === id);
        if (!stockItem) return;

        const modal = document.getElementById('stockModal');
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Editar Stock</h2>
                    <span class="close-modal" onclick="stock.closeModal()">&times;</span>
                </div>
                <form id="stockForm" onsubmit="stock.updateStock(event, '${id}')">
                    <div class="form-group">
                        <label>Lote</label>
                        <input type="text" name="batch" value="${stockItem.batch}" required>
                    </div>
                    <div class="form-group">
                        <label>Cantidad</label>
                        <input type="number" name="quantity" value="${stockItem.quantity}" min="1" required>
                    </div>
                    <div class="form-group">
                        <label>Producto</label>
                        <select name="product_id" required>
                            ${this.products.map(p => `
                                <option value="${p.id}" ${p.id === stockItem.product_id ? 'selected' : ''}>${p.name}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Ubicación</label>
                        <select name="location_id" required>
                            ${this.locations.map(l => `
                                <option value="${l.id}" ${l.id === stockItem.location_id ? 'selected' : ''}>${l.name}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Usuario</label>
                        <select name="user_id" required>
                            ${this.users.map(u => `
                                <option value="${u.id}" ${u.id === stockItem.user_id ? 'selected' : ''}>${u.name} ${u.lastname}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Fecha de Expiración</label>
                        <input type="date" name="expired_at" value="${stockItem.expired_at.split('T')[0]}" required>
                    </div>
                    <div class="form-group">
                        <label>Estado</label>
                        <select name="status" required>
                            <option value="OK" ${stockItem.status === 'OK' ? 'selected' : ''}>OK</option>
                            <option value="CRITICAL" ${stockItem.status === 'CRITICAL' ? 'selected' : ''}>CRITICAL</option>
                            <option value="EXPIRED" ${stockItem.status === 'EXPIRED' ? 'selected' : ''}>EXPIRED</option>
                            <option value="RETIRED" ${stockItem.status === 'RETIRED' ? 'selected' : ''}>RETIRED</option>
                        </select>
                    </div>
                    <button type="submit" class="btn">Actualizar</button>
                    <button type="button" class="btn btn-secondary" onclick="stock.closeModal()">Cancelar</button>
                </form>
            </div>
        `;
        modal.classList.add('active');
    },

    async saveStock(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        data.quantity = parseInt(data.quantity);

        try {
            await api.post('/stock', data);
            this.closeModal();
            utils.showAlert('Stock agregado exitosamente');
            this.render();
        } catch (error) {
            utils.showAlert('Error al agregar stock', 'error');
        }
    },

    async updateStock(event, id) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        data.quantity = parseInt(data.quantity);

        try {
            await api.put(`/stock/${id}`, data);
            this.closeModal();
            utils.showAlert('Stock actualizado exitosamente');
            this.render();
        } catch (error) {
            utils.showAlert('Error al actualizar stock', 'error');
        }
    },

    async deleteStock(id) {
        if (!confirm('¿Está seguro de eliminar este stock?')) return;

        try {
            await api.delete(`/stock/${id}`);
            utils.showAlert('Stock eliminado exitosamente');
            this.render();
        } catch (error) {
            utils.showAlert('Error al eliminar stock', 'error');
        }
    },

    closeModal() {
        document.getElementById('stockModal').classList.remove('active');
    }
};
