<script lang="ts">
	import {
		SideNav,
		SideNavItems,
		SideNavLink,
		SideNavDivider,
		Content
	} from 'carbon-components-svelte'
	import type { sidebarContextType } from 'src/routes/+layout.svelte'
	import { getContext } from 'svelte'

	const { open } = getContext<sidebarContextType>('sidebar')
</script>

<SideNav bind:isOpen={$open}>
	<SideNavItems>
		<SideNavLink text="Announcements" href="/participant/announcements" />
		<SideNavLink text="Setlist" href="/participant/setlist" />
		<SideNavLink text="My songs" href="/participant/mySongs" />
		<SideNavLink text="Suggestions" href="/participant/suggestions" />
		<SideNavDivider />
		<SideNavLink text="Schedule" href="/participant/schedule" />
		<SideNavLink text="Availability" href="/participant/availability" />
	</SideNavItems>
</SideNav>

<Content>
	<slot />
</Content>
