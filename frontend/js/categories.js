const categories = {
    currentCategories: [],

    async render() {
        const content = document.getElementById('content');
        content.innerHTML = utils.showLoading();

        try {
            const categoriesData = await api.get('/category');
            this.currentCategories = categoriesData;

            content.innerHTML = `
                <h2 class="page-title">Gestión de Categorías</h2>

                <div class="actions">
                    <input type="text" id="searchCategory" class="search-box" placeholder="Buscar categoría...">
                    <button class="btn" onclick="categories.showAddModal()">Agregar Categoría</button>
                </div>

                <div class="card">
                    <div id="categoriesTable">${this.renderTable()}</div>
                </div>

                <div id="categoryModal" class="modal"></div>
            `;

            document.getElementById('searchCategory').addEventListener('input', (e) => {
                this.filterCategories(e.target.value);
            });
        } catch (error) {
            content.innerHTML = '<div class="alert alert-error">Error al cargar categorías</div>';
        }
    },

    renderTable() {
        if (this.currentCategories.length === 0) {
            return utils.showEmpty('No hay categorías registradas');
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
                    ${this.currentCategories.map(category => `
                        <tr>
                            <td>${category.name}</td>
                            <td>${utils.formatDate(category.created_at)}</td>
                            <td>
                                <button class="btn btn-small btn-secondary" onclick="categories.showEditModal('${category.id}')">Editar</button>
                                <button class="btn btn-small btn-secondary" onclick="categories.deleteCategory('${category.id}')">Eliminar</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    },

    filterCategories(searchTerm) {
        if (!searchTerm) {
            this.render();
            return;
        }

        const filtered = this.currentCategories.filter(category =>
            category.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const temp = this.currentCategories;
        this.currentCategories = filtered;
        document.getElementById('categoriesTable').innerHTML = this.renderTable();
        this.currentCategories = temp;
    },

    showAddModal() {
        const modal = document.getElementById('categoryModal');
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Agregar Categoría</h2>
                    <span class="close-modal" onclick="categories.closeModal()">&times;</span>
                </div>
                <form id="categoryForm" onsubmit="categories.saveCategory(event)">
                    <div class="form-group">
                        <label>Nombre</label>
                        <input type="text" name="name" required>
                    </div>
                    <button type="submit" class="btn">Guardar</button>
                    <button type="button" class="btn btn-secondary" onclick="categories.closeModal()">Cancelar</button>
                </form>
            </div>
        `;
        modal.classList.add('active');
    },

    showEditModal(id) {
        const category = this.currentCategories.find(c => c.id === id);
        if (!category) return;

        const modal = document.getElementById('categoryModal');
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Editar Categoría</h2>
                    <span class="close-modal" onclick="categories.closeModal()">&times;</span>
                </div>
                <form id="categoryForm" onsubmit="categories.updateCategory(event, '${id}')">
                    <div class="form-group">
                        <label>Nombre</label>
                        <input type="text" name="name" value="${category.name}" required>
                    </div>
                    <button type="submit" class="btn">Actualizar</button>
                    <button type="button" class="btn btn-secondary" onclick="categories.closeModal()">Cancelar</button>
                </form>
            </div>
        `;
        modal.classList.add('active');
    },

    async saveCategory(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);

        try {
            await api.post('/category', data);
            this.closeModal();
            utils.showAlert('Categoría agregada exitosamente');
            this.render();
        } catch (error) {
            utils.showAlert('Error al agregar categoría', 'error');
        }
    },

    async updateCategory(event, id) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);

        try {
            await api.put(`/category/${id}`, data);
            this.closeModal();
            utils.showAlert('Categoría actualizada exitosamente');
            this.render();
        } catch (error) {
            utils.showAlert('Error al actualizar categoría', 'error');
        }
    },

    async deleteCategory(id) {
        if (!confirm('¿Está seguro de eliminar esta categoría?')) return;

        try {
            await api.delete(`/category/${id}`);
            utils.showAlert('Categoría eliminada exitosamente');
            this.render();
        } catch (error) {
            utils.showAlert('Error al eliminar categoría', 'error');
        }
    },

    closeModal() {
        document.getElementById('categoryModal').classList.remove('active');
    }
};
