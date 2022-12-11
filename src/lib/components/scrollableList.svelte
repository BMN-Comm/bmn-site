<script lang="ts">
	import { StructuredList } from 'carbon-components-svelte'

	export let condensed: boolean | undefined = undefined
	export let classname: string | undefined = undefined
</script>

<div class="list-container">
	<StructuredList {condensed} class={classname}>
		<slot />
	</StructuredList>
</div>

<style>
	.list-container {
		overflow-x: auto;
	}
</style>
