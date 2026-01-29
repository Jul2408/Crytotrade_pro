const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const getHeaders = (endpoint?: string) => {
    const headers: any = {
        'Content-Type': 'application/json',
    };
    if (typeof window !== 'undefined' && endpoint !== '/login/') {
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Token ${token}`;
        }
    }
    return headers;
};

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        let errorMessage = 'API request failed';
        try {
            const errorData = await response.json();
            // Handle DRF validation errors which are often objects { field: [errors] }
            if (typeof errorData === 'object' && errorData !== null) {
                if (errorData.message) errorMessage = errorData.message;
                else if (errorData.error) errorMessage = errorData.error;
                else if (errorData.detail) errorMessage = errorData.detail;
                else {
                    // Collect all field errors
                    const fields = Object.keys(errorData);
                    if (fields.length > 0) {
                        const firstField = fields[0];
                        const firstError = Array.isArray(errorData[firstField]) ? errorData[firstField][0] : errorData[firstField];
                        errorMessage = `${firstField === 'non_field_errors' ? '' : firstField + ': '}${firstError}`;
                    }
                }
            }
        } catch (e) {
            errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
    }
    return response.json();
};

export const api = {
    async post(endpoint: string, data: any) {
        console.log(`POST request to ${endpoint}`, data);
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: getHeaders(endpoint),
            body: JSON.stringify(data),
        });
        console.log(`Response status: ${response.status}`);
        return handleResponse(response);
    },

    async patch(endpoint: string, data: any) {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'PATCH',
            headers: getHeaders(endpoint),
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    async get(endpoint: string) {
        const response = await fetch(`${API_URL}${endpoint}`, {
            headers: getHeaders(endpoint),
        });
        return handleResponse(response);
    },

    async delete(endpoint: string) {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'DELETE',
            headers: getHeaders(endpoint),
        });
        if (!response.ok) return handleResponse(response);
        return response.status === 204 ? null : response.json();
    }
};
