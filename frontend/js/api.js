const API_URL = 'http://localhost:3000/api';

const api = {
    async get(endpoint) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`);
            if (!response.ok) throw new Error('Error en la solicitud');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async post(endpoint, data) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Error en la solicitud');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async put(endpoint, data) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Error en la solicitud');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async delete(endpoint) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Error en la solicitud');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
};
