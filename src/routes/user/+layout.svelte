<script lang="ts">
	import {
		SideNav,
		SideNavItems,
		SideNavLink,
		SideNavDivider,
		Content,
		HeaderNavItem
	} from 'carbon-components-svelte'
	import type { SidebarContext } from 'src/routes/+layout.svelte'
	import { getContext } from 'svelte'

	import { page } from '$app/stores'

	const { open } = getContext<SidebarContext>('sidebar')

	$: innerWidth = 0
</script>

<svelte:window bind:innerWidth />

<SideNav bind:isOpen={$open}>
	<SideNavItems>
		{#if innerWidth < 1056}
			<SideNavLink text="Home" href="/" />
			<SideNavLink text="About us" href="/about-us" />
			<HeaderNavItem text="Participant" href="/participant" />
			{#if $page.data.user?.commissie}
				<HeaderNavItem text="Committee" href="/committee" />
			{/if}
			{#if $page.data.user?.admin}
				<HeaderNavItem text="Admin" href="/admin-portal/claims" />
			{/if}
			<SideNavDivider />
		{/if}
		<SideNavLink text="Info" href="/user" />
		<SideNavLink text="Change password" href="/user/change-password" />
	</SideNavItems>
</SideNav>

<Content>
	<slot />
</Content>
