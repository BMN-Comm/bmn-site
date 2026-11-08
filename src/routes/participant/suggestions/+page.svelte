<script lang="ts">
	import { db } from '$lib/firebase/client/firebase'
	import { page } from '$app/stores'
	import { isValidUrl } from '$lib/util/urlValidation'
	import {
		Grid,
		Row,
		Column,
		TextInput,
		Button,
		Form,
		TextArea,
		ToastNotification, Checkbox, Dropdown,
		StructuredListCell,
		StructuredListHead,
		StructuredListRow,
	} from 'carbon-components-svelte'
	import {deleteDoc, doc, Timestamp} from 'firebase/firestore'
	import {createSongFromSuggestion, getSuggestedSongs} from '$lib/firebase/client/firestore/songs'
	import {text} from "svelte/internal";
	import {Accessibility, Chat, Favorite, MusicAdd, MusicRemove} from "carbon-icons-svelte";
	import ScrollableList from "$lib/components/scrollableList.svelte";
	import PlayLinkButton from "$lib/components/playLinkButton.svelte";
	import {Modal} from "carbon-components-svelte";
	import type {PageData} from "../../../../.svelte-kit/types/src/routes/committee/suggestions/$types";
	import type {SuggestedSong} from "$lib/types/domain/song";
	import {invalidateAll} from "$app/navigation";

	let title: string
	let artist: string
	let link: string
	let remark: string
	let selfOn: string
	let rank: number

	let openRemark = false
	let openDel = false
	let openAdd = false
	let remarkText: string
	let selectedSongIndex: number

	export let data: PageData

	$: validLink = true

	export let toasts: string[] = []

	async function AddSuggestion() {
		// TODO: Show error if failed
		if (!isValidUrl(link)) {
			console.log('invalid')
			validLink = false
			return
		}

		let song = {
			name: title,
			artist,
			link,
			remark,
			selfOn,
			rank,
			suggestionDate: Timestamp.now(),
			user: doc(db, 'users', $page.data.user!.databaseId)
		}
		let id = undefined
		try {
			let idf = await createSongFromSuggestion(song)
			id = idf
		} catch (e) {
			id = undefined
		}

		if(id == undefined)
		{
			toasts.push('Failed to add song')
			console.log(song)
			return
		}

		toasts.push(title)
		toasts = toasts
		
		title = ''
		artist = ''
		link = ''
		remark = ''
		selfOn = ''
		rank = 4
		validLink = true
	}


	/** Remove a suggestion */
	async function RemoveSuggestion() {
		const docRef = doc(db, 'songs', data.suggestions[selectedSongIndex].id)
		await deleteDoc(docRef)

		invalidateAll()
	}
</script>

{#each toasts as toast, i}
	<!-- TODO: Toasts are badly implemented -->
	<ToastNotification
		lowContrast
		timeout={5000}
		kind="success"
		title="Success"
		subtitle="Song added:"
		caption={toast}
		on:close={(e) => {
			toasts = toasts.splice(i, 1)
		}}
	/>
{/each}

<Form
	on:submit={(e) => {
		e.preventDefault()
		AddSuggestion()
	}}
>
	<Grid padding>
		<Row>
			<Column><h1>Add a suggestion</h1></Column>
		</Row>
		<Row>
			<Column>
				<Row>
					<Column sm={4} md={8} lg={5}>
						<TextInput bind:value={title} labelText="Title*" placeholder="Title" required />
					</Column>
					<Column sm={4} md={8} lg={6}>
						<TextInput bind:value={artist} labelText="Artist*" placeholder="Artist" required />
					</Column>
				</Row>
				<Row>
					<Column sm={4} md={4} lg={10}>
						<TextInput
							bind:value={link}
							labelText="Link*"
							placeholder="Song link"
							required
							invalid={!validLink}
							invalidText={validLink ? undefined : 'Enter a valid link'}
						/>
					</Column>
				</Row>
			</Column>
			<Column>
				<Dropdown
						bind:selectedId={rank}
						on:select={(e) => rank = e.detail.selectedId}
						invalidText="invalid selection"
						items={[
						  {id: 1, text: 'Illustrates my taste, but not for the setlist'},
						  {id: 2, text: 'Fun, but doesn have to include me'},
						  {id: 3, text: 'Would be fun to play this'},
						  {id: 4, text: 'Want to play this'},
						  {id: 5, text: 'Do this with me, or not at all'}
						]}
						label="Rank*"
						titleText="Rank*"
						type="default"
				/>
			</Column>
		</Row>
		<Row>
			<Column>
				<TextArea
					bind:value={remark}
					labelText="Remarks"
					placeholder="Room for remarks"
					maxCount={255}
				/>
			</Column>
			<Column>
				<TextArea
					bind:value={selfOn}
					labelText="Which part do you want to play most?"
					placeholder="Elaborate if necessary"
					maxCount={255}
				/>
			</Column>
		</Row>
		<Row>
			<Column>* is required</Column>
		</Row>
		<Row>
			<Column>
				<Button type="submit">submit</Button>
			</Column>
		</Row>
	</Grid>
</Form>
<div>
 In the remarks, please put important details like possible challenges/opportunities <br>
	for exotic instruments, timestamps we should listen to, if we should consider a specific <br>
	version, and/or if you want this specific artist or just something in that general direction.<br>
	In the box for parts, please also mention which instrument you prefer if you were accepted on<br>
	multiple.<br>

	<h3>Your suggestions:</h3>
</div>
<Grid>
	<ScrollableList>
		<StructuredListHead>
			<StructuredListRow head>
				<StructuredListCell head>User</StructuredListCell>
				<StructuredListCell head>Title</StructuredListCell>
				<StructuredListCell head>Artist</StructuredListCell>
				<StructuredListCell head>Timestamp</StructuredListCell>
				<StructuredListCell head>Rank</StructuredListCell>
				<StructuredListCell head>Link</StructuredListCell>
				<StructuredListCell head>Options</StructuredListCell>
			</StructuredListRow>
		</StructuredListHead>
		{#each data.suggestions as song, i}
			{#if song.user.id === data.user?.databaseId}
				<StructuredListRow>
					<StructuredListCell>
						{data.user.name ?? 'Unknown'}
					</StructuredListCell>
					<StructuredListCell>
						{song.name}
					</StructuredListCell>
					<StructuredListCell>
						{song.artist}
					</StructuredListCell>
					<StructuredListCell>
						{song.suggestionDate.toDate()}
					</StructuredListCell>
					<StructuredListCell>
						{song.rank}
					</StructuredListCell>
					<StructuredListCell>
						<PlayLinkButton url={song.link} />
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
						{#if song.selfOn && song.selfOn.length > 0}
							<Button
									kind="tertiary"
									size="small"
									iconDescription="Wants to Play"
									icon={Accessibility}
									on:click={() => {
									remarkText = song.selfOn
									openRemark = true
								}}
							/>
						{/if}
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
	:global(.textinput-column) {
		max-width: 300px;
	}
</style>
