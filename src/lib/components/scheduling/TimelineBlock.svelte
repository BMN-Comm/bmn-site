<script lang="ts">
	import type { song } from '$lib/types/domain/song'
	import { stringToColour } from '$lib/util/stringToColour'
	import { MusicRemove } from 'carbon-icons-svelte'

	export let relativeWidth: number
	export let song: song | undefined = undefined
	export let deleteSong: (() => void) | undefined = undefined

	console.log(relativeWidth)
</script>

<div class="song-block" style="--relative-width: {relativeWidth}%;">
	<span class="title">{song?.name ?? 'Free'}</span>
	{#if song}
		<div
			class="delete"
			on:click={() => {
				if (deleteSong) deleteSong()
			}}
			on:keydown={() => {
				if (deleteSong) deleteSong()
			}}
		>
			<MusicRemove />
		</div>
	{/if}
</div>

<style>
	.song-block {
		width: calc(var(--relative-width) - 4px);
		height: 80px;
		position: relative;
		padding-left: 4px;
		padding-right: 28px; 
		border: 1px;
		border-style: solid;
		border-color: #ffffff;
		margin: 2px;
	}

	.title {
		position: relative;
		padding-left: 8px;
		padding-top: 4px;
		display: inline-block;
	}

	.delete {
		cursor: pointer;
		position: absolute;
		right: 10px;
		top: 5px;
	}
</style>
