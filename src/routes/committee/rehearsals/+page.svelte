<script lang="ts">
	import { Button, Column, ExpandableTile, Grid, Modal, ModalHeader, Row, StructuredList, StructuredListCell, StructuredListRow } from "carbon-components-svelte"
    import type { rehearsal } from "$lib/types/domain/rehearsal"
	import { Chat, Favorite, MusicRemove, PlayFilledAlt, TrashCan } from "carbon-icons-svelte"
	import { collection, DocumentReference, getDoc, getDocs, orderBy, query, Timestamp, type DocumentData } from "firebase/firestore"
	import { db } from "$lib/firebase/client/firebase"
	import LoginButton from "$lib/components/loginButton.svelte"
	import type { song } from "$lib/types/domain/song"
	import { get } from "svelte/store"

    export let data: {rehearsalDays: rehearsal[]}
    let songData = new Map<number, song[]>()

    for (let i = 0; i < data.rehearsalDays.length; i++) {
        loadDay(i)        
    }

    async function loadDay(index: number) {

        const songs = (await Promise.all(
            data.rehearsalDays[index].songsToRehearse.map(
				(song: { song: DocumentReference }) => {
                    loadSong(song.song).then(
                    loadedSong => {loadedSong; console.log(loadedSong)}
                    )
                })
        ))  

        songData.set(index, songs)
        console.log(songs)
        console.log(songData)     
    }

    async function loadSong(songRef: DocumentReference) {
        let s = await getDoc(songRef)
        return s.data()
    }

</script>

<Grid>
    <Row padding>
        <Column><h2>Geplande Repetities</h2></Column>
    </Row>
    <StructuredList>
        {#each data.rehearsalDays as rehearsal, i}
            <ExpandableTile on:click={() => {}}>
                <div slot="above">
                    <Row padding>
                        <Column>
                            {rehearsal.startTime.toDate().toDateString()}
                        </Column>
                        <Column>
                            {rehearsal.startTime.toDate().getHours()}:{String(rehearsal.startTime.toDate().getMinutes()).padStart(2, '0')} - 
                            {rehearsal.endTime.toDate().getHours()}:{String(rehearsal.endTime.toDate().getMinutes()).padStart(2, '0')}
                        </Column>
                        <Column>
                            {rehearsal.location}
                        </Column>
                    </Row>
                </div>
                <div slot="below">
                    {#each rehearsal.songsToRehearse as song, j}
                    <Row>
                        <Column>
                            {songData.get(0)[j]}
                        </Column>
                        <Column>
                            {song.startTime.toDate().getHours()}:{String(song.startTime.toDate().getMinutes()).padStart(2, '0')} - 
                            {song.endTime.toDate().getHours()}:{String(song.endTime.toDate().getMinutes()).padStart(2, '0')}
                        </Column>
                    </Row>
                    {/each}
                </div>
            </ExpandableTile>
        {/each}
    </StructuredList>
</Grid>