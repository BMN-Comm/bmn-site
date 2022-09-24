import type { PageLoad } from "./$types";
import { db } from "$lib/firebase/client/firebase";
import { query, collection, getDocs, deleteDoc, getDoc, doc, orderBy, where, Timestamp } from "firebase/firestore";
import type { song } from "$lib/types/domain/song";

type rehearsalSong = {
    id: string
    startTime: Timestamp
    song: song
    endTime: Timestamp
}

export const load: PageLoad = async() => {
    const rehearsalsQuery = query(collection(db, 'rehearsals'), orderBy('startTime'))//, where('startTime', '>=', Timestamp.now()))
    const rehearsals = await getDocs(rehearsalsQuery)

    return {
        rehearsals: rehearsals.docs.map(async (docs) => {
            const songsQuery = query(collection(db, 'rehearsals/' + docs.id + '/songsToRehearse'), orderBy('startTime'))
            const songs = await getDocs(songsQuery)
            let songsToRehearse: rehearsalSong[] = []
            
            songs.docs.map(async (s) => {
                let song: rehearsalSong = s.data() as rehearsalSong

                const songRef = doc(db, 'songs', song.song.id)
                const sng = await getDoc(songRef)

                song.song = sng.data() as song
                songsToRehearse.push(song)
            })


            return {
                id: docs.id,
                ...docs.data(),
                songsToRehearse,
            }
        })
    }
}