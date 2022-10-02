<script>
	import { SideNav, SideNavItems, SideNavLink, Content } from 'carbon-components-svelte'
</script>

<SideNav isOpen>
	<SideNavItems>
		<SideNavLink text="Claims" href="/admin-portal/claims" />
		<SideNavLink text="Users" href="/admin-portal/users" />
	</SideNavItems>
</SideNav>

<Content>
	<slot />
</Content>
