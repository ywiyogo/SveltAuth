<script lang="ts">
	import { session } from '$lib/session';
	import { post } from '$lib/api';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	interface User {
		id: string;
		email: string;
		name?: string;
		avatar?: string;
		role?: string;
		joinedAt?: string;
	}

	let user: User | null = null;
	let loading = true;
	let activeTab = 'overview';
	let sidebarOpen = false;

	// Mock data for demonstration
	let stats = {
		totalUsers: 1247,
		activeUsers: 892,
		revenue: 12450,
		orders: 45
	};

	let recentActivities = [
		{ id: 1, action: 'User registered', time: '2 minutes ago', type: 'user' },
		{ id: 2, action: 'Payment received', time: '5 minutes ago', type: 'payment' },
		{ id: 3, action: 'New order placed', time: '10 minutes ago', type: 'order' },
		{ id: 4, action: 'System backup completed', time: '1 hour ago', type: 'system' }
	];

	let notifications = [
		{
			id: 1,
			title: 'Welcome to your dashboard!',
			message: 'Explore all the features available to you.',
			type: 'info',
			unread: true
		},
		{
			id: 2,
			title: 'Security Alert',
			message: 'Your account was accessed from a new device.',
			type: 'warning',
			unread: true
		},
		{
			id: 3,
			title: 'Monthly Report',
			message: 'Your monthly analytics report is ready.',
			type: 'success',
			unread: false
		}
	];

	session.subscribe((s) => {
		user = s?.user || null;
		loading = false;
	});

	onMount(() => {
		if (!user && !loading) {
			goto('/login');
		}
	});

	function logout() {
		loading = true;
		post('/logout', {}).finally(() => {
			localStorage.clear();
			session.set(null);
			goto('/login');
		});
	}

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	function setActiveTab(tab: string) {
		activeTab = tab;
		sidebarOpen = false;
	}

	function getActivityIcon(type: string) {
		switch (type) {
			case 'user':
				return 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z';
			case 'payment':
				return 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
			case 'order':
				return 'M16 11V7a4 4 0 00-8 0v4M8 11v6h8v-6M8 11H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-2';
			case 'system':
				return 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z';
			default:
				return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
		}
	}

	function getNotificationIcon(type: string) {
		switch (type) {
			case 'info':
				return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
			case 'warning':
				return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z';
			case 'success':
				return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
			default:
				return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
		}
	}

	if (loading) {
		// Show loading state
	}
</script>

<svelte:head>
	<title>Dashboard - SveltAuth</title>
</svelte:head>

{#if loading}
	<div class="flex h-screen items-center justify-center bg-gray-50">
		<div class="text-center">
			<svg
				class="mx-auto h-12 w-12 animate-spin text-indigo-600"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
				></circle>
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				></path>
			</svg>
			<p class="mt-4 text-gray-600">Loading dashboard...</p>
		</div>
	</div>
{:else if user}
	<div class="flex h-screen bg-gray-50">
		<!-- Sidebar -->
		<div
			class="fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 {sidebarOpen
				? 'translate-x-0'
				: '-translate-x-full'}"
		>
			<div class="flex h-full flex-col">
				<!-- Logo -->
				<div class="flex h-16 items-center justify-between px-6">
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
					<button on:click={toggleSidebar} class="lg:hidden">
						<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				<!-- Navigation -->
				<nav class="flex-1 space-y-1 px-3 py-4">
					<button
						on:click={() => setActiveTab('overview')}
						class="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors {activeTab ===
						'overview'
							? 'bg-indigo-50 text-indigo-700'
							: 'text-gray-700 hover:bg-gray-50'}"
					>
						<svg class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
							/>
						</svg>
						Overview
					</button>

					<button
						on:click={() => setActiveTab('analytics')}
						class="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors {activeTab ===
						'analytics'
							? 'bg-indigo-50 text-indigo-700'
							: 'text-gray-700 hover:bg-gray-50'}"
					>
						<svg class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
							/>
						</svg>
						Analytics
					</button>

					<button
						on:click={() => setActiveTab('users')}
						class="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors {activeTab ===
						'users'
							? 'bg-indigo-50 text-indigo-700'
							: 'text-gray-700 hover:bg-gray-50'}"
					>
						<svg class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
							/>
						</svg>
						Users
					</button>

					<button
						on:click={() => setActiveTab('settings')}
						class="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors {activeTab ===
						'settings'
							? 'bg-indigo-50 text-indigo-700'
							: 'text-gray-700 hover:bg-gray-50'}"
					>
						<svg class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
							/>
						</svg>
						Settings
					</button>
				</nav>

				<!-- User Profile -->
				<div class="border-t border-gray-200 p-4">
					<div class="flex items-center">
						<div class="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
							<span class="text-sm font-medium text-indigo-600">
								{user.email?.[0]?.toUpperCase() || 'U'}
							</span>
						</div>
						<div class="ml-3 flex-1">
							<p class="text-sm font-medium text-gray-900">{user.name || user.email}</p>
							<p class="text-xs text-gray-500">{user.email}</p>
						</div>
						<button
							on:click={logout}
							class="ml-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:text-gray-600"
							title="Logout"
						>
							<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Overlay for mobile -->
		{#if sidebarOpen}
			<div
				class="bg-opacity-50 fixed inset-0 z-40 bg-black lg:hidden"
				on:click={toggleSidebar}
			></div>
		{/if}

		<!-- Main content -->
		<div class="flex flex-1 flex-col lg:ml-0">
			<!-- Header -->
			<header class="border-b border-gray-200 bg-white shadow-sm">
				<div class="flex h-16 items-center justify-between px-6">
					<div class="flex items-center">
						<button on:click={toggleSidebar} class="lg:hidden">
							<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
						</button>
						<h1 class="ml-4 text-2xl font-bold text-gray-900 lg:ml-0">
							{#if activeTab === 'overview'}
								Dashboard Overview
							{:else if activeTab === 'analytics'}
								Analytics
							{:else if activeTab === 'users'}
								User Management
							{:else if activeTab === 'settings'}
								Settings
							{/if}
						</h1>
					</div>

					<div class="flex items-center space-x-4">
						<!-- Notifications -->
						<div class="relative">
							<button
								class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:text-gray-600"
							>
								<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 17h5l-5 5v-5zM9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
									/>
								</svg>
							</button>
							<span class="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"></span>
						</div>
					</div>
				</div>
			</header>

			<!-- Main content area -->
			<main class="flex-1 overflow-y-auto">
				{#if activeTab === 'overview'}
					<div class="space-y-6 p-6">
						<!-- Welcome Banner -->
						<div class="rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
							<div class="flex items-center justify-between">
								<div>
									<h2 class="text-2xl font-bold">Welcome back, {user.name || user.email}!</h2>
									<p class="mt-2 text-indigo-100">
										Here's what's happening with your account today.
									</p>
								</div>
								<div class="hidden md:block">
									<svg
										class="h-20 w-20 text-indigo-200"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="1"
											d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
										/>
									</svg>
								</div>
							</div>
						</div>

						<!-- Stats Cards -->
						<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
							<div
								class="overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
							>
								<div class="flex items-center">
									<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
										<svg
											class="h-6 w-6 text-blue-600"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
											/>
										</svg>
									</div>
									<div class="ml-4">
										<p class="text-sm font-medium text-gray-600">Total Users</p>
										<p class="text-2xl font-bold text-gray-900">
											{stats.totalUsers.toLocaleString()}
										</p>
									</div>
								</div>
								<div class="mt-4">
									<div class="flex items-center text-sm">
										<span class="text-green-600">↗ 12%</span>
										<span class="ml-2 text-gray-600">from last month</span>
									</div>
								</div>
							</div>

							<div
								class="overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
							>
								<div class="flex items-center">
									<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
										<svg
											class="h-6 w-6 text-green-600"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
											/>
										</svg>
									</div>
									<div class="ml-4">
										<p class="text-sm font-medium text-gray-600">Active Users</p>
										<p class="text-2xl font-bold text-gray-900">
											{stats.activeUsers.toLocaleString()}
										</p>
									</div>
								</div>
								<div class="mt-4">
									<div class="flex items-center text-sm">
										<span class="text-green-600">↗ 8%</span>
										<span class="ml-2 text-gray-600">from last month</span>
									</div>
								</div>
							</div>

							<div
								class="overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
							>
								<div class="flex items-center">
									<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100">
										<svg
											class="h-6 w-6 text-yellow-600"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
									</div>
									<div class="ml-4">
										<p class="text-sm font-medium text-gray-600">Revenue</p>
										<p class="text-2xl font-bold text-gray-900">
											${stats.revenue.toLocaleString()}
										</p>
									</div>
								</div>
								<div class="mt-4">
									<div class="flex items-center text-sm">
										<span class="text-green-600">↗ 23%</span>
										<span class="ml-2 text-gray-600">from last month</span>
									</div>
								</div>
							</div>

							<div
								class="overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
							>
								<div class="flex items-center">
									<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
										<svg
											class="h-6 w-6 text-purple-600"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M16 11V7a4 4 0 00-8 0v4M8 11v6h8v-6M8 11H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-2"
											/>
										</svg>
									</div>
									<div class="ml-4">
										<p class="text-sm font-medium text-gray-600">Orders</p>
										<p class="text-2xl font-bold text-gray-900">{stats.orders}</p>
									</div>
								</div>
								<div class="mt-4">
									<div class="flex items-center text-sm">
										<span class="text-red-600">↘ 3%</span>
										<span class="ml-2 text-gray-600">from last month</span>
									</div>
								</div>
							</div>
						</div>

						<!-- Recent Activities & Notifications -->
						<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
							<!-- Recent Activities -->
							<div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
								<div class="flex items-center justify-between">
									<h3 class="text-lg font-semibold text-gray-900">Recent Activities</h3>
									<button class="text-sm text-indigo-600 hover:text-indigo-500">View all</button>
								</div>
								<div class="mt-6 space-y-4">
									{#each recentActivities as activity}
										<div class="flex items-start space-x-3">
											<div
												class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100"
											>
												<svg
													class="h-4 w-4 text-gray-600"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d={getActivityIcon(activity.type)}
													/>
												</svg>
											</div>
											<div class="flex-1">
												<p class="text-sm font-medium text-gray-900">{activity.action}</p>
												<p class="text-sm text-gray-500">{activity.time}</p>
											</div>
										</div>
									{/each}
								</div>
							</div>

							<!-- Notifications -->
							<div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
								<div class="flex items-center justify-between">
									<h3 class="text-lg font-semibold text-gray-900">Notifications</h3>
									<button class="text-sm text-indigo-600 hover:text-indigo-500"
										>Mark all read</button
									>
								</div>
								<div class="mt-6 space-y-4">
									{#each notifications as notification}
										<div
											class="flex items-start space-x-3 {notification.unread
												? 'bg-blue-50'
												: ''} rounded-lg p-3"
										>
											<div
												class="flex h-8 w-8 items-center justify-center rounded-full {notification.type ===
												'warning'
													? 'bg-yellow-100'
													: notification.type === 'success'
														? 'bg-green-100'
														: 'bg-blue-100'}"
											>
												<svg
													class="h-4 w-4 {notification.type === 'warning'
														? 'text-yellow-600'
														: notification.type === 'success'
															? 'text-green-600'
															: 'text-blue-600'}"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d={getNotificationIcon(notification.type)}
													/>
												</svg>
											</div>
											<div class="flex-1">
												<p class="text-sm font-medium text-gray-900">{notification.title}</p>
												<p class="text-sm text-gray-500">{notification.message}</p>
											</div>
											{#if notification.unread}
												<div class="h-2 w-2 rounded-full bg-blue-500"></div>
											{/if}
										</div>
									{/each}
								</div>
							</div>
						</div>
					</div>
				{:else if activeTab === 'analytics'}
					<div class="space-y-6 p-6">
						<div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
							<h3 class="mb-4 text-lg font-semibold text-gray-900">Analytics Overview</h3>
							<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
								<div class="flex h-64 items-center justify-center rounded-xl bg-gray-100">
									<p class="text-gray-500">Chart placeholder - User growth over time</p>
								</div>
								<div class="flex h-64 items-center justify-center rounded-xl bg-gray-100">
									<p class="text-gray-500">Chart placeholder - Revenue trends</p>
								</div>
							</div>
						</div>
					</div>
				{:else if activeTab === 'users'}
					<div class="space-y-6 p-6">
						<div class="rounded-2xl border border-gray-100 bg-white shadow-sm">
							<div class="border-b border-gray-200 p-6">
								<div class="flex items-center justify-between">
									<h3 class="text-lg font-semibold text-gray-900">User Management</h3>
									<button
										class="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
									>
										Add User
									</button>
								</div>
							</div>
							<div class="p-6">
								<div class="overflow-x-auto">
									<table class="min-w-full">
										<thead>
											<tr class="border-b border-gray-200">
												<th class="pb-3 text-left text-sm font-medium text-gray-600">User</th>
												<th class="pb-3 text-left text-sm font-medium text-gray-600">Email</th>
												<th class="pb-3 text-left text-sm font-medium text-gray-600">Role</th>
												<th class="pb-3 text-left text-sm font-medium text-gray-600">Status</th>
												<th class="pb-3 text-left text-sm font-medium text-gray-600">Actions</th>
											</tr>
										</thead>
										<tbody class="space-y-3">
											<tr class="border-b border-gray-100">
												<td class="py-3">
													<div class="flex items-center">
														<div
															class="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100"
														>
															<span class="text-sm font-medium text-indigo-600">JD</span>
														</div>
														<span class="ml-3 text-sm font-medium text-gray-900">John Doe</span>
													</div>
												</td>
												<td class="py-3 text-sm text-gray-600">john@example.com</td>
												<td class="py-3">
													<span
														class="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800"
														>Admin</span
													>
												</td>
												<td class="py-3">
													<span
														class="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800"
														>Active</span
													>
												</td>
												<td class="py-3">
													<button class="text-sm text-indigo-600 hover:text-indigo-500">Edit</button
													>
												</td>
											</tr>
											<tr class="border-b border-gray-100">
												<td class="py-3">
													<div class="flex items-center">
														<div
															class="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100"
														>
															<span class="text-sm font-medium text-purple-600">JS</span>
														</div>
														<span class="ml-3 text-sm font-medium text-gray-900">Jane Smith</span>
													</div>
												</td>
												<td class="py-3 text-sm text-gray-600">jane@example.com</td>
												<td class="py-3">
													<span
														class="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
														>User</span
													>
												</td>
												<td class="py-3">
													<span
														class="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800"
														>Active</span
													>
												</td>
												<td class="py-3">
													<button class="text-sm text-indigo-600 hover:text-indigo-500">Edit</button
													>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				{:else if activeTab === 'settings'}
					<div class="space-y-6 p-6">
						<div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
							<h3 class="mb-6 text-lg font-semibold text-gray-900">Account Settings</h3>
							<div class="space-y-6">
								<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
									<div>
										<label class="mb-2 block text-sm font-medium text-gray-700">Full Name</label>
										<input
											type="text"
											class="w-full rounded-xl border border-gray-300 px-4 py-3"
											value={user.name || ''}
										/>
									</div>
									<div>
										<label class="mb-2 block text-sm font-medium text-gray-700">Email Address</label
										>
										<input
											type="email"
											class="w-full rounded-xl border border-gray-300 px-4 py-3"
											value={user.email}
											readonly
										/>
									</div>
								</div>

								<div class="border-t border-gray-200 pt-6">
									<h4 class="text-md mb-4 font-medium text-gray-900">Security Settings</h4>
									<div class="space-y-4">
										<div class="flex items-center justify-between">
											<div>
												<p class="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
												<p class="text-sm text-gray-500">
													Add an extra layer of security to your account
												</p>
											</div>
											<button
												class="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
											>
												Enable
											</button>
										</div>

										<div class="flex items-center justify-between">
											<div>
												<p class="text-sm font-medium text-gray-900">Password</p>
												<p class="text-sm text-gray-500">Last changed 3 months ago</p>
											</div>
											<button
												class="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
											>
												Change Password
											</button>
										</div>
									</div>
								</div>

								<div class="border-t border-gray-200 pt-6">
									<h4 class="text-md mb-4 font-medium text-gray-900">Preferences</h4>
									<div class="space-y-4">
										<div class="flex items-center justify-between">
											<div>
												<p class="text-sm font-medium text-gray-900">Email Notifications</p>
												<p class="text-sm text-gray-500">
													Receive email about your account activity
												</p>
											</div>
											<input
												type="checkbox"
												class="h-4 w-4 rounded border-gray-300 text-indigo-600"
												checked
											/>
										</div>

										<div class="flex items-center justify-between">
											<div>
												<p class="text-sm font-medium text-gray-900">SMS Notifications</p>
												<p class="text-sm text-gray-500">
													Receive SMS alerts for important updates
												</p>
											</div>
											<input
												type="checkbox"
												class="h-4 w-4 rounded border-gray-300 text-indigo-600"
											/>
										</div>
									</div>
								</div>

								<div class="border-t border-gray-200 pt-6">
									<button
										class="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700"
									>
										Save Changes
									</button>
								</div>
							</div>
						</div>
					</div>
				{/if}
			</main>
		</div>
	</div>
{:else}
	<div class="flex h-screen items-center justify-center bg-gray-50">
		<div class="text-center">
			<h2 class="text-2xl font-bold text-gray-900">Access Denied</h2>
			<p class="mt-2 text-gray-600">Please log in to access the dashboard.</p>
			<a
				href="/login"
				class="mt-4 inline-block rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700"
			>
				Go to Login
			</a>
		</div>
	</div>
{/if}
