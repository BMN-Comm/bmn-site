<script lang="ts">
	import type { song } from '$lib/types/domain/song'
	import { MusicRemove } from 'carbon-icons-svelte'

	export let relativeWidth: number
	export let song: song | undefined = undefined
	export let deleteSong: (() => void) | undefined = undefined

	/** https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript */
	function stringToColour(input: string) {
		var hash = 0
		for (var i = 0; i < input.length; i++) {
			hash = input.charCodeAt(i) + ((hash << 5) - hash)
		}
		var colour = '#'
		for (var i = 0; i < 3; i++) {
			var value = (hash >> (i * 8)) & 0xff
			colour += ('00' + value.toString(16)).substr(-2)
		}
		return colour
	}

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
