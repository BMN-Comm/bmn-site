<script lang="ts">
	import { Column, Grid, Row, StructuredList, StructuredListCell, StructuredListRow } from "carbon-components-svelte"
    import type { song } from "$lib/types/domain/song"

    export let data: {suggestions: song[]}


</script>

<Grid>
    <Row>
        <Column>Suggesties</Column>
    </Row>

    <StructuredList>
        {#each data.suggestions as suggestion}
            <StructuredListRow>
                <StructuredListCell>
                    {suggestion.name}
                </StructuredListCell>
            </StructuredListRow>
        {/each}
    </StructuredList>
</Grid>