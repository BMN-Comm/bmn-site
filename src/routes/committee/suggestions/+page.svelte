<script lang="ts">
	import {
		Button,
		Checkbox,
		Column,
		Grid,
		Modal,
		Row,
		StructuredList,
		StructuredListCell,
		StructuredListHead,
		StructuredListRow
	} from 'carbon-components-svelte'
	import { Bat, Chat, Favorite, MusicAdd, MusicRemove } from 'carbon-icons-svelte'
	import { arrayUnion, arrayRemove, deleteDoc, doc, updateDoc } from 'firebase/firestore'
	import { db } from '$lib/firebase/client/firebase'
	import PlayLinkButton from '$lib/components/playLinkButton.svelte'
	import { invalidateAll } from '$app/navigation'
	import type { PageData } from './$types'

	export let data: PageData

	let openRemark = false
	let openDel = false
	let openAdd = false
	let filterFavourites = false
	let remarkText: string
	let selectedSong: number

	/** Remove a suggestion */
	async function RemoveSuggestion() {
		const docRef = doc(db, 'songs', data.suggestions[selectedSong].song.id)
		await deleteDoc(docRef)

		invalidateAll()
	}

	async function addToSetlist() {
		// TODO: Use current edition
		const editionRef = doc(db, 'editions', 'ZI3Eab1mXjHvCUS47o40')
		updateDoc(editionRef, {
			songs: arrayUnion(doc(db, 'songs', data.suggestions[selectedSong].song.id))
		})
		invalidateAll()
	}

	async function FavouriteSong(songId: string) {
		// TODO: use current committee
		const committeeRef = doc(db, 'committees', 'yAUoMLjaAoC6L5O9F4gU')
		const songRef = doc(db, 'songs', songId)
		await updateDoc(committeeRef, {
			likesSongs: arrayUnion(songRef)
		})
		invalidateAll()
	}

	async function UnfavouriteSong(songId: string) {
		// TODO: use current committee
		const committeeRef = doc(db, 'committees', 'yAUoMLjaAoC6L5O9F4gU')
		const songRef = doc(db, 'songs', songId)
		await updateDoc(committeeRef, {
			likesSongs: arrayRemove(songRef)
		})
		invalidateAll()
	}
</script>

<Grid>
	<Row>
		<Column>
			<h1 class="titleText">Suggestions</h1>
			<Checkbox
				labelText="Filter Favourites"
				on:change={() => {
					filterFavourites = !filterFavourites
				}}
			/>
		</Column>
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
			{#if (filterFavourites && data.favouriteSongs[song.id]) || !filterFavourites}
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
							class={data.favouriteSongs[song.id] ? 'yesFave' : 'noFave'}
							on:click={data.favouriteSongs[song.id]
								? () => {
										UnfavouriteSong(song.id)
								  }
								: () => {
										FavouriteSong(song.id)
								  }}
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
			{/if}
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
	:global(.yesFave) {
		background-color: #b81921 !important;
		border-color: #b81921 !important;
		color: white !important;
	}
</style>
