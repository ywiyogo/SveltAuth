import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestEvent } from '@sveltejs/kit';

const BACKEND_URL = 'http://localhost:8090';

// Headers to forward from the client request to the backend
const FORWARD_REQUEST_HEADERS = [
	'authorization',
	'user-agent',
	'accept',
	'accept-language',
	'accept-encoding',
	'x-forwarded-for',
	'x-real-ip',
	'origin',
	'cookie'
];

// Headers to forward from the backend response to the client
const FORWARD_RESPONSE_HEADERS = [
	'content-type',
	'set-cookie',
	'cache-control',
	'expires',
	'last-modified',
	'etag'
];

export async function proxyToBackend(
	request: Request,
	method: string,
	endpoint: string
): Promise<Response> {
	try {
		const backendUrl = getBackendUrl();

		// Build headers to forward to backend
		const forwardHeaders: Record<string, string> = {
			'Content-Type': 'application/json'
		};

		// Add forwarded headers from original request
		for (const [key, value] of request.headers.entries()) {
			if (FORWARD_REQUEST_HEADERS.includes(key.toLowerCase())) {
				forwardHeaders[key] = value;
			}
		}

		// Prepare request body for POST/PUT/PATCH methods
		let body: string | undefined;
		if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
			try {
				const requestData = await request.json();
				body = JSON.stringify(requestData);
			} catch (error) {
				// If request has no body or invalid JSON, continue without body
				body = undefined;
			}
		}

		// Make request to backend
		const backendResponse = await fetch(`${backendUrl}${endpoint}`, {
			method: method.toUpperCase(),
			headers: forwardHeaders,
			body
		});

		// Get response data
		let responseData;
		const contentType = backendResponse.headers.get('content-type');
		const responseText = await backendResponse.text();

		if (contentType && contentType.includes('application/json')) {
			try {
				responseData = JSON.parse(responseText);
			} catch (error) {
				responseData = { error: 'Invalid JSON response from backend', body: responseText };
			}
		} else {
			// Handle non-JSON responses by trying to parse as JSON anyway
			try {
				responseData = JSON.parse(responseText);
			} catch (error) {
				responseData = {
					message: 'Non-JSON response from backend',
					body: responseText,
					contentType: contentType || 'unknown'
				};
			}
		}

		// Build response headers to forward to client
		const responseHeaders: Record<string, string> = {};
		for (const [key, value] of backendResponse.headers.entries()) {
			if (FORWARD_RESPONSE_HEADERS.includes(key.toLowerCase())) {
				responseHeaders[key] = value;
			}
		}

		// Return response with same status code and forwarded headers
		return json(responseData, {
			status: backendResponse.status,
			headers: responseHeaders
		});
	} catch (error) {
		console.error(`Error proxying ${method} ${endpoint}:`, error);

		// Check if it's a network error (backend unavailable)
		if (error instanceof TypeError && error.message.includes('fetch')) {
			return json({ error: 'Backend service unavailable' }, { status: 503 });
		}

		// Generic server error
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}

// Convenience function for common request event handling
export async function handleApiRequest(event: RequestEvent, endpoint: string): Promise<Response> {
	const method = event.request.method;
	return proxyToBackend(event.request, method, endpoint);
}

// Environment-based backend URL (for future flexibility)
export function getBackendUrl(): string {
	return env.BACKEND_URL || BACKEND_URL;
}
