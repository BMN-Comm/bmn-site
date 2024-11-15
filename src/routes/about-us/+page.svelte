<script>
	import { Grid, Row } from 'carbon-components-svelte'
	import IntroductionCard from '$lib/components/introductionCard.svelte'
</script>

<Grid>
	<Row>
		<div class="committee-header">
			<h1>The 11th BMN committee (2024-2025)</h1>
			<div class="committee-picture-gradient">
				<div class="committee-picture-wrapper">
					<img
						class="committee-picture"
						src="committeePhotos/committee2025.jpg"
						alt="Committee 20255"
					/>
				</div>
			</div>
		</div>
	</Row>
	<Row>
		<h1 style="margin-bottom: 20px;">The members</h1>
	</Row>
	<Row>
		<IntroductionCard img_src="committeePhotos/bernd2.jpg" title="Chairman">
            <p>
                Hi, I'm Bernd! I have been playing (classical) piano since I was 8 years old and still going strong!
                Recently I have been collecting other instruments such as an accordeon, a melodica and an electrig
                guitar, but I am not yet very skilled at playing them. I am slowly working my way through my master in
                Theoretical Physics here in Utrecht, which I still very much enjoy. After a very fun and exciting year
                as a participant in BMN 2023 and being in the committee last year, I am now the Chair of Committee 2025.
                I do not really have a favourite genre of music, though I very much enjoy playing bombastic or overly
                dramatic music myself. I hope to see you at BMN 2025!
            </p>
		</IntroductionCard>
		<IntroductionCard img_src="committeePhotos/meinte.jpg" title="Agent">
            <p>
                Hi, I’m Meinte. I am a third years physics student, but I’m also engaging in a minor in anthropology. Having
                been both a spectator and a participant of the BMN in the last two years, I am excited to be part of the
                organisation this time around. I will be the agent for the BMN this year, which means that i will take
                care of all contact the BMN has with the outside world, so if you ever have a question, send me an
                email! My main instrument is the guitar, although I once started making music on a keyboard long ago. I
                love playing and listening to alternative rock, but I also enjoy listening to many genres of music that
                do not involve a guitar, such as (experimental) hip-hop, house and jungle.
            </p>
		</IntroductionCard>
		<IntroductionCard img_src="committeePhotos/tibor.jpg" title="PR">
            <p>
                Hi there! My name is Tibor and I am this year's PR. So that means my job is to make sure everyone knows
                about the BMN and comes to the concert! This is my third year doing BMN. Last year and the year before I
                played guitar at the BMN and at home I also play bass. I own many instruments, a mandolin and a djembe
                for example. I like rock, jazz and funk. Outside of music I love to read, climb and study physics
                (I am in my third year of the bachelor). See you at the concert!
            </p>
		</IntroductionCard>
		<IntroductionCard img_src="committeePhotos/murren.jpg" title="Time Manager">
			<p>
				"Yes, it is I, says me. And all who agree are more than three cuz they're we!" <br>
                I'm Merijn, also known as Murren or 'The Frog Guy'. I'll  be the time manager of this year, meaning I
                will be in charge of making the schedules of all the rehearsals. I am also self-appointed bierkoerier,
                but don't tell Bernd that. I've been playing the drums since the ripe young age of seven, and last year
                I started my CS bachelor alongside the BMN. I also play in a thrashmetalband, and music is by far the
                most important thing in my life. My favorite genres all fall in the Metal category, but I listen to a wide
                variety of EDM subgenres as well, from popular to obscure, and the cultured amongst us will have recognized
                my opening quote from Dr. Dre's "Stranded on Death Row". I can ramble on about music forever, but let's switch it up.
                Besides music I write and read (but no one believes that), I debate, and I am full-time discordian. I code
                in my free time, working on the BMN website, Minecraft mods and plugins, and occasionally a uni assignment.
                If you are a participant I will bother you with all means necessary to fill in your availability for
                rehearsals, so be warned. Otherwise, I will see you June 4th at the BMN!
			</p>
		</IntroductionCard>
		<IntroductionCard img_src="committeePhotos/jennifer.jpg" title="Event Manager">
            <p>
                Yerrooo! My name is Jennifer. I’ve been listening and singing along to music of all kinds all my life
                and started taking singing classes around 2 years ago. I also taught myself some ukulelelele and guitar,
                but still need to practice a lot with those. This year I will be the Event Manager for the BMN, which
                means I’ll manage the events :3 ~ this includes organising bonding activities and booking the studios
                for the rehearsals. Currently I’m studying Computer Science, but I did not learn how to fix a printer
                yet. Hope to see you at this year’s concert!
            </p>
		</IntroductionCard>
        <IntroductionCard img_src="committeePhotos/luuk2.jpg" title="Roadie/Treasurer">
            <p>
                Hello, I am Luuk. I will be this year's Roadie and Treasurer, meaning that I will oversee all things
                technical and monetary. I make sure that all the gear will be there where it's supposed to, at the show,
                make sure the musicians are there where they're supposed to (on stage), and all together make sure the
                money is where it’s supposed to be (in the pocket). This is my third year in the BMN, and my second year
                in the committee. Having played piano since I was seven, I traded my life of neo-classical schooling for
                a more in your face genre of music, metal. Since the age of 16 I picked up the bass guitar and in 18
                joined my now main band of rascals. I have had singing lessons since 10 and will be doing bass and vocal
                duties on the BMN itself. Despite this, I'm still well versed enough in the disciplines of piano, guitar
                and drums. My favourite genre is, of course, metal, but there is no type of music that I will not take
                seriously (though I really should have).
            </p>
        </IntroductionCard>
		<IntroductionCard img_src="committeePhotos/annemarijn.jpg" title="Composer/Vice-chair">
			<p>
				_
			</p>
		</IntroductionCard>
        <IntroductionCard img_src="committeePhotos/wessel.jpg" title="Setlist Manager">
            <p>
                Hello, I am Wessel. I am this year’s setlist manager. I will be responsible for managing the setlist
                (duh’) And a few other things. This is my first year in the BMN and committee. I took classical piano
                lessons for several years when I was young and I have been playing guitar since my 16th birthday. I
                enjoy listening and playing a lot of music genres, of which I do enjoy classic rock and blues the most.
                Currently, I am also a first year gametech student here at the University Utrecht. I hope to see y'all
                on the BMN this year.
            </p>
        </IntroductionCard>
	</Row>
</Grid>

<style>
	.committee-header {
		width: 100%;
		margin-bottom: 40px;
		display: flex;
		flex-direction: column;
	}

	.committee-picture-gradient {
		--red-angle: 0deg;
		width: 100%;
		max-width: 800px;
		margin: auto;
		margin-top: 10px;
		padding: 5px;
		background: #644ba0;
		border-radius: 39px;
	}

	.committee-picture-wrapper {
		margin: auto;
		padding: 10px;
		background-color: #161616;
		border-radius: 34px;
	}
	.committee-picture {
		border-radius: 24px;
		max-width: 100%;
	}
</style>
