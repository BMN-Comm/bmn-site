import { verifyUserLoggedIn } from '$lib/firebase/client/firebase'
import type { PageLoad } from './$types'
import * as fs from 'fs'
import { parse } from 'csv-parse'

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
	let masterlist: masterlistSong[] = []
	const headers = ['Title', 'Artist', 'Edition'] //, 'Url']

	fs.createReadStream('static/Masterlist.csv').pipe(
		parse({
			delimiter: ',',
			columns: headers
		}).on('data', function (row) {
			masterlist.push(row)
		})
	)

	return { masterlist }
}
