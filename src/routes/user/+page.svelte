<script lang="ts">
    import { page } from '$app/stores'
</script>

<div class="userinfo">
    Hey {$page.data.user?.displayName ?? $page.data.user?.name}!<br><br>
    Your roles:<br>
    Participant{#if $page.data.user?.commissie}, Commissie{/if}{#if $page.data.user?.admin}, Admin{/if}
</div>