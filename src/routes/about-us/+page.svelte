<script>
	import { Grid, Row } from 'carbon-components-svelte'
	import IntroductionCard from '$lib/components/introductionCard.svelte'
</script>

<Grid>
	<Row>
		<div class="committee-header">
			<h1>The 10th BMN committee (2023-2024)</h1>
			<div class="committee-picture-gradient">
				<div class="committee-picture-wrapper">
					<img
						class="committee-picture"
						src="committeePhotos/committee2024.jpg"
						alt="Committee 2024"
					/>
				</div>
			</div>
		</div>
	</Row>
	<Row>
		<h1 style="margin-bottom: 20px;">The members</h1>
	</Row>
	<Row>
		<IntroductionCard img_src="committeePhotos/roos.jpg" title="Chairwoman" color="red">
			<p>
				Hiya, I'm Roos and for this year's BMN, I'm the chairwoman. It's my responsibility to make
				sure that the concert, as well as everything leading up to it, goes smoothly. Before taking
				on this daunting task, I was already in the committee for a number of years, having been PR
				manager for three years and setlist manager with a wildcard side job for one. For the past
				13 years, my main instrument has been the guitar. Stereotypically, that would mean I also
				own a bass (I do). Most of my guitar experience is in heavier music, as I've been in a fast
				and loud metal band for the past 8 years, but I'm down to play anything. Even jazz. I hope
				you'll enjoy this year's concert!
			</p>
		</IntroductionCard>
		<IntroductionCard img_src="committeePhotos/sebas.jpg" title="Agent" color="green">
			<p>
				Heyo, I'm Sebastian. I'm the secretary for the BMN aka professional emailer and point of
				contact. If you have any questions or troubles, just reach out to me! Music is okay I guess.
				I mostly just play piano. I'm still not that great at musicing with it but I'm working on
				it!! I love lots of different music and have recently gotten into King Gizzard and the
				Lizard Wizard. They are awesome and you should check them out. I'm studying computer science
				to finally be able to answer the question of how much dedicated RAM I need to run a
				minecraft server, and I think I'm close to getting an answer. I don't really have a plan for
				the future, but right now I'm just really enjoying being with the BMN and the people that
				I've met by doing this :)
			</p>
		</IntroductionCard>
		<IntroductionCard img_src="committeePhotos/buse.jpg" title="PR/Vice-chair" color="blue">
			<p>
				Hi! My name is Buse~ I've veen involved with BMN for close to four years now, and this year
				I have the honor of being the vice-chair and doing the PR for the event. My job is to ensure
				that you (yes YOU) are informed about everything BMN (follow us on instagram,
				@betamusicnight). My second job is to make sure that Roos delegates her tasks when needed.
				I've been interested in music all my life, tried playing many instruments, and I've been
				"singing" singing since I was 14. Hope to see you all in the audience this year :3
			</p>
		</IntroductionCard>
		<IntroductionCard img_src="committeePhotos/annemarijn.jpg" title="Time manager" color="red">
			<p>
				Hi, my name is Annemarijn. I love to sing and play guitar, which is what I'll be doing on
				stage (and off stage as well). This is my second year in the beta music night committee.
				I'll be the time manager this year, meaning I'm in charge of making the rehearsal schedules.
				I'm in my (hopefully) last year of the double bachelors math and physics. Outside of the BMN
				and my study I enjoy crochet and knitting and making jigsaw puzzles. Hope to see you at the
				concert!
			</p>
		</IntroductionCard>
		<IntroductionCard img_src="committeePhotos/bjorn.jpg" title="Event manager" color="green">
			<p>
				Hi, I'm Bjorn, and the event manager of this year, which among other things means I organize
				fun activities for the participants, beside the show itself. This is my fifth year
				participating in the BMN, but have been singing and playing piano for much longer, and still
				derive a lot of pleasure from making music. I am pursuing masters in Mathematics and
				Computing Science, and also like to go bouldering. I hope to see you at the BMN!
			</p>
		</IntroductionCard>
		<IntroductionCard img_src="committeePhotos/raoul.jpg" title="Treasurer" color="blue">
			<p>
				Yoooo I am known as Raoul (Perry to some) and I'm from Curaçao. I play guitar and
				(left-handed) drums. This year I am treasurer, meaning I hunt for treasure so we can afford
				to organize the BMN. But for real, I am mostly responsible for the budget and the settlement
				and any other finance related tasks. Right now I'm following the double bachelor program for
				mathematics and physics and as of next year I will be studying computer science as well.
				Outside of BMN and my studies I enjoy watching a good (or so bad it's good) movie or show
				and if I have time play some videogames. See ya 'round!
			</p>
		</IntroductionCard>
		<IntroductionCard img_src="committeePhotos/bernd.jpg" title="Composer" color="red">
			<p>
				Hi, I'm Bernd! I have been playing (classical) piano since I was 8 years old and still going
				strong! Recently I have been collecting other instruments such as an accordeon, a melodica
				and a (currently) stringless guitar, but I am not yet very skilled at playing them. I am
				slowly working my way through my master in Theoretical Physics here in Utrecht, which I
				still very much enjoy. After a very fun and exciting year as a participant in BMN 2023 I
				decided to join the committee for BMN 2024! Within the committee I have the role of
				Composer. I do not really have a favourite genre of music, though I very much enjoy playing
				bombastic or overly dramatic music myself. I hope to see you at BMN 2024!
			</p>
		</IntroductionCard>
		<IntroductionCard
			img_src="committeePhotos/luuk.jpg"
			title="Roadie/Setlist manager"
			color="green"
		>
			<p>
				Hello, I am Luuk. I will be this year's Roadie, meaning that I will oversee all things
				technical. I make sure that all the gear will be there where it's supposed to, and at the
				show, make sure the musicians are there where they're supposed to (on stage). This is my
				second year in the BMN, and my first year in the committee. Having played piano since I was
				seven, I traded my life of neo-classical schooling for a more in your face genre of music,
				metal. Since the age of 16 I picked up the bass guitar and in 18 joined my now main band of
				rascals. I have had singing lessons since 10 and will be doing bass and vocal duties on the
				BMN itself. Despite this, I'm still well versed enough in the disciplines of piano, guitar
				and drums. My favourite genre is, of course, metal, but there is no type of music that I
				will not take seriously (though I really should have).
			</p>
		</IntroductionCard>
	</Row>
</Grid>

<style>
	@property --red-angle {
		syntax: '<angle>';
		inherits: false;
		initial-value: 10deg;
	}

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
		background: conic-gradient(
			#ff0000 calc(var(--red-angle) - 360deg),
			#00ff00 calc(var(--red-angle) - 240deg),
			#0000ff calc(var(--red-angle) - 120deg),
			#ff0000 var(--red-angle),
			#00ff00 calc(var(--red-angle) + 120deg),
			#0000ff calc(var(--red-angle) + 240deg),
			#ff0000 calc(var(--red-angle) + 360deg)
		);
		animation: rotate-red 10s linear infinite;
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

	@keyframes rotate-red {
		0% {
			--red-angle: 0deg;
		}
		100% {
			--red-angle: 360deg;
		}
	}
</style>
