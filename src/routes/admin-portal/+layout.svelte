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
	import type { SidebarContext } from 'src/routes/+layout.svelte'

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
			<SideNavDivider />
		{/if}
		<SideNavLink text="Claims" href="/admin-portal/claims" />
		<SideNavLink text="Users" href="/admin-portal/users" />
	</SideNavItems>
</SideNav>

<Content>
	<slot />
</Content>
