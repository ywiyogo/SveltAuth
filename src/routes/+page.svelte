<script lang="ts">
	import { onMount } from 'svelte';
	import { session } from '$lib/session';
	import { goto } from '$app/navigation';

	let user: any = null;
	let currentTestimonial = 0;

	const features = [
		{
			icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
			title: 'Secure Authentication',
			description:
				'Bank-level security with multi-factor authentication and encrypted data storage.'
		},
		{
			icon: 'M13 10V3L4 14h7v7l9-11h-7z',
			title: 'Lightning Fast',
			description: 'Built with SvelteKit for optimal performance and seamless user experience.'
		},
		{
			icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4',
			title: 'Easy Integration',
			description:
				'Simple API and components that integrate seamlessly with your existing applications.'
		},
		{
			icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
			title: 'Enterprise Ready',
			description: 'Scalable architecture with comprehensive audit logs and compliance features.'
		}
	];

	const testimonials = [
		{
			quote:
				'SveltAuth transformed our authentication system. The OTP verification is seamless and our users love the modern interface.',
			author: 'Sarah Chen',
			role: 'CTO at TechFlow',
			avatar: 'SC'
		},
		{
			quote:
				'Implementation was incredibly smooth. We had our entire auth system up and running in less than a day.',
			author: 'Michael Rodriguez',
			role: 'Lead Developer at StartupXYZ',
			avatar: 'MR'
		},
		{
			quote:
				'The security features are top-notch. Our compliance team was impressed with the built-in audit trails.',
			author: 'Emily Johnson',
			role: 'Security Engineer at DataCorp',
			avatar: 'EJ'
		}
	];

	const stats = [
		{ label: 'Active Users', value: '50K+' },
		{ label: 'API Calls/Day', value: '2M+' },
		{ label: 'Uptime', value: '99.9%' },
		{ label: 'Countries', value: '120+' }
	];

	session.subscribe((s) => {
		user = s?.user;
	});

	onMount(() => {
		// Auto-rotate testimonials
		const interval = setInterval(() => {
			currentTestimonial = (currentTestimonial + 1) % testimonials.length;
		}, 5000);

		return () => clearInterval(interval);
	});

	function goToDashboard() {
		if (user) {
			goto('/dashboard');
		} else {
			goto('/login');
		}
	}
</script>

<svelte:head>
	<title>SveltAuth - Modern Authentication Platform</title>
	<meta
		name="description"
		content="Secure, fast, and easy-to-integrate authentication platform built with SvelteKit. Get started in minutes with OTP verification, multi-factor authentication, and more."
	/>
</svelte:head>

<div class="min-h-screen bg-white">
	<!-- Navigation -->
	<nav class="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-md">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<div class="flex items-center space-x-2">
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
						<svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 10V3L4 14h7v7l9-11h-7z"
							/>
						</svg>
					</div>
					<span class="text-xl font-bold text-gray-900">SveltAuth</span>
				</div>

				<div class="hidden md:flex md:items-center md:space-x-8">
					<a href="#features" class="text-gray-600 transition-colors hover:text-gray-900"
						>Features</a
					>
					<a href="#testimonials" class="text-gray-600 transition-colors hover:text-gray-900"
						>Testimonials</a
					>
					<!-- <a href="#pricing" class="text-gray-600 transition-colors hover:text-gray-900">Pricing</a>
					<a href="/docs" class="text-gray-600 transition-colors hover:text-gray-900">Docs</a> -->
				</div>

				<div class="flex items-center space-x-4">
					{#if user}
						<button
							on:click={goToDashboard}
							class="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
						>
							Dashboard
						</button>
					{:else}
						<a
							href="/login"
							class="font-medium text-gray-600 transition-colors hover:text-gray-900"
						>
							Sign in
						</a>
						<a
							href="/register"
							class="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
						>
							Get Started
						</a>
					{/if}
				</div>
			</div>
		</div>
	</nav>

	<!-- Hero Section -->
	<section class="relative overflow-hidden">
		<div class="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50"></div>
		<div class="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
			<div class="text-center">
				<h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
					Modern Authentication
					<span
						class="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
					>
						Made Simple
					</span>
				</h1>
				<p class="mx-auto mt-6 max-w-2xl text-xl text-gray-600">
					Secure, fast, and developer-friendly authentication platform. Get started in minutes with
					OTP verification, multi-factor authentication, and enterprise-grade security.
				</p>
				<div class="mt-10 flex items-center justify-center gap-x-6">
					<a
						href="/register"
						class="transform rounded-2xl bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-indigo-700"
					>
						Start Free Trial
					</a>
					<a
						href="#features"
						class="rounded-2xl border border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-900 transition-colors hover:bg-gray-50"
					>
						Learn More
					</a>
				</div>
			</div>

			<!-- Stats -->
			<div class="mx-auto mt-20 max-w-4xl">
				<div class="grid grid-cols-2 gap-8 md:grid-cols-4">
					{#each stats as stat}
						<div class="text-center">
							<div class="text-3xl font-bold text-gray-900">{stat.value}</div>
							<div class="mt-1 text-sm text-gray-600">{stat.label}</div>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Floating Elements -->
		<div
			class="absolute top-20 left-10 h-20 w-20 rounded-full bg-indigo-100 opacity-60 blur-xl"
		></div>
		<div
			class="absolute right-10 bottom-20 h-32 w-32 rounded-full bg-purple-100 opacity-40 blur-xl"
		></div>
		<div
			class="absolute top-1/2 left-1/4 h-16 w-16 rounded-full bg-cyan-100 opacity-50 blur-xl"
		></div>
	</section>

	<!-- Features Section -->
	<section id="features" class="bg-gray-50 py-24">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="text-center">
				<h2 class="text-3xl font-bold text-gray-900 sm:text-4xl">
					Everything you need for authentication
				</h2>
				<p class="mt-4 text-xl text-gray-600">
					Built with modern standards and best practices in mind
				</p>
			</div>

			<div class="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
				{#each features as feature}
					<div
						class="group relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg"
					>
						<div
							class="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 transition-colors group-hover:bg-indigo-200"
						>
							<svg
								class="h-6 w-6 text-indigo-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d={feature.icon}
								/>
							</svg>
						</div>
						<h3 class="mt-6 text-xl font-semibold text-gray-900">{feature.title}</h3>
						<p class="mt-2 text-gray-600">{feature.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Testimonials Section -->
	<section id="testimonials" class="bg-white py-24">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="text-center">
				<h2 class="text-3xl font-bold text-gray-900 sm:text-4xl">
					Trusted by developers worldwide
				</h2>
				<p class="mt-4 text-xl text-gray-600">See what our customers are saying about SveltAuth</p>
			</div>

			<div class="mt-20">
				<div
					class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 p-8 shadow-xl"
				>
					<div class="relative z-10">
						<blockquote class="text-center">
							<p class="text-xl font-medium text-white sm:text-2xl">
								"{testimonials[currentTestimonial].quote}"
							</p>
							<footer class="mt-8">
								<div class="flex items-center justify-center space-x-3">
									<div class="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
										<span class="text-sm font-semibold text-white">
											{testimonials[currentTestimonial].avatar}
										</span>
									</div>
									<div class="text-center">
										<div class="text-lg font-semibold text-white">
											{testimonials[currentTestimonial].author}
										</div>
										<div class="text-indigo-100">
											{testimonials[currentTestimonial].role}
										</div>
									</div>
								</div>
							</footer>
						</blockquote>
					</div>

					<!-- Background decoration -->
					<div class="absolute top-0 right-0 h-32 w-32 rounded-full bg-white/10 blur-3xl"></div>
					<div class="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-white/5 blur-3xl"></div>
				</div>

				<!-- Testimonial indicators -->
				<div class="mt-8 flex justify-center space-x-2">
					{#each testimonials as _, index}
						<button
							class="h-3 w-3 rounded-full transition-colors {index === currentTestimonial
								? 'bg-indigo-600'
								: 'bg-gray-300'}"
							on:click={() => (currentTestimonial = index)}
						></button>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="bg-gray-900 py-24">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="text-center">
				<h2 class="text-3xl font-bold text-white sm:text-4xl">Ready to get started?</h2>
				<p class="mt-4 text-xl text-gray-300">
					Join thousands of developers who trust SveltAuth for their authentication needs
				</p>
				<div class="mt-10 flex items-center justify-center gap-x-6">
					<a
						href="/register"
						class="transform rounded-2xl bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-indigo-700"
					>
						Start Free Trial
					</a>
					<a
						href="/login"
						class="rounded-2xl border border-gray-600 bg-transparent px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-gray-800"
					>
						Sign In
					</a>
				</div>
			</div>
		</div>
	</section>

	<!-- Footer -->
	<footer class="border-t border-gray-200 bg-white">
		<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
			<div class="grid grid-cols-1 gap-8 md:grid-cols-4">
				<div class="col-span-1 md:col-span-2">
					<div class="flex items-center space-x-2">
						<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
							<svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 10V3L4 14h7v7l9-11h-7z"
								/>
							</svg>
						</div>
						<span class="text-xl font-bold text-gray-900">SveltAuth</span>
					</div>
					<p class="mt-4 max-w-md text-gray-600">
						Modern authentication platform built for developers. Secure, fast, and easy to
						integrate.
					</p>
				</div>

				<div>
					<h3 class="text-sm font-semibold tracking-wider text-gray-900 uppercase">Product</h3>
					<ul class="mt-4 space-y-2">
						<li><a href="#features" class="text-gray-600 hover:text-gray-900">Features</a></li>
						<li><a href="/docs" class="text-gray-600 hover:text-gray-900">Documentation</a></li>
						<li><a href="/api" class="text-gray-600 hover:text-gray-900">API Reference</a></li>
						<li><a href="/pricing" class="text-gray-600 hover:text-gray-900">Pricing</a></li>
					</ul>
				</div>

				<div>
					<h3 class="text-sm font-semibold tracking-wider text-gray-900 uppercase">Support</h3>
					<ul class="mt-4 space-y-2">
						<li><a href="/help" class="text-gray-600 hover:text-gray-900">Help Center</a></li>
						<li><a href="/contact" class="text-gray-600 hover:text-gray-900">Contact</a></li>
						<li><a href="/status" class="text-gray-600 hover:text-gray-900">Status</a></li>
						<li><a href="/community" class="text-gray-600 hover:text-gray-900">Community</a></li>
					</ul>
				</div>
			</div>

			<div class="mt-8 border-t border-gray-200 pt-8">
				<div class="flex items-center justify-between">
					<p class="text-sm text-gray-500">© 2024 SveltAuth. All rights reserved.</p>
					<div class="flex space-x-6">
						<a href="/privacy" class="text-sm text-gray-500 hover:text-gray-900">Privacy</a>
						<a href="/terms" class="text-sm text-gray-500 hover:text-gray-900">Terms</a>
					</div>
				</div>
			</div>
		</div>
	</footer>
</div>
