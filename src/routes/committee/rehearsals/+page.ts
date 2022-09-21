import type { PageLoad } from "./$types";
import { db } from "$lib/firebase/client/firebase";
import { query, collection, getDocs, deleteDoc, getDoc, doc, orderBy } from "firebase/firestore";

export const load: PageLoad = async() => {
    const rehearsalsQuery = query(collection(db, 'rehearsals'), orderBy('startTime'))
    const rehearsals = await getDocs(rehearsalsQuery)

    return {
        rehearsals: rehearsals.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data()
            }
        })
    }
}