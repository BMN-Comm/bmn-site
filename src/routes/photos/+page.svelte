<script>
    import { Grid, Row } from 'carbon-components-svelte'
    import IntroductionCard from '$lib/components/introductionCard.svelte'
</script>

<div class="tickText">
    <h1><strong>Videos and photos!</strong></h1>
    <h2>This is a shared drive where you can view the photos of the 2025 edition of the BMN!</h2>
    <h2>Open it <a href="https://photos.app.goo.gl/bLDH4y8fedBeKs7G9">here</a></h2>
    <h2>Do you want to keep up with all BMN news?<br> Follow us on instagram!</h2>
    <a href= https://instagram.com/betamusicnight>
        <img class="socialImg" width="100px" src="socials/instagram.png" alt="InstagramIcon" />
    </a>
</div>

<style>
    .tickText {
        margin: 10% 25%;
        text-align: center;
        align-items: center;
    }
    .tickText h1 {
        font-size: 50px;
    }
    .tickText h2 {
        font-style: italic;
        font-size: 26px;
        margin-top: 5%;
        text-align: center;
    }
    .tickText img {
        margin-top: 5%;
    }

</style>
