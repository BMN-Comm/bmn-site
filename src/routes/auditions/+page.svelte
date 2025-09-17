<script>
    import { Grid, Row } from 'carbon-components-svelte'
    import IntroductionCard from '$lib/components/introductionCard.svelte'
</script>
<div class= "crowdIMG">
    <img class="crowdIMG" src="BMNCrowd.jpg" alt="CrowdPhoto" />
    </div>


<div class="audText">
    <h1><strong>Auditions!</strong></h1>

    <h2>Auditions for BMN 2026 are NOW OPEN! <br>Fill out <a href="https://forms.gle/qs6Eo1yS6iV8AfLAA">this Google Form</a> to sign up!<br> <br> <br> </h2>
    <h3>The Bèta Music Night, or BMN is an annual concert organized by students from the science faculty at Utrecht University. The setlist of the concert typically is made out of covers of existing songs.
        The tunes that are played are assigned by the committee according to the music taste of the participants, so each song has a different line-up musicians! Right now, the committee is looking for 
        participants to strengthen the pool of artists, to make the BMN an even more unforgettable night, so please consider signing up :D We love all kinds of instruments, so even if it's very niche, we'd love to have you! </h3>
    <h2>Do you want to keep up with all BMN news?<br> Follow us on instagram!</h2>
    <a href= https://instagram.com/betamusicnight>
        <img class="socialImg" width="100px" src="socials/instagram.png" alt="InstagramIcon" />
    </a>
</div>

<style>
    .audText {
        margin: 3% 25%;
        text-align: center;
        align-items: center;
    }
    .audText h1 {
        font-size: 50px;
    }
    .audText h2 {
        font-style: italic;
        font-size: 26px;
        margin-top: 5%;
        text-align: center;
    }
    .audText img {
        margin-top: 5%;
    }

    .crowdIMG div {
        display: flex;
        justify-content: center;
    }

    .crowdIMG img {
        width: 100%;
    }
</style>
