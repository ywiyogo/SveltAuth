<script lang="ts">
  import { session } from '$lib/session';
  import { goto } from '$app/navigation';

  let user: any = null;

  session.subscribe((s) => {
    user = s?.user;
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
  <title>Terms of Service | SveltAuth</title>
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
          <a href="/terms" class="text-gray-600 transition-colors hover:text-gray-900">Terms</a>
          <a href="/privacy" class="text-gray-600 transition-colors hover:text-gray-900">Privacy</a>
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

  <!-- Main Content -->
  <main class="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
    <h1 class="text-4xl font-bold tracking-tight text-gray-900">Terms of Service</h1>
    <p class="mt-2 text-gray-600">Last updated: June 21, 2025</p>

    <div class="prose prose-lg mt-8 max-w-none text-gray-600">
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing or using our services, you agree to be bound by these Terms.</p>

      <h2>2. Service Description</h2>
      <p>We provide authentication services. Yobotics Pte. Ltd is responsible for this service.</p>

      <h2>3. User Responsibilities</h2>
      <p>You agree to use the service lawfully and not to misuse it in any way.</p>

      <h2>4. Limitation of Liability</h2>
      <p>Yobotics Pte. Ltd shall not be liable for any indirect, incidental damages.</p>

      <h2>5. Changes to Terms</h2>
      <p>We may modify these terms at any time. Continued use constitutes acceptance.</p>
    </div>
  </main>

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
            Modern authentication platform built for developers. Secure, fast, and easy to integrate.
          </p>
        </div>

        <div>
          <h3 class="text-sm font-semibold tracking-wider text-gray-900 uppercase">Product</h3>
          <ul class="mt-4 space-y-2">
            <li><a href="#features" class="text-gray-600 hover:text-gray-900">Features</a></li>
            <li><a href="/docs" class="text-gray-600 hover:text-gray-900">Documentation</a></li>
          </ul>
        </div>

        <div>
          <h3 class="text-sm font-semibold tracking-wider text-gray-900 uppercase">Legal</h3>
          <ul class="mt-4 space-y-2">
            <li><a href="/privacy" class="text-gray-600 hover:text-gray-900">Privacy Policy</a></li>
            <li><a href="/terms" class="text-gray-600 hover:text-gray-900">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <div class="mt-8 border-t border-gray-200 pt-8">
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-500">© 2025 SveltAuth. All rights reserved.</p>
          <div class="flex space-x-6">
            <a href="/privacy" class="text-sm text-gray-500 hover:text-gray-900">Privacy</a>
            <a href="/terms" class="text-sm text-gray-500 hover:text-gray-900">Terms</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</div>