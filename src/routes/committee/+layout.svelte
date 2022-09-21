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
		<SideNavLink text="Mededelingen" href="committee/announcements" />
		<SideNavLink text="Setlist" href="committee/setlist" />
		<SideNavLink text="Mijn nummers" href="committee/mySongs" />
		<SideNavLink text="Suggesties" href="committee/suggestions" />
		<SideNavDivider />
		<SideNavLink text="Rooster" href="committee/schedule" />
		<SideNavLink text="Beschikbaarheid" href="committee/availability" />
	</SideNavItems>
</SideNav>

<Content>
	<slot />
</Content>
