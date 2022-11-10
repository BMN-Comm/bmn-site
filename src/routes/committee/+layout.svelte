<script>
	import {
		SideNav,
		SideNavItems,
		SideNavLink,
		SideNavDivider,
		Content
	} from 'carbon-components-svelte'
</script>

<SideNav isOpen>
	<SideNavItems>
		<SideNavLink text="Announcements" href="/committee/announcements" />
		<SideNavLink text="Setlist" href="/committee/setlist" />
		<SideNavLink text="My songs" href="/committee/mySongs" />
		<SideNavLink text="Suggestions" href="/committee/suggestions" />
		<SideNavDivider />
		<SideNavLink text="Rehearsals" href="/committee/schedule" />
	</SideNavItems>
</SideNav>

<Content>
	<slot />
</Content>
