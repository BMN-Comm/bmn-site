<script lang="ts">
	import { Button, Column, ExpandableTile, Grid, Modal, ModalHeader, Row, StructuredList, StructuredListCell, StructuredListRow } from "carbon-components-svelte"
    import type { rehearsal } from "$lib/types/domain/rehearsal"
	import { Chat, Favorite, MusicRemove, PlayFilledAlt, TrashCan } from "carbon-icons-svelte"
	import { collection, getDoc, getDocs, orderBy, query, Timestamp } from "firebase/firestore"
	import { db } from "$lib/firebase/client/firebase"
	import LoginButton from "$lib/components/loginButton.svelte"
	import type { song } from "$lib/types/domain/song"

    export let data: {rehearsals: rehearsal[]}

    console.log(data.rehearsals)

</script>

<Grid>
    <Row padding>
        <Column><h2>Geplande Repetities</h2></Column>
    </Row>
    <StructuredList>
        {#each data.rehearsals as rehearsal, i}
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
                    <Row>
                        <Column>
                            
                        </Column>
                    </Row>
                </div>
            </ExpandableTile>
        {/each}
    </StructuredList>
</Grid>