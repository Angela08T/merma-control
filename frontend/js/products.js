const products = {
    currentProducts: [],
    currentCategories: [],

    async render() {
        const content = document.getElementById('content');
        content.innerHTML = utils.showLoading();

        try {
            const [productsData, categoriesData] = await Promise.all([
                api.get('/product'),
                api.get('/category')
            ]);

            this.currentProducts = productsData;
            this.currentCategories = categoriesData;

            content.innerHTML = `
                <h2 class="page-title">Gestión de Productos</h2>

                <div class="actions">
                    <input type="text" id="searchProduct" class="search-box" placeholder="Buscar por nombre o código de barras...">
                    <button class="btn" onclick="products.showAddModal()">Agregar Producto</button>
                </div>

                <div class="card">
                    <div id="productsTable">${this.renderTable()}</div>
                </div>

                <div id="productModal" class="modal"></div>
            `;

            document.getElementById('searchProduct').addEventListener('input', (e) => {
                this.filterProducts(e.target.value);
            });
        } catch (error) {
            content.innerHTML = '<div class="alert alert-error">Error al cargar productos</div>';
        }
    },

    renderTable() {
        if (this.currentProducts.length === 0) {
            return utils.showEmpty('No hay productos registrados');
        }

        return `
            <table>
                <thead>
                    <tr>
                        <th>Código de Barras</th>
                        <th>Nombre</th>
                        <th>Categoría</th>
                        <th>Fecha de Creación</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.currentProducts.map(product => `
                        <tr>
                            <td>${product.barcode}</td>
                            <td>${product.name}</td>
                            <td>${this.getCategoryName(product.category_id)}</td>
                            <td>${utils.formatDate(product.created_at)}</td>
                            <td>
                                <button class="btn btn-small btn-secondary" onclick="products.showEditModal('${product.id}')">Editar</button>
                                <button class="btn btn-small btn-secondary" onclick="products.deleteProduct('${product.id}')">Eliminar</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    },

    getCategoryName(categoryId) {
        const category = this.currentCategories.find(c => c.id === categoryId);
        return category ? category.name : 'N/A';
    },

    filterProducts(searchTerm) {
        if (!searchTerm) {
            this.render();
            return;
        }

        const filtered = this.currentProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.barcode.includes(searchTerm)
        );

        const temp = this.currentProducts;
        this.currentProducts = filtered;
        document.getElementById('productsTable').innerHTML = this.renderTable();
        this.currentProducts = temp;
    },

    showAddModal() {
        const modal = document.getElementById('productModal');
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Agregar Producto</h2>
                    <span class="close-modal" onclick="products.closeModal()">&times;</span>
                </div>
                <form id="productForm" onsubmit="products.saveProduct(event)">
                    <div class="form-group">
                        <label>Código de Barras</label>
                        <input type="text" name="barcode" required>
                    </div>
                    <div class="form-group">
                        <label>Nombre</label>
                        <input type="text" name="name" required>
                    </div>
                    <div class="form-group">
                        <label>Categoría</label>
                        <select name="category_id" required>
                            <option value="">Seleccionar categoría</option>
                            ${this.currentCategories.map(cat => `
                                <option value="${cat.id}">${cat.name}</option>
                            `).join('')}
                        </select>
                    </div>
                    <button type="submit" class="btn">Guardar</button>
                    <button type="button" class="btn btn-secondary" onclick="products.closeModal()">Cancelar</button>
                </form>
            </div>
        `;
        modal.classList.add('active');
    },

    showEditModal(id) {
        const product = this.currentProducts.find(p => p.id === id);
        if (!product) return;

        const modal = document.getElementById('productModal');
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Editar Producto</h2>
                    <span class="close-modal" onclick="products.closeModal()">&times;</span>
                </div>
                <form id="productForm" onsubmit="products.updateProduct(event, '${id}')">
                    <div class="form-group">
                        <label>Código de Barras</label>
                        <input type="text" name="barcode" value="${product.barcode}" required>
                    </div>
                    <div class="form-group">
                        <label>Nombre</label>
                        <input type="text" name="name" value="${product.name}" required>
                    </div>
                    <div class="form-group">
                        <label>Categoría</label>
                        <select name="category_id" required>
                            ${this.currentCategories.map(cat => `
                                <option value="${cat.id}" ${cat.id === product.category_id ? 'selected' : ''}>${cat.name}</option>
                            `).join('')}
                        </select>
                    </div>
                    <button type="submit" class="btn">Actualizar</button>
                    <button type="button" class="btn btn-secondary" onclick="products.closeModal()">Cancelar</button>
                </form>
            </div>
        `;
        modal.classList.add('active');
    },

    async saveProduct(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);

        try {
            await api.post('/product', data);
            this.closeModal();
            utils.showAlert('Producto agregado exitosamente');
            this.render();
        } catch (error) {
            utils.showAlert('Error al agregar producto', 'error');
        }
    },

    async updateProduct(event, id) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);

        try {
            await api.put(`/product/${id}`, data);
            this.closeModal();
            utils.showAlert('Producto actualizado exitosamente');
            this.render();
        } catch (error) {
            utils.showAlert('Error al actualizar producto', 'error');
        }
    },

    async deleteProduct(id) {
        if (!confirm('¿Está seguro de eliminar este producto?')) return;

        try {
            await api.delete(`/product/${id}`);
            utils.showAlert('Producto eliminado exitosamente');
            this.render();
        } catch (error) {
            utils.showAlert('Error al eliminar producto', 'error');
        }
    },

    closeModal() {
        document.getElementById('productModal').classList.remove('active');
    }
};
