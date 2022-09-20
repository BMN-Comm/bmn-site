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
		<SideNavLink text="Mededelingen" href="participant/announcements" />
		<SideNavLink text="Setlist" href="participant/setlist" />
		<SideNavLink text="Mijn nummers" href="participant/mySongs" />
		<SideNavLink text="Suggesties" href="participant/suggestions" />
		<SideNavDivider />
		<SideNavLink text="Rooster" href="participant/schedule" />
		<SideNavLink text="Beschikbaarheid" href="participant/availability" />
	</SideNavItems>
</SideNav>

<Content>
	<slot />
</Content>
