<script lang="ts">
	import {
		Button,
		Checkbox,
		Column,
		Grid,
		Modal,
		Row,
		StructuredListCell,
		StructuredListHead,
		StructuredListRow
	} from 'carbon-components-svelte'
	import { Bat, Chat, Favorite, MusicAdd, MusicRemove } from 'carbon-icons-svelte'
	import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
	import { db } from '$lib/firebase/client/firebase'
	import PlayLinkButton from '$lib/components/playLinkButton.svelte'
	import ScrollableList from '$lib/components/scrollableList.svelte'
	import { invalidateAll } from '$app/navigation'
	import type { PageData } from './$types'
	import { addSongToSetlist } from '$lib/firebase/client/firestore/songs'

	export let data: PageData

	let openRemark = false
	let openDel = false
	let openAdd = false
	let filterFavourites = false
	let remarkText: string
	let selectedSongIndex: number

	/** Remove a suggestion */
	async function RemoveSuggestion() {
		const docRef = doc(db, 'songs', data.suggestions[selectedSongIndex].id)
		await deleteDoc(docRef)

		invalidateAll()
	}

	async function addToSetlist() {
		addSongToSetlist(data.suggestions[selectedSongIndex].id)
		invalidateAll()
	}

	async function FavouriteSong(songId: string) {
		const songRef = doc(db, 'songs', songId)
		await updateDoc(songRef, {
			liked: true
		})
		invalidateAll()
	}

	async function UnfavouriteSong(songId: string) {
		const songRef = doc(db, 'songs', songId)
		await updateDoc(songRef, {
			liked: false
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

	<ScrollableList>
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
		{#each data.suggestions as song, i}
			{#if song.liked || !filterFavourites}
				<StructuredListRow>
					<StructuredListCell>
						{data.users.find((user) => user.id === song.user.id)?.name ?? 'Unknown'}
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
							class={song.liked ? 'yesFave' : 'noFave'}
							on:click={() => {
								song.liked ? UnfavouriteSong(song.id) : FavouriteSong(song.id)
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
								selectedSongIndex = i
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
								selectedSongIndex = i
								openAdd = true
							}}
							class={song.user.id === '3ClGLhR2ctxg6ZPn0Ls7' ? 'ilanButton' : 'addButton'}
						/>
					</StructuredListCell>
				</StructuredListRow>
			{/if}
		{/each}</ScrollableList
	>
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
	<p>Add {data.suggestions[selectedSongIndex]?.name} to setlist?</p>
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
	<p>Delete {data.suggestions[selectedSongIndex]?.name}?</p>
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
