const getBaseUrl = () => {
    // If we are on localhost, we probably want to use the local API
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    }

    // For everything else (Vercel, Phone via IP, etc.), use the production API
    // This solves issues where .env.local on PC might point to localhost 
    // but the phone needs the real server.
    return 'https://crytotrade-pro-r1gs.onrender.com/api';
};

const API_URL = getBaseUrl();

const getHeaders = (endpoint?: string) => {
    const headers: any = {
        'Content-Type': 'application/json',
    };
    if (typeof window !== 'undefined' && endpoint !== '/login/' && endpoint !== '/register/') {
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
            if (typeof errorData === 'object' && errorData !== null) {
                if (errorData.message) errorMessage = errorData.message;
                else if (errorData.error) errorMessage = errorData.error;
                else if (errorData.detail) errorMessage = errorData.detail;
                else {
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
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: getHeaders(endpoint),
                body: JSON.stringify(data),
            });
            console.log(`Response status: ${response.status}`);
            return handleResponse(response);
        } catch (err: any) {
            console.error('Fetch error:', err);
            if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
                throw new Error("Impossible de contacter le serveur. Vérifiez votre connexion ou l'URL de l'API.");
            }
            throw err;
        }
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
