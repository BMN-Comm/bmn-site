import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, signInWithEmailAndPassword, signOut as fbSignOut, type User } from 'firebase/auth'
import { firebaseConfig } from '$lib/firebase/client/firbaseConfig'
import { invalidateAll } from '$app/navigation'
import { error } from '@sveltejs/kit'

const app = initializeApp(firebaseConfig)
const firebaseAuth = getAuth(app)

let currentUser: User | undefined | null

firebaseAuth.onAuthStateChanged(async (user) => {
	currentUser = user
	const currentTime = new Date(Date.now())
	if (currentUser) {
		const token = await currentUser.getIdTokenResult()
		// If the token was just issued, we should refresh it on the server, offset it with one hour because
		if (new Date(Date.parse(token.issuedAtTime)) > currentTime) {
			setToken(token.token, currentUser)
		}
	}
})

/**
 * Set the authentication token in the cookies by utilizing the api
 * @param token The token to set
 */
async function setToken(token: string, user?: User) {
	// We fetch from the api/token, because we need the server to set the cookie
	await fetch('/api/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: JSON.stringify({ token, user })
	})
}

/**
 * Sign in to firebase with the given email and password.
 * @param email The email of the user
 * @param password The password of the user
 */
async function signIn(email: string, password: string) {
	const user = (await signInWithEmailAndPassword(firebaseAuth, email, password)).user
	const token = await user.getIdToken()
	await setToken(token, user)
	invalidateAll()
}

/** Sign out of firebase */
async function signOut() {
	await fbSignOut(firebaseAuth)
	await setToken('')
	invalidateAll()
	window.location.replace('/')
}

export const auth = {
	signIn,
	signOut
}

export default app

/** Wait until the user is logged in */
export async function verifyUserLoggedIn() {
	// Wait for auth to be initialized
	while (currentUser === undefined) await new Promise((r) => setTimeout(r, 100))

	// Return 404 if user is not logged in
	if (currentUser === null) throw error(404)
	else return Promise.resolve()
}

export const db = getFirestore(app)
