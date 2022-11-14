<script lang="ts">
	import { StructuredList } from 'carbon-components-svelte'

	export let condensed: boolean | undefined = undefined
</script>

<div class="list-container">
	<StructuredList {condensed}>
		<slot />
	</StructuredList>
</div>

<style>
	.list-container {
		overflow-x: scroll;
	}
</style>
