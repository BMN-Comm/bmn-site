<script lang="ts">
	import type { song } from '$lib/types/domain/song'
	import { stringToColour } from '$lib/util/stringToColour'
	import { MusicRemove } from 'carbon-icons-svelte'

	export let relativeWidth: number
	export let song: song | undefined = undefined
	export let deleteSong: (() => void) | undefined = undefined

	$: randomColor = song ? stringToColour(song.id) : '#808080'
</script>

<div class="song-block" style={`width: ${relativeWidth}%; background-color: ${randomColor}`}>
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
		height: 100px;
		position: relative;
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
