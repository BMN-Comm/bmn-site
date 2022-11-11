<script lang="ts">
	import {
		Header,
		HeaderNav,
		HeaderNavItem,
		HeaderNavMenu,
		HeaderPanelDivider,
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
</script>

<div class="header-wrapper">
	<Header bind:isSideNavOpen={$open} persistentHamburgerMenu={true}>
		<img src="/BMN2023.png" height="100%" alt="BMNLogo" style="margin-right: 10px;" />
		<HeaderNav>
			<HeaderNavItem href="/" text="Home" />
			<HeaderNavItem href="/" text="Info" />
			{#if $page.data.user}
				<HeaderNavMenu text="Participants">
					<HeaderNavItem text="Home" href="/participant" />
					<HeaderNavItem text="Announcements" href="/participant/announcements" />
					<HeaderNavItem text="Setlist" href="/participant/setlist" />
					<HeaderNavItem text="My songs" href="/participant/mySongs" />
					<HeaderNavItem text="Suggestions" href="/participant/suggestions" />
					<SideNavDivider />
					<HeaderNavItem text="Schedule" href="/participant/schedule" />
					<HeaderNavItem text="Availability" href="/participant/availability" />
				</HeaderNavMenu>
			{/if}
			{#if $page.data.user?.commissie}
				<HeaderNavMenu text="Committee">
					<HeaderNavItem text="Home" href="/committee" />
					<HeaderNavItem text="Announcements" href="/committee/announcements" />
					<HeaderNavItem text="Setlist" href="/committee/setlist" />
					<HeaderNavItem text="My songs" href="/committee/mySongs" />
					<HeaderNavItem text="Suggestions" href="/committee/suggestions" />
					<SideNavDivider />
					<HeaderNavItem text="Rehearsals" href="/committee/schedule" />
				</HeaderNavMenu>
			{/if}
			{#if $page.data.user?.admin}
				<HeaderNavMenu text="Admin">
					<HeaderNavItem text="Claims" href="/admin-portal/claims" />
					<HeaderNavItem text="Users" href="/admin-portal/users" />
				</HeaderNavMenu>
			{/if}
		</HeaderNav>

		<LoginButton />
	</Header>
</div>

<SideNav bind:isOpen={$open}>
	<SideNavItems>
		<SideNavLink href="/" text="Home" />
		<SideNavLink href="/" text="Info" />
		{#if $page.data.user}
			<SideNavMenu text="Participants">
				<SideNavLink text="Home" href="/participant" />
				<SideNavLink text="Announcements" href="/participant/announcements" />
				<SideNavLink text="Setlist" href="/participant/setlist" />
				<SideNavLink text="My songs" href="/participant/mySongs" />
				<SideNavLink text="Suggestions" href="/participant/suggestions" />
				<SideNavDivider />
				<SideNavLink text="Schedule" href="/participant/schedule" />
				<SideNavLink text="Availability" href="/participant/availability" />
			</SideNavMenu>
		{/if}
		{#if $page.data.user?.commissie}
			<SideNavMenu text="Committee">
				<SideNavLink text="Home" href="/committee" />
				<SideNavLink text="Announcements" href="/committee/announcements" />
				<SideNavLink text="Setlist" href="/committee/setlist" />
				<SideNavLink text="My songs" href="/committee/mySongs" />
				<SideNavLink text="Suggestions" href="/committee/suggestions" />
				<SideNavDivider />
				<SideNavLink text="Rehearsals" href="/committee/schedule" />
			</SideNavMenu>
		{/if}
		{#if $page.data.user?.admin}
			<SideNavMenu text="Admin">
				<SideNavLink text="Claims" href="/admin-portal/claims" />
				<SideNavLink text="Users" href="/admin-portal/users" />
			</SideNavMenu>
		{/if}
	</SideNavItems>
</SideNav>

<style>
	/* Since the header has a fixed position, we wrap it in a simple div with fixed height to prevent hiding data. */
	.header-wrapper {
		height: 48px;
	}
</style>
