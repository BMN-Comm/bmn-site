import type { PageLoad } from './$types'
import { verifyUserLoggedIn } from '$lib/firebase/client/firebase'
import { getSuggestedSongs } from '$lib/firebase/client/firestore/songs'
import { getUsers } from '$lib/firebase/client/firestore/users'

export const ssr = false

export const load: PageLoad = async () => {
	await verifyUserLoggedIn()

	// Get all the suggestions
	const suggestions = await getSuggestedSongs()

	// Get all the users
	const users = await getUsers()

	// Bundle and return all data
	return {
		suggestions,
		users
	}
}

export const _exportSuggestions = async () => {
	let csv = "Submitter,Title,Artist,Timestamp,Link,Notes,OnSong\n"
	const suggestions = await getSuggestedSongs()
	const usersl = await getUsers()
	for(const suggestion of suggestions) {
		const name = usersl.find((user : any) => user.id === suggestion.user.id)?.name ?? 'Unknown'
		const remarktrimmed = suggestion.remark?.replace(/(\r\n|\n|\r)/gm, " ") ?? '';
		const selfontrimmed = suggestion.selfOn?.replace(/(\r\n|\n|\r)/gm, " ") ?? '';
		const rankparsed = suggestion.rank?.toString() ?? ''
		csv += `"${name}","${suggestion.name}","${suggestion.artist}",${rankparsed},"${suggestion.suggestionDate.toDate()}","${suggestion.link || ''}","${remarktrimmed}","${selfontrimmed}"\n`
	}
	downloadCSV();

	function downloadCSV() {
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		a.download = 'data.csv';
		a.click();

		URL.revokeObjectURL(url); // cleanup
	}
}