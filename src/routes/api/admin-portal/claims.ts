/* eslint-disable @typescript-eslint/no-explicit-any */
import { removeUserClaim, setUserClaim } from '$lib/firebase/server/firebase'
import type { RequestHandler } from '@sveltejs/kit'

/** Set the given claim for the given user */
export const post: RequestHandler = async ({ request }) => {
	const { uid, claim }: { uid: string; claim: string } = await request.json()

	try {
		await setUserClaim(uid, claim)

		return { status: 200 }
	} catch (e: any) {
		return { status: 500, error: e.message }
	}
}

/** Removed the given claim for the given user */
export const del: RequestHandler = async ({ request }) => {
	const { uid, claim }: { uid: string; claim: string } = await request.json()

	try {
		await removeUserClaim(uid, claim)

		return { status: 200 }
	} catch (e: any) {
		return { status: 500, statusText: e.message }
	}
}
