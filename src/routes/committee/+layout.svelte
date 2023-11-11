<script lang="ts">
	import {
		SideNav,
		SideNavItems,
		SideNavLink,
		SideNavDivider,
		Content,
		HeaderNavItem
	} from 'carbon-components-svelte'

	import { page } from '$app/stores'
	import type { SidebarContext } from 'src/routes/+layout.svelte'
	import { getContext } from 'svelte'

	const { open } = getContext<SidebarContext>('sidebar')

	$: innerWidth = 0
</script>

<svelte:window bind:innerWidth />

<SideNav bind:isOpen={$open}>
	<SideNavItems>
		{#if innerWidth < 1056}
			<SideNavLink text="Home" href="/" />
			<HeaderNavItem text="Participant" href="/participant" />
			{#if $page.data.user?.admin}
				<HeaderNavItem text="Admin" href="/admin-portal/claims" />
			{/if}
			<SideNavDivider />
		{/if}
		<SideNavLink text="Announcements" href="/committee/announcements" />
		<SideNavLink text="Setlist" href="/committee/setlist" />
		<SideNavLink text="Suggestions" href="/committee/suggestions" />
		<SideNavLink text="Scheduling" href="/committee/scheduling" />
		<SideNavDivider />
		<SideNavLink text="Rehearsals" href="/committee/rehearsals" />
	</SideNavItems>
</SideNav>

<Content>
	<slot />
</Content>
