import { Adapter } from 'authjs';

export class DjangoAdapter implements Adapter {
    async createUser(user) {
        const response = await fetch('/api/users/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });
        return response.json();
    }

    async getUser(id) {
        const response = await fetch(`/api/users/${id}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    }

    async updateUser(id, user) {
        const response = await fetch(`/api/users/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });
        return response.json();
    }

    async deleteUser(id) {
        const response = await fetch(`/api/users/${id}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.ok;
    }
}
