import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor to add JWT token
api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('afyaflow_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const authApi = {
    login: (credentials: any) => api.post('/api/auth/login', credentials),
    register: (details: any) => api.post('/api/auth/register', details),
};

export const patientApi = {
    getAll: () => api.get('/api/patients'),
    getById: (id: string | number) => api.get(`/api/patients/${id}`),
    create: (data: any) => api.post('/api/patients', data),
    updateStatus: (id: string | number, status: string) => 
        api.put(`/api/patients/${id}/status`, null, { params: { status } }),
    delete: (id: string | number) => api.delete(`/api/patients/${id}`),
};

export const departmentApi = {
    getAll: () => api.get('/api/departments'),
    create: (data: { name: string }) => api.post('/api/departments', data),
    delete: (id: number) => api.delete(`/api/departments/${id}`),
};

export const wardApi = {
    getAll: () => api.get('/api/wards'),
    create: (data: any) => api.post('/api/wards', data),
    getBeds: (wardId: number | string) => api.get(`/api/wards/${wardId}/beds`),
    updateBed: (bedId: number | string, status: string, patientId?: string, patientName?: string) => 
        api.put(`/api/wards/beds/${bedId}`, null, { params: { status, patientId, patientName } }),
};

export const doctorApi = {
    getAll: () => api.get('/api/doctors'),
};

export const appointmentApi = {
    getAll: () => api.get('/api/appointments'),
    create: (data: any) => api.post('/api/appointments', data),
};

export const auditApi = {
    getAll: () => api.get('/api/audit'),
};

export default api;
