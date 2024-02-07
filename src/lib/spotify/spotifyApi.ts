export type SpotifyTrackSearchResult = {
	tracks: SpotifyTrack[] | null
	nextOffset: number
}

export type SpotifyTrack = {
	name: string
	artists: string[]
	length_ms: number
	link: string
	album: string
	albumImageUrl: string
}

export async function searchTracks(access_token: string, search: string, offset = 0) {
	const limit = 10

	const searchEncoded = encodeURIComponent(search)
	const response = await fetch(
		`https://api.spotify.com/v1/search?q=${searchEncoded}&type=track&market=NL&limit=${limit}&offset=${offset}`,
		{
			method: 'GET',
			headers: { Authorization: 'Bearer ' + access_token }
		}
	)

	const tracks: SpotifyTrack[] | null =
		(await response
			.json()
			.then((data) => JSON.parse(JSON.stringify(data)))
			.then((data) => {
				console.log(data)
				return data
			})
			.then((data) =>
				data.tracks?.items?.map((track: any) => {
					return {
						name: track.name,
						artists: track.artists.map((artist: any) => artist.name),
						length_ms: track.duration_ms,
						link: track.external_urls.spotify,
						album: track.album.name,
						albumImageUrl: track.album.images[1].url // 0 => 600px, 1 => 300px, 2 => 64px
					}
				})
			)) ?? null

	const nextOffset = tracks?.length === limit ? offset + limit : null

	return tracks ? { tracks, nextOffset } : null
}

///////////////////////////
///////////////////////////

/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code with PKCE oAuth2 flow to authenticate
 * against the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
 */
const clientId = '80bf06287c9d47ef9f8e6a6c5e7c765c'
const SPOTIFY_REDIRECT_URL = 'http://localhost:5173/participant/suggestions'

const SPOTIFY_AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'
const SPOTIFY_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'
const scope = ''

async function redirectToSpotifyAuthorize() {
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	const randomValues = crypto.getRandomValues(new Uint8Array(64))
	const codeVerifier = randomValues.reduce((acc, x) => acc + possible[x % possible.length], '')

	const data = new TextEncoder().encode(codeVerifier)
	const hashed = await crypto.subtle.digest('SHA-256', data)

	const codeChallengeBase64 = window
		.btoa(String.fromCharCode(...new Uint8Array(hashed)))
		.replace(/=/g, '')
		.replace(/\+/g, '-')
		.replace(/\//g, '_')

	window.localStorage.setItem('code_verifier', codeVerifier)

	const authUrl = new URL(SPOTIFY_AUTH_ENDPOINT)
	const params = {
		response_type: 'code',
		client_id: clientId,
		scope: scope,
		code_challenge_method: 'S256',
		code_challenge: codeChallengeBase64,
		redirect_uri: SPOTIFY_REDIRECT_URL
	}

	authUrl.search = new URLSearchParams(params).toString()
	window.location.href = authUrl.toString() // Redirect the user to the authorization server for login
}

function saveResponse(response: { accessToken: string; refreshToken: string; expiresIn: number }) {
	const { accessToken, refreshToken, expiresIn } = response
	localStorage.setItem('access_token', accessToken)
	localStorage.setItem('refresh_token', refreshToken)

	const now = new Date()
	const expiry = new Date(now.getTime() + expiresIn * 1000)
	localStorage.setItem('expires', expiry.toString())
}

// Soptify API Calls
export async function getSpotifyToken(): Promise<string> {
	// Get the auth code from local storage
	const auth_code = localStorage.getItem('spotify_auth_code')
	if (!auth_code) return Promise.reject('No auth code found.')

	// If the token is already in local storage and not yet expired, return it
	const spotifyToken = localStorage.getItem('spotify_token')
	const expires = localStorage.getItem('expires')
	if (spotifyToken && expires && new Date(expires) > new Date()) return JSON.parse(spotifyToken)

	// If there is a token, but it is expired, refetch it. Otherwise, if there is no token, fetch it
	const refreshToken = localStorage.getItem('refresh_token')
	const codeVerifier = localStorage.getItem('code_verifier')

	// Fail if both are null
	if (!refreshToken && !codeVerifier)
		return Promise.reject('No refresh code and no code verifier found.')

	// Otherwise get the payload for the fetch request
	const payload = refreshToken
		? {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: new URLSearchParams({
					grant_type: 'refresh_token',
					refresh_token: refreshToken,
					client_id: clientId
				} as Record<string, string>)
		  }
		: {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: new URLSearchParams({
					client_id: clientId,
					grant_type: 'authorization_code',
					code: auth_code,
					redirect_uri: SPOTIFY_REDIRECT_URL,
					code_verifier: codeVerifier! // Can only be null if refreshToken is not null, in which case the above branch is taken
				})
		  }

	// (Re)fetch the token and return the response
	const body = await fetch(SPOTIFY_TOKEN_ENDPOINT, payload)
	const response = await body.json()
	saveResponse(response)

	return response.accessToken
}

// async function refreshSpotifyToken(refresh_token: string) {
// 	const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
// 		method: 'POST',
// 		headers: {
// 			'Content-Type': 'application/x-www-form-urlencoded'
// 		},
// 		body: new URLSearchParams({
// 			client_id: clientId,
// 			grant_type: 'refresh_token',
// 			refresh_token
// 		})
// 	})

// 	return await response.json()
// }

export async function getSpotifyUserData(access_token: string) {
	const response = await fetch('https://api.spotify.com/v1/me', {
		method: 'GET',
		headers: { Authorization: 'Bearer ' + access_token }
	})

	return await response.json()
}

// Click handlers
export async function loginOnSpotify() {
	await redirectToSpotifyAuthorize()
}

// export async function logoutOnSpotify() {
// 	localStorage.clear()
// 	window.location.href = SPOTIFY_REDIRECT_URL
// }

// export async function refreshSpotifyTokenClick(currentToken: {
// 	refresh_token: string
// 	save: (response: { access_token: string; refresh_token: string; expires_in: number }) => void
// }) {
// 	const newToken = await refreshSpotifyToken(currentToken.refresh_token)
// 	currentToken.save(newToken)
// }
