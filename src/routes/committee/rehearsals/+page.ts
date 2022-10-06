import type { PageLoad } from "./$types";
import { db } from "$lib/firebase/client/firebase";
import { query, collection, getDocs, deleteDoc, getDoc, doc, orderBy, where, Timestamp, collectionGroup } from "firebase/firestore";
import type { song } from "$lib/types/domain/song";
import type { rehearsal } from "$lib/types/domain/rehearsal"
import { DocumentSecurity } from "carbon-icons-svelte";

type rehearsalSong = {
    id: string
    startTime: Timestamp
    song: song
    endTime: Timestamp
}

export const load: PageLoad = async() => {

    let rehearsalDays : rehearsal[] = []

    const rehearsalsQuery = query(collection(db, 'rehearsals'), orderBy('startTime'))//, where('startTime', '>=', Timestamp.now()))
    const rehearsals = await getDocs(rehearsalsQuery)

    rehearsalDays = rehearsals.docs.map((doc) => {
        return {
            id: doc.id,
            ...doc.data()
        }
    })
    
    let songs = await loadSongs(rehearsalDays)

    for (let i = 0; i < songs.length; i++) {
        const day = songs[i];
        
        rehearsalDays[i].songsToRehearse = day[1]
    }
    return {rehearsalDays}
}

async function loadSongs(rehearsalDays: rehearsal[]) {

    let sngs: (rehearsal | rehearsalSong[])[][] = []

    for (let i = 0; i < rehearsalDays.length; i++) {
        const day = rehearsalDays[i];

        const songsQuery = query(collection(db, 'rehearsals/' + day.id + '/songsToRehearse'))
        const songs = await getDocs(songsQuery)

        let songsOnDay = songs.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data()
            }
        })
        sngs.push([day, songsOnDay])
    };

    return sngs
}

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
