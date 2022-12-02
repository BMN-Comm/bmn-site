import {
	type CollectionReference,
	type DocumentData,
	type QueryDocumentSnapshot,
	query,
	where,
	getDocs,
	Query
} from 'firebase/firestore'

export async function QueryWhereIn(
	collection: CollectionReference<DocumentData>,
	list: any[],
	fieldToCheck: string
): Promise<QueryDocumentSnapshot<DocumentData>[]>

export async function QueryWhereIn(
	collection: Query<DocumentData>,
	list: any[],
	fieldToCheck: string
): Promise<QueryDocumentSnapshot<DocumentData>[]>

export async function QueryWhereIn(
	collection: CollectionReference<DocumentData> | Query<DocumentData>,
	list: any[],
	fieldToCheck: string
): Promise<QueryDocumentSnapshot<DocumentData>[]> {
	const queryDocs: QueryDocumentSnapshot<DocumentData>[] = []

	console.log(list)

	for (let i = 0; i < list.length; i += 10) {
		const subList = list.slice(i, i + 10)
		const subQuery = query(collection, where(fieldToCheck, 'in', subList))
		queryDocs.concat((await getDocs(subQuery)).docs)

		console.log(queryDocs)
	}

	return queryDocs
}
