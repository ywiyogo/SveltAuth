const API_BASE = '/api';

export interface ApiError {
	message: string;
	code?: string;
	status?: number;
}

export class ApiException extends Error {
	public readonly code?: string;
	public readonly status?: number;

	constructor(message: string, code?: string, status?: number) {
		super(message);
		this.name = 'ApiException';
		this.code = code;
		this.status = status;
	}
}

function getAuthHeaders(): Record<string, string> {
	const token = localStorage.getItem('session_token');
	const headers: Record<string, string> = {
		'Content-Type': 'application/json'
	};

	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new ApiException(
			errorData.message || `Request failed with status ${response.status}`,
			errorData.code,
			response.status
		);
	}

	const contentType = response.headers.get('content-type');
	if (contentType && contentType.includes('application/json')) {
		return await response.json();
	}

	return {} as T;
}

export async function get<T = any>(path: string): Promise<T> {
	const response = await fetch(`${API_BASE}${path}`, {
		method: 'GET',
		headers: getAuthHeaders()
	});

	return handleResponse<T>(response);
}

export async function post<T = any>(path: string, data: unknown): Promise<T> {
	const response = await fetch(`${API_BASE}${path}`, {
		method: 'POST',
		headers: getAuthHeaders(),
		body: JSON.stringify(data)
	});

	return handleResponse<T>(response);
}

export async function put<T = any>(path: string, data: unknown): Promise<T> {
	const response = await fetch(`${API_BASE}${path}`, {
		method: 'PUT',
		headers: getAuthHeaders(),
		body: JSON.stringify(data)
	});

	return handleResponse<T>(response);
}

export async function del<T = any>(path: string): Promise<T> {
	const response = await fetch(`${API_BASE}${path}`, {
		method: 'DELETE',
		headers: getAuthHeaders()
	});

	return handleResponse<T>(response);
}

export async function patch<T = any>(path: string, data: unknown): Promise<T> {
	const response = await fetch(`${API_BASE}${path}`, {
		method: 'PATCH',
		headers: getAuthHeaders(),
		body: JSON.stringify(data)
	});

	return handleResponse<T>(response);
}

// Auth-specific API calls
export const auth = {
	async login(email: string, password: string) {
		return post('/auth/login', { email, password });
	},

	async register(email: string, password: string) {
		return post('/auth/register', { email, password });
	},

	async verifyOtp(otp: string) {
		return post('/auth/verify-otp', { otp });
	},

	async resendOtp() {
		return post('/auth/resend-otp', {});
	},

	async logout() {
		return post('/auth/logout', {});
	},

	async refreshToken() {
		return post('/auth/refresh', {});
	},

	async forgotPassword(email: string) {
		return post('/auth/forgot-password', { email });
	},

	async resetPassword(token: string, password: string) {
		return post('/auth/reset-password', { token, password });
	}
};

// User-specific API calls
export const user = {
	async getProfile() {
		return get('/user/profile');
	},

	async updateProfile(data: { name?: string; email?: string }) {
		return put('/user/profile', data);
	},

	async changePassword(currentPassword: string, newPassword: string) {
		return post('/user/change-password', { currentPassword, newPassword });
	},

	async enable2FA() {
		return post('/user/enable-2fa', {});
	},

	async disable2FA() {
		return post('/user/disable-2fa', {});
	}
};

// Admin-specific API calls
export const admin = {
	async getUsers(page = 1, limit = 10) {
		return get(`/admin/users?page=${page}&limit=${limit}`);
	},

	async getUser(userId: string) {
		return get(`/admin/users/${userId}`);
	},

	async updateUser(userId: string, data: any) {
		return put(`/admin/users/${userId}`, data);
	},

	async deleteUser(userId: string) {
		return del(`/admin/users/${userId}`);
	},

	async getStats() {
		return get('/admin/stats');
	}
};
