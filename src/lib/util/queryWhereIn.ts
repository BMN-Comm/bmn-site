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
	fieldToCheck: string,
	list: any[]
): Promise<QueryDocumentSnapshot<DocumentData>[]>

export async function QueryWhereIn(
	collection: Query<DocumentData>,
	fieldToCheck: string,
	list: any[]
): Promise<QueryDocumentSnapshot<DocumentData>[]>

export async function QueryWhereIn(
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
