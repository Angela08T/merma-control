const users = {
    currentUsers: [],

    async render() {
        const content = document.getElementById('content');
        content.innerHTML = utils.showLoading();

        try {
            const usersData = await api.get('/user');
            this.currentUsers = usersData;

            content.innerHTML = `
                <h2 class="page-title">Gestión de Usuarios</h2>

                <div class="actions">
                    <input type="text" id="searchUser" class="search-box" placeholder="Buscar por nombre o DNI...">
                    <button class="btn" onclick="users.showAddModal()">Agregar Usuario</button>
                </div>

                <div class="card">
                    <div id="usersTable">${this.renderTable()}</div>
                </div>

                <div id="userModal" class="modal"></div>
            `;

            document.getElementById('searchUser').addEventListener('input', (e) => {
                this.filterUsers(e.target.value);
            });
        } catch (error) {
            content.innerHTML = '<div class="alert alert-error">Error al cargar usuarios</div>';
        }
    },

    renderTable() {
        if (this.currentUsers.length === 0) {
            return utils.showEmpty('No hay usuarios registrados');
        }

        return `
            <table>
                <thead>
                    <tr>
                        <th>DNI</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Teléfono</th>
                        <th>Rol</th>
                        <th>Fecha de Registro</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.currentUsers.map(user => `
                        <tr>
                            <td>${user.dni}</td>
                            <td>${user.name}</td>
                            <td>${user.lastname}</td>
                            <td>${user.phone || 'N/A'}</td>
                            <td>${utils.getRolBadge(user.rol)}</td>
                            <td>${utils.formatDate(user.created_at)}</td>
                            <td>
                                <button class="btn btn-small btn-secondary" onclick="users.showEditModal('${user.id}')">Editar</button>
                                <button class="btn btn-small btn-secondary" onclick="users.deleteUser('${user.id}')">Eliminar</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    },

    filterUsers(searchTerm) {
        if (!searchTerm) {
            this.render();
            return;
        }

        const filtered = this.currentUsers.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.dni.includes(searchTerm)
        );

        const temp = this.currentUsers;
        this.currentUsers = filtered;
        document.getElementById('usersTable').innerHTML = this.renderTable();
        this.currentUsers = temp;
    },

    showAddModal() {
        const modal = document.getElementById('userModal');
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Agregar Usuario</h2>
                    <span class="close-modal" onclick="users.closeModal()">&times;</span>
                </div>
                <form id="userForm" onsubmit="users.saveUser(event)">
                    <div class="form-group">
                        <label>DNI</label>
                        <input type="text" name="dni" maxlength="8" required>
                    </div>
                    <div class="form-group">
                        <label>Nombre</label>
                        <input type="text" name="name" required>
                    </div>
                    <div class="form-group">
                        <label>Apellido</label>
                        <input type="text" name="lastname" required>
                    </div>
                    <div class="form-group">
                        <label>Teléfono (opcional)</label>
                        <input type="tel" name="phone">
                    </div>
                    <div class="form-group">
                        <label>Rol</label>
                        <select name="rol" required>
                            <option value="">Seleccionar rol</option>
                            <option value="ADMINISTRATOR">Administrador</option>
                            <option value="SUPERVISOR">Supervisor</option>
                        </select>
                    </div>
                    <button type="submit" class="btn">Guardar</button>
                    <button type="button" class="btn btn-secondary" onclick="users.closeModal()">Cancelar</button>
                </form>
            </div>
        `;
        modal.classList.add('active');
    },

    showEditModal(id) {
        const user = this.currentUsers.find(u => u.id === id);
        if (!user) return;

        const modal = document.getElementById('userModal');
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Editar Usuario</h2>
                    <span class="close-modal" onclick="users.closeModal()">&times;</span>
                </div>
                <form id="userForm" onsubmit="users.updateUser(event, '${id}')">
                    <div class="form-group">
                        <label>DNI</label>
                        <input type="text" name="dni" value="${user.dni}" maxlength="8" required>
                    </div>
                    <div class="form-group">
                        <label>Nombre</label>
                        <input type="text" name="name" value="${user.name}" required>
                    </div>
                    <div class="form-group">
                        <label>Apellido</label>
                        <input type="text" name="lastname" value="${user.lastname}" required>
                    </div>
                    <div class="form-group">
                        <label>Teléfono (opcional)</label>
                        <input type="tel" name="phone" value="${user.phone || ''}">
                    </div>
                    <div class="form-group">
                        <label>Rol</label>
                        <select name="rol" required>
                            <option value="ADMINISTRATOR" ${user.rol === 'ADMINISTRATOR' ? 'selected' : ''}>Administrador</option>
                            <option value="SUPERVISOR" ${user.rol === 'SUPERVISOR' ? 'selected' : ''}>Supervisor</option>
                        </select>
                    </div>
                    <button type="submit" class="btn">Actualizar</button>
                    <button type="button" class="btn btn-secondary" onclick="users.closeModal()">Cancelar</button>
                </form>
            </div>
        `;
        modal.classList.add('active');
    },

    async saveUser(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);

        if (!data.phone) delete data.phone;

        try {
            await api.post('/user', data);
            this.closeModal();
            utils.showAlert('Usuario agregado exitosamente');
            this.render();
        } catch (error) {
            utils.showAlert('Error al agregar usuario', 'error');
        }
    },

    async updateUser(event, id) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);

        if (!data.phone) delete data.phone;

        try {
            await api.put(`/user/${id}`, data);
            this.closeModal();
            utils.showAlert('Usuario actualizado exitosamente');
            this.render();
        } catch (error) {
            utils.showAlert('Error al actualizar usuario', 'error');
        }
    },

    async deleteUser(id) {
        if (!confirm('¿Está seguro de eliminar este usuario?')) return;

        try {
            await api.delete(`/user/${id}`);
            utils.showAlert('Usuario eliminado exitosamente');
            this.render();
        } catch (error) {
            utils.showAlert('Error al eliminar usuario', 'error');
        }
    },

    closeModal() {
        document.getElementById('userModal').classList.remove('active');
    }
};
