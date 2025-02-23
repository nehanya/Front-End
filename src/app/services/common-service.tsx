import store from 'store';
import { toast } from 'react-toastify';

export default class CommonService {
	baseURL: string;

	constructor() {
		this.baseURL = process.env.NEXT_PUBLIC_BASE_URL || '';
	}

	async request(endpoint: string, method: string, params?: any) {
    console.log('common-service', params, endpoint );
    
		const headers: Record<string, string> = {
			'Authorization': `Bearer ${store.get(process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY || 'bIESIcKeg42Wb9')}`
		};

		// if (!(params instanceof FormData)) {
			headers['Content-Type'] = 'application/json';
		// }

		const config: RequestInit = { method, headers };

		// If it's not a GET request, add the body
		if (method !== 'GET' && params) {
			config.body = params instanceof FormData ? params : JSON.stringify(params);
		}

		try {
			const response = await fetch(`${this.baseURL}/${endpoint}`, config);
			const data = await response.json();

			if (response.status === 401) {
				toast.error(data.message,
					{
						autoClose: 3000,
					}
				);
				store.clearAll()
				window.location.replace('/auth/login');
			} else if (data.error === false) {
				toast.success(data.message, {
					autoClose: 3000,
				})
			} else if (data.error === true) {
				toast.error(data.message,
					{
						autoClose: 3000,
					}
				);
				if (data.message === 'Invalid token') {
					store.clearAll()
					window.location.replace('/auth/login');
				}
			}

			return data;
		} catch (error: any) {
			if (error.message === 'Invalid token') {
				store.clearAll();
				window.location.replace('/auth/login');
			}
			return error;
		}
	}

	async get(endpoint: string) {
		return await this.request(endpoint, 'GET');
	}

	async post(endpoint: string, params = {}) {
		return await this.request(endpoint, 'POST', params);
	}

	async put(endpoint: string, params = {}) {
		return await this.request(endpoint, 'PUT', params);
	}

	async delete(endpoint: string) {
		return await this.request(endpoint, 'DELETE');
	}
}
