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
		ToastNotification,
		Search,
		Modal
	} from 'carbon-components-svelte'
	import { doc, Timestamp } from 'firebase/firestore'
	import { createSongFromSuggestion } from '$lib/firebase/client/firestore/songs'
	import {
		getSpotifyToken,
		loginOnSpotify,
		searchTracks,
		type SpotifyTrack
	} from '$lib/spotify/spotifyApi'
	import type { PageData } from './$types'

	export let data: PageData

	let searchValue: string
	let tracks: SpotifyTrack[] | null | undefined = undefined
	let nextSearchOffset: number | null = null

	let title: string
	let artist: string
	let genre: string
	let link: string
	let remark: string
	let length: string

	let validLink = true
	let viaSpotify = false

	let modalOpen = false

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
			length,
			link,
			genre,
			remark,
			suggestionDate: Timestamp.now(),
			user: doc(db, 'users', $page.data.user!.databaseId)
		}

		createSongFromSuggestion(song)

		toasts.push(title)
		toasts = toasts

		title = ''
		artist = ''
		genre = ''
		link = ''
		remark = ''
		length = ''
		validLink = true
		viaSpotify = false
	}

	async function search() {
		if (!data.accessToken || searchValue.trim() === '') return

		let result = await searchTracks(data.accessToken, searchValue.trim())

		if (result === null) tracks = null
		else {
			tracks = result.tracks
			nextSearchOffset = result.nextOffset
		}
	}

	async function searchMore(offset: number) {
		if (searchValue.trim() === '') return

		let accessToken = await getSpotifyToken(data.spotifyCode!)
		let result = await searchTracks(accessToken, searchValue.trim(), offset)

		if (result === null) return
		else {
			if (tracks) {
				tracks = tracks.concat(result.tracks)
			} else tracks = result.tracks
			nextSearchOffset = result.nextOffset
		}
	}

	function openModalWith(track: SpotifyTrack) {
		title = track.name
		artist = track.artists.join(', ')
		genre = ''
		remark = ''
		length = msToLength(track.length_ms)
		link = track.link
		validLink = true
		viaSpotify = true

		modalOpen = true
	}

	function msToLength(ms: number) {
		let totalSeconds = Math.floor(ms / 1000)
		let minutes = Math.floor(totalSeconds / 60)
		let seconds = totalSeconds % 60
		return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`
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

<Modal
	modalHeading="Add song to suggestions"
	bind:open={modalOpen}
	primaryButtonText="Submit"
	hasForm
	selectorPrimaryFocus={viaSpotify ? '#genre' : '#title'}
	on:close={() => {
		modalOpen = false
	}}
	on:submit={async () => {
		await AddSuggestion()
		modalOpen = false
	}}
>
	<Form>
		<Grid padding>
			<Row>
				<Column sm={4} md={8} lg={5}>
					<TextInput
						bind:value={title}
						labelText="Title*"
						placeholder="Title"
						required
						id="title"
					/>
				</Column>
				<Column sm={4} md={8} lg={6}>
					<TextInput bind:value={artist} labelText="Artist(s)*" placeholder="Artist(s)" required />
				</Column>
				<Column sm={4} md={8} lg={5}>
					<TextInput
						bind:value={genre}
						labelText="Genre*"
						placeholder="Genre"
						required
						id="genre"
					/>
				</Column>
			</Row>
			<Row>
				<Column sm={4} md={4} lg={10}>
					<TextInput
						bind:value={link}
						labelText="Link*"
						placeholder="Song link"
						disabled={viaSpotify}
						required
						invalid={!validLink}
						invalidText={validLink ? undefined : 'Enter a valid link'}
					/>
				</Column>
				<Column sm={4} md={4} lg={6}>
					<TextInput
						bind:value={length}
						labelText="Length (mm:ss)*"
						placeholder="Enter the length of the song"
						disabled={viaSpotify}
						required
						pattern="[0-9][0-9]:[0-9][0-9]"
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
			</Row>
			<Row>
				<Column>* is required</Column>
			</Row>
		</Grid>
	</Form>
</Modal>

<Grid padding>
	<Row>
		<Column>
			<h1 class="titleText">Suggestions</h1>
		</Column>
	</Row>
	<Row>
		<Column>
			<p>
				Here you can suggest songs for the setlist. The committee will listen to them on the next
				setlist meeting. If you want to suggest a song that is not on Spotify, you can enter the
				details manually. Otherwise, you can search for it below. You do need a Spotify account to
				access this functionality.
			</p>
		</Column>
	</Row>
	{#if !data.spotifyCode}
		<Row>
			<Column>
				<Button on:click={async () => await loginOnSpotify()}>Log into Spotify</Button>
			</Column>
		</Row>
	{:else}
		<Row>
			<Column>
				<Search
					bind:value={searchValue}
					labelText="Search for a song on Spotify"
					placeholder="Search on Spotify"
					on:change={async () => {
						nextSearchOffset = null
						await search()
					}}
					on:clear={() => {
						searchValue = ''
						nextSearchOffset = null
						tracks = undefined
					}}
				/>
			</Column>
			<Column>
				<Button
					kind="secondary"
					on:click={() => {
						modalOpen = true
					}}
				>
					I don't want to use Spotify
				</Button>
			</Column>
		</Row>
		<!-- either null or undefined -->
		{#if !tracks}
			<Row>
				<Column>
					{tracks === undefined
						? 'Search for a song to see the Spotify results.'
						: 'No results found.'}
				</Column>
			</Row>
		{:else}
			{#each tracks as track}
				<Row>
					<Column width="20%">
						<img src={track.albumImageUrl} alt={`album cover ${track.name}`} width="80px" />
					</Column>
					<Column width="40%">
						<strong>{track.name}</strong>
						<br />
						{track.album}
					</Column>
					<Column width="20%">
						{track.artists.join(', ')}
					</Column>
					<Column width="20%">
						<Button on:click={() => openModalWith(track)}>Submit as suggestion</Button>
					</Column>
				</Row>
			{/each}
			{#if nextSearchOffset !== null}
				<Row>
					<Column>
						<Button kind="secondary" on:click={async () => searchMore(nextSearchOffset ?? 0)}>
							Load more
						</Button>
					</Column>
				</Row>
			{/if}
		{/if}
	{/if}
</Grid>

<style>
	:global(.textinput-column) {
		max-width: 300px;
	}
</style>
