import {
	type CollectionReference,
	type DocumentData,
	type QueryDocumentSnapshot,
	query,
	where,
	getDocs,
	Query
} from 'firebase/firestore'

/**
 * Batches an in-query to get past the 10 filter limit
 * @param collection - The Collection or CollectionGroup the retrieve data from
 * @param fieldToCheck - The field to filter on. Note: document id = '\_\_name\_\_'
 * @param list - The filter items
 * @param queryContraints - Optional: Additional query constraints
 * @returns The retrieved documents matching the filter
 */
export async function QueryWhereInBatched(
	collection: CollectionReference<DocumentData> | Query<DocumentData>,
	fieldToCheck: string,
	list: any[]
): Promise<QueryDocumentSnapshot<DocumentData>[]> {
	let queryDocs: QueryDocumentSnapshot<DocumentData>[] = []

	for (let i = 0; i < list.length; i += 10) {
		const subList = list.slice(i, i + 10)
		const subQuery = query(collection, where(fieldToCheck, 'in', subList))
		queryDocs = queryDocs.concat((await getDocs(subQuery)).docs)
	}

	return queryDocs
}
