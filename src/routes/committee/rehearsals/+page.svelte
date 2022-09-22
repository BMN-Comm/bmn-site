<script lang="ts">
	import { Button, Column, ExpandableTile, Grid, Modal, ModalHeader, Row, StructuredList, StructuredListCell, StructuredListRow } from "carbon-components-svelte"
    import type { rehearsal } from "$lib/types/domain/rehearsal"
	import { Chat, Favorite, MusicRemove, PlayFilledAlt, TrashCan } from "carbon-icons-svelte"

    export let data: {rehearsals: rehearsal[]}

</script>

<Grid>
    <Row padding>
        <Column><h2>Geplande Repetities</h2></Column>
    </Row>
    <StructuredList>
        {#each data.rehearsals as rehearsal, i}
            <ExpandableTile>
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
                            <Button>Test</Button>
                        </Column>
                    </Row>
                </div>
            </ExpandableTile>
        {/each}
    </StructuredList>
</Grid>