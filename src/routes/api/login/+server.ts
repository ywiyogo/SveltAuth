import type { RequestHandler } from './$types';
import { handleApiRequest } from '$lib/api-proxy';

export const POST: RequestHandler = async (event) => {
	return handleApiRequest(event, '/login');
};
