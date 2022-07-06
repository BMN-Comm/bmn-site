<!-- Layout file used to guarantee all pages have the correct styling imported -->
<script>
	import 'carbon-components-svelte/css/g100.css'
	import Navbar from '$lib/components/navbar.svelte'
</script>

<Navbar />

<slot />
