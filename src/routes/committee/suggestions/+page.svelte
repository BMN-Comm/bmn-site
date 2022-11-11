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
	import type { song } from '$lib/types/domain/song'
	import { Bat, Chat, Favorite, MusicRemove, PlayFilledAlt } from 'carbon-icons-svelte'
	import { arrayRemove, arrayUnion, deleteDoc, doc, updateDoc } from 'firebase/firestore'
	import { db } from '$lib/firebase/client/firebase'
	import { isValidUrl } from '$lib/util/urlValidation'

	export let data: {
		suggestions: { song: song; user: string }[]
		favouriteSongs: { [songId: string]: { favourite: boolean } }
	}

	let openRemark = false
	let openDel = false
	let filterFavourites = false
	let remarkText: string
	let selectedSong: number

	/** Remove a suggestion */
	async function RemoveSuggestion() {
		const docRef = doc(db, 'songs', data.suggestions[selectedSong].song.id)
		await deleteDoc(docRef)

		data.suggestions.splice(selectedSong, 1)
	}

	async function FavouriteSong(songId: string) {
		// TODO: use current committee
		const committeeRef = doc(db, 'committees', 'yAUoMLjaAoC6L5O9F4gU')
		const songRef = doc(db, 'songs', songId)
		await updateDoc(committeeRef, {
			likesSongs: arrayUnion(songRef)
		})
		data.favouriteSongs[songId] = { favourite: true }
	}

	async function UnfavouriteSong(songId: string) {
		// TODO: use current committee
		const committeeRef = doc(db, 'committees', 'yAUoMLjaAoC6L5O9F4gU')
		const songRef = doc(db, 'songs', songId)
		await updateDoc(committeeRef, {
			likesSongs: arrayRemove(songRef)
		})
		data.favouriteSongs[songId] = { favourite: false }
	}
</script>

<Grid>
	<Row>
		<Column
			><h1 class="titleText">Suggestions</h1>
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
						{@const validUrl = isValidUrl(song.link)}
						<Button
							href={validUrl ? song.link : undefined}
							kind="ghost"
							size="small"
							iconDescription={validUrl ? song.link : 'Invalid URL'}
							icon={PlayFilledAlt}
							disabled={!validUrl}
						/>
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
	.titleText {
		font-size: x-large;
	}
	:global(.yesFave) {
		background-color: #b81921 !important;
		border-color: #b81921 !important;
		color: white !important;
	}
</style>
