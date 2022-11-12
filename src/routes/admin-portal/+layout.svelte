<script lang="ts">
	import {
		SideNav,
		SideNavItems,
		SideNavLink,
		Content,
		HeaderNavItem,
		SideNavDivider
	} from 'carbon-components-svelte'

	import { page } from '$app/stores'
	import { getContext } from 'svelte'
	import type { sidebarContextType } from 'src/routes/+layout.svelte'

	const { open } = getContext<sidebarContextType>('sidebar')

	$: innerWidth = 0
</script>

<svelte:window bind:innerWidth />

<SideNav bind:isOpen={$open}>
	<SideNavItems>
		{#if innerWidth < 1056}
			<SideNavLink text="Home" href="/" />
			<HeaderNavItem text="Participant" href="/participant" />
			{#if $page.data.user?.commissie}
				<HeaderNavItem text="Committee" href="/committee" />
			{/if}
			<SideNavDivider />
		{/if}
		<SideNavLink text="Claims" href="/admin-portal/claims" />
		<SideNavLink text="Users" href="/admin-portal/users" />
	</SideNavItems>
</SideNav>

<Content>
	<slot />
</Content>
