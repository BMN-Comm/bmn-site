import { verifyUserLoggedIn } from '$lib/firebase/client/firebase'
import type { PageLoad } from './$types'
import * as fs from 'fs'
import { parse } from 'csv-parse/browser/esm'
import { masterlist } from '$lib/assets/masterlist.csv'

export const ssr = false

type masterlistSong = {
	title: string
	artist: string
	edition: string
	//url: string
}

export const load: PageLoad = async () => {
	console.log('hi')
	await verifyUserLoggedIn()
	console.log('hi2')
	let masterlistArray: masterlistSong[] = []
	const headers = ['Title', 'Artist', 'Edition'] //, 'Url']

	parse(masterlist, { delimiter: ',', columns: headers }, (error, result: masterlistSong[]) => {
		if (error) {
			console.log(error)
		}
		masterlistArray = result
	})

	console.log(masterlistArray)
	return { masterlistArray }
}
