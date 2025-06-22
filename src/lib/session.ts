import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

export interface User {
	id: string;
	email: string;
	name?: string;
	avatar?: string;
	role?: string;
	permissions?: string[];
	createdAt?: string;
	lastLoginAt?: string;
	twoFactorEnabled?: boolean;
}

export interface Session {
	token: string;
	refreshToken?: string;
	csrf: string;
	user: User;
	expiresAt?: number;
	issuedAt?: number;
}

// Create the session store
function createSessionStore() {
	const { subscribe, set, update } = writable<Session | null>(null);

	return {
		subscribe,
		set,
		update,

		// Initialize session from localStorage
		init: () => {
			if (!browser) return;

			try {
				const stored = localStorage.getItem('session');
				if (stored) {
					const session: Session = JSON.parse(stored);

					// Check if session is expired
					if (session.expiresAt && Date.now() > session.expiresAt) {
						sessionStore.clear();
						return;
					}

					set(session);
				}
			} catch (error) {
				console.error('Failed to load session from localStorage:', error);
				sessionStore.clear();
			}
		},

		// Set session and persist to localStorage
		setSession: (session: Session) => {
			set(session);
			if (browser) {
				try {
					localStorage.setItem('session', JSON.stringify(session));
				} catch (error) {
					console.error('Failed to save session to localStorage:', error);
				}
			}
		},

		// Update session and persist changes
		updateSession: (updater: (session: Session | null) => Session | null) => {
			update((current) => {
				const updated = updater(current);
				if (updated && browser) {
					try {
						localStorage.setItem('session', JSON.stringify(updated));
					} catch (error) {
						console.error('Failed to update session in localStorage:', error);
					}
				}
				return updated;
			});
		},

		// Clear session
		clear: () => {
			set(null);
			if (browser) {
				localStorage.removeItem('session');
				localStorage.removeItem('session_token');
			}
		},

		// Check if user has permission
		hasPermission: (permission: string) => {
			return derived({ subscribe }, ($session) => {
				if (!$session?.user?.permissions) return false;
				return $session.user.permissions.includes(permission);
			});
		},

		// Check if user has role
		hasRole: (role: string) => {
			return derived({ subscribe }, ($session) => {
				if (!$session?.user?.role) return false;
				return $session.user.role === role;
			});
		},

		// Get user info
		getUser: () => {
			return derived({ subscribe }, ($session) => $session?.user || null);
		},

		// Check if session is valid
		isValid: () => {
			return derived({ subscribe }, ($session) => {
				if (!$session) return false;
				if ($session.expiresAt && Date.now() > $session.expiresAt) {
					return false;
				}
				return true;
			});
		},

		// Check if session is expiring soon (within 5 minutes)
		isExpiringSoon: () => {
			return derived({ subscribe }, ($session) => {
				if (!$session?.expiresAt) return false;
				const fiveMinutes = 5 * 60 * 1000;
				return Date.now() > $session.expiresAt - fiveMinutes;
			});
		}
	};
}

export const sessionStore = createSessionStore();

// Legacy export for backward compatibility
export const session = sessionStore;

// Derived stores for common use cases
export const isAuthenticated = derived(sessionStore, ($session) => $session !== null);

export const currentUser = derived(sessionStore, ($session) => $session?.user || null);

export const userPermissions = derived(
	sessionStore,
	($session) => $session?.user?.permissions || []
);

export const userRole = derived(sessionStore, ($session) => $session?.user?.role || null);

// Utility functions
export function getSessionToken(): string | null {
	if (!browser) return null;

	// Try to get from current session first
	let token: string | null = null;
	sessionStore.subscribe((session) => {
		token = session?.token || null;
	})();

	// Fallback to localStorage for backward compatibility
	if (!token) {
		token = localStorage.getItem('session_token');
	}

	return token;
}

export function isSessionExpired(session: Session | null): boolean {
	if (!session) return true;
	if (!session.expiresAt) return false;
	return Date.now() > session.expiresAt;
}

export function getTimeUntilExpiry(session: Session | null): number {
	if (!session?.expiresAt) return 0;
	return Math.max(0, session.expiresAt - Date.now());
}

export function formatTimeUntilExpiry(session: Session | null): string {
	const timeLeft = getTimeUntilExpiry(session);
	if (timeLeft === 0) return 'Expired';

	const minutes = Math.floor(timeLeft / (1000 * 60));
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (days > 0) return `${days}d ${hours % 24}h`;
	if (hours > 0) return `${hours}h ${minutes % 60}m`;
	return `${minutes}m`;
}

// Initialize session on import
if (browser) {
	sessionStore.init();
}
