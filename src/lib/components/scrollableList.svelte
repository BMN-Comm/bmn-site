<script lang="ts">
	import { StructuredList } from 'carbon-components-svelte'

	export let condensed: boolean | undefined = undefined
	export let selection: boolean | undefined = undefined
</script>

<div class="list-container">
	<StructuredList {condensed} {selection}>
		<slot />
	</StructuredList>
</div>

<style>
	.list-container {
		overflow-x: auto;
	}
</style>
