import type { PageLoad } from "./$types";
import { db } from "$lib/firebase/client/firebase";
import { query, collection, getDocs, deleteDoc, getDoc, doc, orderBy } from "firebase/firestore";

export const load: PageLoad = async() => {
    console.log("Loading suggestions")
    const suggestionsQuery = query(collection(db, 'songs'), orderBy('suggestionDate'))
    const suggestions = await getDocs(suggestionsQuery)

    return {
        suggestions: suggestions.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data()
            }
        })
    }
}

export async function DeleteSuggestion(id: string) {
    console.log(id)

    const docRef = doc(db, 'songs', id)
    deleteDoc(docRef)
    console.log("Deleted: " + id)
}