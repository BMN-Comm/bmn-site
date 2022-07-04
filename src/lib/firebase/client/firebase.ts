import { browser } from '$app/env'
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, signOut as fbSignOut } from 'firebase/auth'
import { firebaseConfig } from '$lib/firebase/client/firbaseConfig'
import { session } from '$app/stores'

const app = initializeApp(firebaseConfig)
const firebaseAuth = getAuth(app)

firebaseAuth.onAuthStateChanged(async (user) => {
	if (browser) {
		if (user) {
			const token = await user.getIdToken()
			await setToken(token)
			session.update((oldSession) => {
				oldSession.user = {
					name: user.displayName,
					email: user.email,
					uid: user.uid
				}
				return oldSession
			})
		} else {
			await setToken('')
			session.update((oldSession) => {
				oldSession.user = undefined
				return oldSession
			})
		}
	}
})

/**
 * Set the authentication token in the cookies by utilizing the api
 * @param token The token to set
 */
async function setToken(token: string) {
	// We fetch from the api/token, because we need the server to set the cookie
	await fetch('/api/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: JSON.stringify({ token })
	})
}

/**
 * Sign in to firebase with the given email and password.
 * @param email The email of the user
 * @param password The password of the user
 */
async function signIn(email: string, password: string) {
	await signInWithEmailAndPassword(firebaseAuth, email, password)
}

/** Sign out of firebase */
async function signOut() {
	await fbSignOut(firebaseAuth)
}

export const auth = {
	signIn,
	signOut
}

export default app
