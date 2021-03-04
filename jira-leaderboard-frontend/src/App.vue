<template>
	<div id="app">
		<h1>Jira Leaderboard: 10/05/2019 -> 10/05/2020</h1>
		<h2>Average calculated on 252 work days</h2>
		<hr />
		<ol>
			<li v-for="user in data" :key="user.accountId">
				{{ user.displayName }}: {{ user.total }}
				<br />
				<b>Average ticket a day:</b> {{ getAverage(user.total) }}
			</li>
		</ol>
	</div>
</template>

<script>
	import user_data from "../../data-storage/user-2020-10-05-to-present";
	export default {
		data() {
			return {
				data: user_data
					.sort((a, b) => b.total - a.total)
					.filter((u) => u.total != 0),
			};
		},

		methods: {
			getAverage(total) {
				return Math.round((total / 252 + Number.EPSILON) * 100) / 100;
			},
		},
	};
</script>

<style lang="scss">
	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
	}

	li {
		margin: 20px;
	}

	#nav {
		padding: 30px;

		a {
			font-weight: bold;
			color: #2c3e50;

			&.router-link-exact-active {
				color: #42b983;
			}
		}
	}
</style>
