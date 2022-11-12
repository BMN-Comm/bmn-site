<script>
	import {
		SideNav,
		SideNavItems,
		SideNavLink,
		SideNavDivider,
		Content,
		HeaderNavItem
	} from 'carbon-components-svelte'

	import { page } from '$app/stores'

	$: innerWidth = 0
</script>

<svelte:window bind:innerWidth />

<SideNav isOpen>
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
		<SideNavDivider />
		<SideNavLink text="Rehearsals" href="/committee/schedule" />
	</SideNavItems>
</SideNav>

<Content>
	<slot />
</Content>
