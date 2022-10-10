import type { PageLoad } from './$types'
import { db } from '$lib/firebase/client/firebase'
import { query, collection, getDocs, orderBy } from 'firebase/firestore'
import type { rehearsal } from '$lib/types/domain/rehearsal'

export const load: PageLoad = async () => {
	const rehearsalsQuery = query(collection(db, 'rehearsals'), orderBy('startTime')) //, where('startTime', '>=', Timestamp.now()))
	const rehearsals = (await getDocs(rehearsalsQuery)).docs.map(
		(doc) => ({ id: doc.id, ...doc.data() } as rehearsal)
	)

	return { rehearsals }
}

// TODO: Delete alles hieronder maar als je klaar bent, zou iig hier niet gedaan moeten worden

// async function loadSongs(rehearsalDays: rehearsal[]) {
// 	// let songs: (rehearsal | rehearsalSong[])[][] = []

// 	const songQuery = query(collectionGroup(db, 'songsToRehearse'))
// 	const songs = await getDocs(songQuery)
// 	console.log(songs.docs[0].ref.parent,)

// 	// for (let i = 0; i < rehearsalDays.length; i++) {
// 	// 	const day = rehearsalDays[i]

// 	// 	const songsQuery = query(collection(db, 'rehearsals/' + day.id + '/songsToRehearse'))
// 	// 	const songs = await getDocs(songsQuery)

// 	// 	let songsOnDay = songs.docs.map((doc) => {
// 	// 		return {
// 	// 			id: doc.id,
// 	// 			...doc.data()
// 	// 		}
// 	// 	})
// 	// 	songs.push([day, songsOnDay])
// 	// }

// 	// return songs
// }

//     return {
//         rehearsals: rehearsals.docs.map(async (docs) => {
//             const songsQuery = query(collection(db, 'rehearsals/' + docs.id + '/songsToRehearse'), orderBy('startTime'))
//             const songs = await getDocs(songsQuery)
//             let songsToRehearse: rehearsalSong[] = []

//             songs.docs.map(async (s) => {
//                 let song: rehearsalSong = s.data() as rehearsalSong

//                 const songRef = doc(db, 'songs', song.song.id)
//                 const sng = await getDoc(songRef)

//                 song.song = sng.data() as song
//                 songsToRehearse.push(song)
//             })

//             return {
//                 id: docs.id,
//                 ...docs.data(),
//                 songsToRehearse,
//             }
//         })
//     }
