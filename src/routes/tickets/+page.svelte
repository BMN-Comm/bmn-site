<script>
	import { Grid, Row } from 'carbon-components-svelte'
	import IntroductionCard from '$lib/components/introductionCard.svelte'
</script>

<div class="tickText">
	<h1><strong>TICKET SALE</strong></h1>
	<h2>The ticket sale for 2027 will open in a few months!</h2>
	<h3>To get a reminder when the sale opens, fill in <a href="https://genqrco.de/WTZtfu7">the interest form</a>!</h3>
	
<!--	<h2> <a href="https://a-eskwadraat.nl/Activiteiten/bmn/10301/BetaMusicNight2026/KaartjeKopen">GET YOUR TICKETS NOW!</a><br><br><br> </h2> -->
<!--	<h4><strong> BMN? What's that?</strong></h4>-->
<!--	<p>-->
<!--		It's once again time for the bestest most spectacular concert on the planet, the Beta Music Night, and this year, we have an even greater night for you in store!-->
<!--		The Beta Music Night (BMN) is an annual concert, -->
<!--		performed by science students under the assosiations -->
<!--		A-eskwadraat and Sticky! We play covers of many many -->
<!--		artists in many many genres and ticket sale has FINALLY -->
<!--		STARTED. Tickets are available to everyone, so non-members -->
<!--		of the associations are also encouraged to join. Be sure to bring -->
<!--		anyone along who might be interested, your aunts, uncles, parents, -->
<!--		twice removed cousins, pets, anyone! <br> <br>-->
<!--	</p>-->
<!--	<p>-->
<!--		<strong>When:</strong> Wednesday 9th of June, 2027 <br>-->
<!--		<strong>What time:</strong> 19:30 (doors open at 19:00) <br>-->
<!--		<strong>Where:</strong> De Helling, Utrecht (3 minute walk from train station Vaartsche Rijn) <br>-->
<!--		<strong>Ticket price:</strong> €11,10 <br>-->
<!--	</p>-->
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
