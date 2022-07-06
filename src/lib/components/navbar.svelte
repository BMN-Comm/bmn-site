<script>
	import { Header, HeaderNav, HeaderNavItem } from 'carbon-components-svelte'
	import LoginButton from '$lib/components/loginButton.svelte'
	import { session } from '$app/stores'
</script>

<div class="header-wrapper">
	<Header>
		<img
			src="https://betamusicnight.nl/images/260569dc3f0fd256c1519ca76a69b22e-BMN2022.png"
			height="100%"
			alt="BMNLogo"
			style="margin-right: 10px;"
		/>
		<HeaderNav>
			<HeaderNavItem href="/" text="Home" />
			<HeaderNavItem href="/" text="Info" />
			{#if $session.user}
				<HeaderNavItem href="/deelnemer" text="Deelnemers" />
			{/if}
			{#if $session.user?.commissie}
				<HeaderNavItem href="/commissie" text="Commissie" />
			{/if}
			{#if $session.user?.admin}
				<HeaderNavItem href="/admin-portal" text="Admin" />
			{/if}
		</HeaderNav>

		<LoginButton />
	</Header>
</div>

<style>
	/* Since the header has a fixed position, we wrap it in a simple div with fixed height to prevent hiding data. */
	.header-wrapper {
		height: 48px;
	}
</style>
