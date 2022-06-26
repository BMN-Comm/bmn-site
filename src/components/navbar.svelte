<script>
	import { Header, HeaderNav, HeaderNavItem } from 'carbon-components-svelte';
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
			<HeaderNavItem href="/test" text="Test" />
		</HeaderNav>
	</Header>
</div>

<style>
	.header-wrapper {
		height: 48px;
	}
</style>
