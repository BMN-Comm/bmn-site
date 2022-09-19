<!-- Layout file used to guarantee all pages have the correct styling imported -->
<script lang="ts">
	import 'carbon-components-svelte/css/g100.css'
	import Navbar from '$lib/components/navbar.svelte'

	let isSideNavOpen: boolean = true
</script>

<Navbar bind:isSideNavOpen />

<slot isSideNavOpen />
