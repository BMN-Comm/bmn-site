<script lang="ts">
	import { Header, HeaderNav, HeaderNavItem } from 'carbon-components-svelte'
	import LoginButton from '$lib/components/loginButton.svelte'
	import { getContext } from 'svelte'

	import { page } from '$app/stores'
	import type { sidebarContextType } from 'src/routes/+layout.svelte'

	const { open } = getContext<sidebarContextType>('sidebar')
</script>

<div class="header-wrapper">
	<Header bind:isSideNavOpen={$open}>
		<img src="/BMN2023.png" height="100%" alt="BMNLogo" style="margin-right: 10px;" />
		<HeaderNav>
			<HeaderNavItem href="/" text="Home" />
			<HeaderNavItem href="/" text="Info" />
			{#if $page.data.user}
				<HeaderNavItem href="/participant" text="Participants" />
			{/if}
			{#if $page.data.user?.commissie}
				<HeaderNavItem href="/committee" text="Committee" />
			{/if}
			{#if $page.data.user?.admin}
				<HeaderNavItem href="/admin-portal/claims" text="Admin" />
			{/if}
		</HeaderNav>

		<LoginButton />
	</Header>
</div>

<style>
	/* Since the header has a fixed position, we wrap it in a simple div with fixed height to prevent hiding data. */
	.header-wrapper {
		height: 48px;
	}
</style>
