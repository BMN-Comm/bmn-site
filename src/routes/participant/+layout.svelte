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
			{#if $page.data.user?.commissie}
				<HeaderNavItem text="Committee" href="/committee" />
			{/if}
			{#if $page.data.user?.admin}
				<HeaderNavItem text="Admin" href="/admin-portal/claims" />
			{/if}
			<SideNavDivider />
		{/if}
		<SideNavLink text="Announcements" href="/participant/announcements" />
		<SideNavLink text="Setlist" href="/participant/setlist" />
		<SideNavLink text="Suggestions" href="/participant/suggestions" />
		<SideNavDivider />
		<SideNavLink text="Rehearsals" href="/participant/rehearsals" />
		<SideNavLink text="Availability" href="/participant/availability" />
	</SideNavItems>
</SideNav>

<Content>
	<slot />
</Content>
