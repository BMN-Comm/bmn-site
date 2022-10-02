import { db } from '$lib/firebase/client/firebase'
import admin from 'firebase-admin'
import type { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'
import { collection, deleteDoc, doc, setDoc } from 'firebase/firestore'
import { firebaseAdminConfig } from './firebaseConfig'

/** Initialize the firebase admin sdk with the admin config */
function initializeFirebase() {
	if (!admin.apps.length) {
		admin.initializeApp({
			credential: admin.credential.cert(firebaseAdminConfig)
			// databaseURL: `https://${firebaseAdminConfig.project_id}.firebaseio.com`
		})
	}
}

/** Verify and decode the given token */
export async function decodeToken(token: string): Promise<DecodedIdToken | null> {
	if (!token || token === 'null' || token === 'undefined') return null
	try {
		initializeFirebase()
		return await admin.auth().verifyIdToken(token)
	} catch (err) {
		console.log(err)
		return null
	}
}

/** Get all the firebase auth users in the current application */
export async function getAuthUsers() {
	try {
		initializeFirebase()
		return await admin.auth().listUsers()
	} catch (err) {
		console.log(err)
		return null
	}
}

/** Create a new user in the auth system, and the database */
export async function createUser(name: string, password: string, email: string) {
	initializeFirebase()
	await admin.auth().createUser({ email, password })
	const newUserDoc = doc(collection(db, 'users'))
	await setDoc(newUserDoc, { name, email })
}

/** Remove a user in the auth system, and the database */
export async function removeUser(dbUid: string, authUid: string) {
	initializeFirebase()
	await admin.auth().deleteUser(authUid)
	const docRef = doc(db, 'users', dbUid)
	deleteDoc(docRef)
}

/** Set for the given user id, the value of the given claim to true */
export async function setUserClaim(uid: string, claim: string) {
	return updateClaim(uid, claim, true)
}

/** For the given user id, remove the given claim */
export async function removeUserClaim(uid: string, claim: string) {
	return updateClaim(uid, claim, undefined)
}

/** Update the custom claims of a user to  */
async function updateClaim(uid: string, claim: string, value: true | undefined) {
	initializeFirebase()
	const currentClaims = (await admin.auth().getUser(uid)).customClaims ?? {}
	currentClaims[claim] = value
	return await admin.auth().setCustomUserClaims(uid, currentClaims)
}
