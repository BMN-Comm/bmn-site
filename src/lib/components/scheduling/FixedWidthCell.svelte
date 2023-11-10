<script lang="ts">
	import { StructuredListCell, Truncate } from 'carbon-components-svelte'

	export let width: number = 120
</script>

<StructuredListCell class="fixed-width" style="--width:{width}px;" {...$$props}>
	<Truncate>
		<slot />
	</Truncate>
</StructuredListCell>

<style>
	:global(.fixed-width) {
		min-width: var(--width) !important;
		max-width: var(--width) !important;
		vertical-align: middle;
	}
</style>
