import { db } from "$lib/firebase/client/firebase";
import { query, collection, getDocs } from "firebase/firestore";

export const load = async() => {
    const suggestionsQuery = query(collection(db, 'suggestions'))
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
