<script lang="ts">
	import { Popover, StructuredListCell, Truncate } from 'carbon-components-svelte'

	export let positionClass: 'left-cell' | 'top-cell'
	export let song: string

	let toolTipOpen = false
</script>

<StructuredListCell
	class="{positionClass} fixed-table-cell"
	on:mouseenter={() => {
		toolTipOpen = true
	}}
	on:mouseleave={() => {
		toolTipOpen = false
	}}
	on:click={() => {
		toolTipOpen = !toolTipOpen
	}}
>
	<Truncate>{song}</Truncate>
	<Popover caret bind:open={toolTipOpen} align={positionClass === 'left-cell' ? 'right' : 'bottom'}>
		<div class="with-padding">{song}</div>
	</Popover>
</StructuredListCell>

<style>
	:global(.top-cell) {
		border-width: 0px 1px;
	}

	:global(.left-cell) {
		border-width: 1px 0px;
	}

	.with-padding {
		padding: 6px;
	}
</style>
