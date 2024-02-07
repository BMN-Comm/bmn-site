import { getSpotifyUserData, getSpotifyToken } from '$lib/spotify/spotifyApi'
import type { PageLoad } from './$types'

export const ssr = false

export const load: PageLoad = async () => {
	// On page load, try to fetch auth code from current browser search URL
	const args = new URLSearchParams(window.location.search)
	console.log({ href: window.location.href })
	const spotifyAuthCode = args.get('code')

	// If we find a code, we're in a callback, do a token exchange
	let accessToken = null
	if (spotifyAuthCode) {
		// Remove code from URL so we can refresh correctly.
		const url = new URL(window.location.href)
		console.log({ url })
		url.searchParams.delete('code')
		console.log({ url })

		const updatedUrl = url.search ? url.href : url.href.replace('?', '')
		window.history.replaceState({}, document.title, updatedUrl)

		// Save the auth code to local storage
		localStorage.setItem('spotify_auth_code', spotifyAuthCode)
		accessToken = await getSpotifyToken()
		console.log({ localStorage })
	}

	// If we have a token, we're logged in, so fetch user data and render logged in template
	const spotifyUserData = accessToken ? await getSpotifyUserData(accessToken) : null

	return { accessToken, spotifyUserData }
}
