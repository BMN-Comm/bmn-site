import type { PageLoad } from "./$types";
import { db } from "$lib/firebase/client/firebase";
import { query, collection, getDocs, orderBy } from "firebase/firestore";

export const load: PageLoad = async() => {
    const suggestionsQuery = query(collection(db, 'songs'), orderBy('suggestionDate'))
    const suggestions = await getDocs(suggestionsQuery)

    return {
        suggestions: suggestions.docs.map((doc) => ({
                id: doc.id,
                song: doc.data()
        }))
    }
}