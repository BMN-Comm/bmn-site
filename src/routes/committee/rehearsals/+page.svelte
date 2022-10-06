<script lang="ts">
	import { Button, Column, ExpandableTile, Grid, Modal, ModalHeader, Row, StructuredList, StructuredListCell, StructuredListRow } from "carbon-components-svelte"
    import type { rehearsal } from "$lib/types/domain/rehearsal"
	import { Chat, Favorite, MusicRemove, PlayFilledAlt, TrashCan } from "carbon-icons-svelte"
	import { collection, getDoc, getDocs, orderBy, query, Timestamp } from "firebase/firestore"
	import { db } from "$lib/firebase/client/firebase"
	import LoginButton from "$lib/components/loginButton.svelte"
	import type { song } from "$lib/types/domain/song"

    export let data: {rehearsalDays: rehearsal[]}
    console.log('data:')
    console.log(data)

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
                            {song.id}
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