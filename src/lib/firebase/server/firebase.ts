import admin from 'firebase-admin'
import type { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'
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

/** Get all the users in the current application */
export async function getUsers() {
	try {
		initializeFirebase()
		return await admin.auth().listUsers()
	} catch (err) {
		console.log(err)
		return null
	}
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
