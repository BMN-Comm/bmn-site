<!-- Layout file used to guarantee all pages have the correct styling imported -->
<script>
	import { onMount } from 'svelte'
	import 'carbon-components-svelte/css/g100.css'
	import { getApp } from 'firebase/app'
</script>

<slot />
