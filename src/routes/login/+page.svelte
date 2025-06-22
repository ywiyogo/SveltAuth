<script lang="ts">
	import { post } from '$lib/api';
	import { goto } from '$app/navigation';
	import { sessionStore } from '$lib/session';

	let email = '';
	let password = '';
	let error = '';
	let loading = false;

	async function login() {
		if (!email || !password) {
			error = 'Please fill in all fields';
			return;
		}

		loading = true;
		error = '';

		try {
			const res = await post('/login', { email, password });
			localStorage.setItem('session_token', res.session_token);
			// Update session store with the full session data
			sessionStore.setSession({
				token: res.session_token,
				csrf: res.csrf_token,
				user: res.user,
				expiresAt: new Date(res.expires_at).getTime()
			});
			if (res.requires_otp == "true") {
				goto('/verify-otp');
			} else {
				// Redirect to dashboard or home page
				goto('/dashboard');
			}
		} catch (e: unknown) {
			if (e instanceof Error) {
				error = e.message;
			} else {
				error = 'An unexpected error occurred';
			}
		} finally {
			loading = false;
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			login();
		}
	}
</script>

<svelte:head>
	<title>Login - SveltAuth</title>
</svelte:head>

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4"
>
	<div class="w-full max-w-md space-y-8">
		<div class="text-center">
			<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600">
				<svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
					/>
				</svg>
			</div>
			<h2 class="mt-6 text-3xl font-bold text-gray-900">Welcome back</h2>
			<p class="mt-2 text-sm text-gray-600">
				Don't have an account?
				<a
					href="/register"
					class="font-medium text-indigo-600 transition-colors hover:text-indigo-500"
				>
					Sign up here
				</a>
			</p>
		</div>

		<div class="rounded-2xl border border-gray-100 bg-white px-6 py-8 shadow-xl">
			<form on:submit|preventDefault={login} class="space-y-6">
				<div>
					<label for="email" class="mb-2 block text-sm font-medium text-gray-700">
						Email address
					</label>
					<input
						id="email"
						name="email"
						type="email"
						autocomplete="email"
						required
						bind:value={email}
						on:keydown={handleKeydown}
						class="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
						placeholder="Enter your email"
						disabled={loading}
					/>
				</div>

				<div>
					<label for="password" class="mb-2 block text-sm font-medium text-gray-700">
						Password
					</label>
					<input
						id="password"
						name="password"
						type="password"
						autocomplete="current-password"
						required
						bind:value={password}
						on:keydown={handleKeydown}
						class="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
						placeholder="Enter your password"
						disabled={loading}
					/>
				</div>

				<div class="flex items-center justify-between">
					<div class="flex items-center">
						<input
							id="remember-me"
							name="remember-me"
							type="checkbox"
							class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
						/>
						<label for="remember-me" class="ml-2 block text-sm text-gray-700"> Remember me </label>
					</div>

					<div class="text-sm">
						<a
							href="/forgot-password"
							class="font-medium text-indigo-600 transition-colors hover:text-indigo-500"
						>
							Forgot password?
						</a>
					</div>
				</div>

				{#if error}
					<div class="rounded-xl border border-red-200 bg-red-50 p-4">
						<div class="flex">
							<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
									clip-rule="evenodd"
								/>
							</svg>
							<p class="ml-2 text-sm text-red-700">{error}</p>
						</div>
					</div>
				{/if}

				<button
					type="submit"
					disabled={loading}
					class="flex w-full justify-center rounded-xl border border-transparent bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
				>
					{#if loading}
						<svg
							class="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
						Signing in...
					{:else}
						Sign in
					{/if}
				</button>
			</form>

			<div class="mt-6">
				<div class="relative">
					<div class="absolute inset-0 flex items-center">
						<div class="w-full border-t border-gray-300" />
					</div>
					<div class="relative flex justify-center text-sm">
						<span class="bg-white px-2 text-gray-500">Or continue with</span>
					</div>
				</div>

				<div class="mt-6 grid grid-cols-2 gap-3">
					<button
						type="button"
						class="inline-flex w-full justify-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 shadow-sm transition-colors hover:bg-gray-50"
					>
						<svg class="h-5 w-5" viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							/>
							<path
								fill="currentColor"
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							/>
							<path
								fill="currentColor"
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
							/>
							<path
								fill="currentColor"
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							/>
						</svg>
						<span class="ml-2">Google</span>
					</button>

					<button
						type="button"
						class="inline-flex w-full justify-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 shadow-sm transition-colors hover:bg-gray-50"
					>
						<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
							<path
								d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
							/>
						</svg>
						<span class="ml-2">Facebook</span>
					</button>
				</div>
			</div>
		</div>

		<div class="text-center">
			<p class="text-xs text-gray-500">
				By signing in, you agree to our
				<a href="/terms" class="text-indigo-600 hover:text-indigo-500">Terms of Service</a>
				and
				<a href="/privacy" class="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
			</p>
		</div>
	</div>
</div>
