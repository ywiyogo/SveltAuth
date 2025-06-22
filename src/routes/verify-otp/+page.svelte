<script lang="ts">
	import { post } from '$lib/api';
	import { session } from '$lib/session';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let otpDigits = ['', '', '', '', '', ''];
	let error = '';
	let loading = false;
	let resendLoading = false;
	let resendTimer = 0;
	let resendInterval: NodeJS.Timeout;
	let otpInputs: HTMLInputElement[] = [];

	onMount(() => {
		// Auto-focus first input
		if (otpInputs[0]) {
			otpInputs[0].focus();
		}

		// Start resend timer
		startResendTimer();

		return () => {
			if (resendInterval) {
				clearInterval(resendInterval);
			}
		};
	});

	function startResendTimer() {
		resendTimer = 60;
		resendInterval = setInterval(() => {
			resendTimer--;
			if (resendTimer <= 0) {
				clearInterval(resendInterval);
			}
		}, 1000);
	}

	function handleInput(index: number, event: Event) {
		const target = event.target as HTMLInputElement;
		const value = target.value.replace(/[^0-9]/g, '');

		if (value.length > 1) {
			// Handle paste or multiple characters
			const digits = value.slice(0, 6).split('');
			digits.forEach((digit, i) => {
				if (index + i < otpDigits.length) {
					otpDigits[index + i] = digit;
				}
			});

			// Focus the next empty input or the last one
			const nextIndex = Math.min(index + digits.length, otpDigits.length - 1);
			if (otpInputs[nextIndex]) {
				otpInputs[nextIndex].focus();
			}
		} else {
			otpDigits[index] = value;

			// Auto-advance to next input
			if (value && index < otpDigits.length - 1) {
				otpInputs[index + 1].focus();
			}
		}

		// Auto-submit when all digits are filled
		if (otpDigits.every((digit) => digit !== '')) {
			verify();
		}
	}

	function handleKeydown(index: number, event: KeyboardEvent) {
		if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
			// Move to previous input on backspace
			otpInputs[index - 1].focus();
		} else if (event.key === 'ArrowLeft' && index > 0) {
			otpInputs[index - 1].focus();
		} else if (event.key === 'ArrowRight' && index < otpDigits.length - 1) {
			otpInputs[index + 1].focus();
		} else if (event.key === 'Enter') {
			verify();
		}
	}

	async function verify() {
		const otp = otpDigits.join('');

		if (otp.length !== 6) {
			error = 'Please enter all 6 digits';
			return;
		}

		loading = true;
		error = '';

		try {
			const res = await post('/verify-otp', { otp });
			session.set({
				token: res.session_token,
				csrf: res.csrf_token,
				user: res.user
			});
			goto('/dashboard');
		} catch (e: unknown) {
			if (e instanceof Error) {
				error = e.message;
			} else {
				error = 'An unexpected error occurred';
			}
			// Clear OTP on error
			otpDigits = ['', '', '', '', '', ''];
			if (otpInputs[0]) {
				otpInputs[0].focus();
			}
		} finally {
			loading = false;
		}
	}

	async function resendOTP() {
		if (resendTimer > 0) return;

		resendLoading = true;
		error = '';

		try {
			await post('/resend-otp', {});
			startResendTimer();
			// Clear current OTP
			otpDigits = ['', '', '', '', '', ''];
			if (otpInputs[0]) {
				otpInputs[0].focus();
			}
		} catch (e: unknown) {
			if (e instanceof Error) {
				error = e.message;
			} else {
				error = 'Failed to resend OTP';
			}
		} finally {
			resendLoading = false;
		}
	}

	function clearOTP() {
		otpDigits = ['', '', '', '', '', ''];
		error = '';
		if (otpInputs[0]) {
			otpInputs[0].focus();
		}
	}
</script>

<svelte:head>
	<title>Verify OTP - SveltAuth</title>
</svelte:head>

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 p-4"
>
	<div class="w-full max-w-md space-y-8">
		<div class="text-center">
			<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600">
				<svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
					/>
				</svg>
			</div>
			<h2 class="mt-6 text-3xl font-bold text-gray-900">Verify your email</h2>
			<p class="mt-2 text-sm text-gray-600">
				We've sent a 6-digit verification code to your email address. Please enter it below to
				continue.
			</p>
		</div>

		<div class="rounded-2xl border border-gray-100 bg-white px-6 py-8 shadow-xl">
			<div class="space-y-6">
				<div>
					<label class="mb-4 block text-center text-sm font-medium text-gray-700">
						Enter verification code
					</label>
					<div class="flex justify-center space-x-3">
						{#each otpDigits as digit, index}
							<input
								bind:this={otpInputs[index]}
								type="text"
								inputmode="numeric"
								maxlength="1"
								value={digit}
								on:input={(e) => handleInput(index, e)}
								on:keydown={(e) => handleKeydown(index, e)}
								disabled={loading}
								class="h-12 w-12 rounded-xl border border-gray-300 text-center text-lg font-semibold text-gray-900 transition-colors focus:border-purple-500 focus:ring-2 focus:ring-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
								aria-label="Digit {index + 1}"
							/>
						{/each}
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

				<div class="flex space-x-3">
					<button
						type="button"
						on:click={verify}
						disabled={loading || otpDigits.join('').length !== 6}
						class="flex flex-1 justify-center rounded-xl border border-transparent bg-purple-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
							Verifying...
						{:else}
							Verify Code
						{/if}
					</button>

					<button
						type="button"
						on:click={clearOTP}
						disabled={loading}
						class="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
					>
						Clear
					</button>
				</div>

				<div class="text-center">
					<p class="text-sm text-gray-600">
						Didn't receive the code?
						{#if resendTimer > 0}
							<span class="text-gray-400">
								Resend in {resendTimer}s
							</span>
						{:else}
							<button
								type="button"
								on:click={resendOTP}
								disabled={resendLoading}
								class="font-medium text-purple-600 transition-colors hover:text-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
							>
								{#if resendLoading}
									Sending...
								{:else}
									Resend code
								{/if}
							</button>
						{/if}
					</p>
				</div>
			</div>
		</div>

		<div class="text-center">
			<p class="text-sm text-gray-600">
				Having trouble?
				<a
					href="/support"
					class="font-medium text-purple-600 transition-colors hover:text-purple-500"
				>
					Contact support
				</a>
			</p>
			<p class="mt-2 text-xs text-gray-500">
				<a href="/login" class="text-purple-600 hover:text-purple-500">← Back to login</a>
			</p>
		</div>
	</div>
</div>
