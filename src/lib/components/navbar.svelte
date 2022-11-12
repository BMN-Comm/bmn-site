<script lang="ts">
	import {
		Header,
		HeaderNav,
		HeaderNavItem,
		HeaderNavMenu,
		SideNav,
		SideNavDivider,
		SideNavItems,
		SideNavLink,
		SideNavMenu
	} from 'carbon-components-svelte'
	import LoginButton from '$lib/components/loginButton.svelte'
	import { getContext } from 'svelte'

	import { page } from '$app/stores'
	import type { sidebarContextType } from 'src/routes/+layout.svelte'

	const { open } = getContext<sidebarContextType>('sidebar')

	$: innerWidth = 0
</script>

<svelte:window bind:innerWidth />

<div class="header-wrapper">
	<Header bind:isSideNavOpen={$open} persistentHamburgerMenu={innerWidth < 1056}>
		<img src="/BMN2023.png" height="100%" alt="BMNLogo" style="margin-right: 10px;" />
		<HeaderNav>
			<HeaderNavItem href="/" text="Home" />
			<HeaderNavItem href="/#info" text="Info" />
			{#if $page.data.user}
				<HeaderNavItem text="Participants" href="/participant" />
			{/if}
			{#if $page.data.user?.commissie}
				<HeaderNavItem text="Committee" href="/committee" />
			{/if}
			{#if $page.data.user?.admin}
				<HeaderNavItem text="Admin" href="/admin-portal/claims" />
			{/if}
		</HeaderNav>

		<LoginButton />
	</Header>
</div>
{#if innerWidth < 1056}
	<SideNav bind:isOpen={$open}>
		<SideNavItems>
			<SideNavLink href="/" text="Home" />
			<SideNavLink href="/" text="Info" />
			{#if $page.data.user}
				<SideNavLink text="Participants" href="/participant" />
			{/if}
			{#if $page.data.user?.commissie}
				<SideNavLink text="Committee" href="/committee" />
			{/if}
			{#if $page.data.user?.admin}
				<SideNavMenu text="Admin" />
			{/if}
		</SideNavItems>
	</SideNav>
{/if}

<style>
	/* Since the header has a fixed position, we wrap it in a simple div with fixed height to prevent hiding data. */
	.header-wrapper {
		height: 48px;
	}
</style>
