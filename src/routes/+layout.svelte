<script lang="ts" context="module">
	export type SidebarContext = { open: Writable<boolean> }
</script>

<!-- Layout file used to guarantee all pages have the correct styling imported -->
<script lang="ts">
	import 'carbon-components-svelte/css/g100.css'
	import '/src/style/style.css'
	import Navbar from '$lib/components/navbar.svelte'
	import { setContext } from 'svelte'
	import { writable, type Writable } from 'svelte/store'

	export let isSideNavOpen = writable<boolean>(false)

	setContext('sidebar', {
		open: isSideNavOpen
	})
</script>

<Navbar />

<slot />
