<script lang="ts">
	import {
		Button,
		Column,
		Grid,
		Modal,
		Row,
		StructuredList,
		StructuredListCell,
		StructuredListHead,
		StructuredListRow
	} from 'carbon-components-svelte'
	import type { song } from '$lib/types/domain/song'
	import { Bat, Chat, Favorite, MusicAdd, MusicRemove } from 'carbon-icons-svelte'
	import { arrayUnion, deleteDoc, doc, updateDoc } from 'firebase/firestore'
	import { db } from '$lib/firebase/client/firebase'
	import PlayLinkButton from '$lib/components/playLinkButton.svelte'

	export let data: { suggestions: { song: song; user: string }[] }

	let openRemark = false
	let openDel = false
	let openAdd = false
	let remarkText: string
	let selectedSong: number

	/** Remove a suggestion */
	async function RemoveSuggestion() {
		const docRef = doc(db, 'songs', data.suggestions[selectedSong].song.id)
		await deleteDoc(docRef)

		data.suggestions.splice(selectedSong, 1)
		data.suggestions = data.suggestions
	}

	async function addToSetlist() {
		// TODO: Use current edition
		const editionRef = doc(db, 'editions', 'ZI3Eab1mXjHvCUS47o40')
		updateDoc(editionRef, {
			songs: arrayUnion(doc(db, 'songs', data.suggestions[selectedSong].song.id))
		})
	}
</script>

<Grid>
	<Row>
		<Column><h1 class="titleText">Suggestions</h1></Column>
	</Row>

	<StructuredList condensed>
		<StructuredListHead>
			<StructuredListRow head>
				<StructuredListCell head>User</StructuredListCell>
				<StructuredListCell head>Title</StructuredListCell>
				<StructuredListCell head>Artist</StructuredListCell>
				<StructuredListCell head>Genre</StructuredListCell>
				<StructuredListCell head>Link</StructuredListCell>
				<StructuredListCell head>Favo</StructuredListCell>
				<StructuredListCell head>Options</StructuredListCell>
			</StructuredListRow>
		</StructuredListHead>
		{#each data.suggestions as { song, user }, i}
			<StructuredListRow>
				<StructuredListCell>
					{user}
				</StructuredListCell>
				<StructuredListCell>
					{song.name}
				</StructuredListCell>
				<StructuredListCell>
					{song.artist}
				</StructuredListCell>
				<StructuredListCell>
					{song.genre}
				</StructuredListCell>
				<StructuredListCell>
					<PlayLinkButton url={song.link} />
				</StructuredListCell>
				<StructuredListCell>
					<Button
						kind="danger-tertiary"
						size="small"
						iconDescription="Like"
						icon={song.user.id === 'KcRkWMQUEClLEeiccSD5' ? Bat : Favorite}
					/>
				</StructuredListCell>
				<StructuredListCell>
					<Button
						kind="danger-tertiary"
						size="small"
						iconDescription="Delete"
						icon={MusicRemove}
						on:click={() => {
							selectedSong = i
							openDel = true
						}}
					/>
					{#if song.remark && song.remark.length > 0}
						<Button
							kind="tertiary"
							size="small"
							iconDescription="Remarks"
							icon={Chat}
							on:click={() => {
								remarkText = song.remark
								openRemark = true
							}}
						/>
					{/if}
					<Button
						kind="secondary"
						size="small"
						iconDescription="Add to setlist"
						icon={MusicAdd}
						on:click={() => {
							selectedSong = i
							openAdd = true
						}}
						class={song.user.id === '3ClGLhR2ctxg6ZPn0Ls7' ? 'ilanButton' : 'addButton'}
					/>
				</StructuredListCell>
			</StructuredListRow>
		{/each}
	</StructuredList>
</Grid>

<Modal passiveModal modalHeading="Remark" bind:open={openRemark}>
	<p>{remarkText}</p>
</Modal>

<Modal
	modalHeading="Add to setlist"
	bind:open={openAdd}
	primaryButtonText="Add"
	primaryButtonIcon={MusicAdd}
	secondaryButtonText="Cancel"
	on:click:button--primary={() => {
		addToSetlist()
		openAdd = false
	}}
	on:click:button--secondary={() => {
		openAdd = false
	}}
>
	<p>Add {data.suggestions[selectedSong]?.song.name} to setlist?</p>
</Modal>

<Modal
	danger
	modalHeading="Delete suggestion"
	primaryButtonText="Delete"
	primaryButtonIcon={MusicRemove}
	secondaryButtonText="Cancel"
	bind:open={openDel}
	on:click:button--primary={() => {
		RemoveSuggestion()
		openDel = false
	}}
	on:click:button--secondary={() => {
		openDel = false
	}}
>
	<p>Delete {data.suggestions[selectedSong]?.song.name}?</p>
</Modal>

<style>
	@import '/src/style/rainbow.css';
	.titleText {
		font-size: x-large;
	}

	:global(.addButton) {
		border-color: rgba(41, 252, 101, 255) !important;
		background-color: rgba(0, 0, 0, 0) !important;
		color: rgba(41, 252, 101, 255) !important;
	}

	:global(.ilanButton) {
		animation: rainbow 2.5s linear !important;
		animation-iteration-count: infinite !important;
		background-color: rgba(0, 0, 0, 0) !important;
	}
</style>
