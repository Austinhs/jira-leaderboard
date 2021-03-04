const API_KEY  = 'removed my api key';
const axios    = require('axios');
const base_url = 'https://focussis.atlassian.net';
const btoa     = require('btoa');
const login    = btoa(`austins@focusschoolsoftware.com:${API_KEY}`);
const fs       = require('fs');

axios.defaults.headers.common['Authorization'] = `Basic ${login}`;

start();

async function start() {
	const date_start = '2020-10-05';
	const date_end   = '2020-10-05';

	try {
		let active_users        = [];
		let pagination          = 0;
		let data_being_returned = true;

		while(pagination <= 1500 && data_being_returned) {
			let user_data = await axios.get(`${base_url}/rest/api/3/users/search?startAt=${pagination}&maxResults=100`);

			if(user_data.data.length == 0) {
				data_being_returned = false;
				continue;
			}


			// Get total issue count per user
			for(let user of user_data.data) {
				if(user.active == false || user.accountType == 'app') {
					console.log(`Skipping user: ${user.displayName} has accountType: ${user.accountType} and active: ${user.active}`)
					continue;
				}

				console.log(`Getting data for user: ${user.displayName}`);

				try {
					user.total = await getIssueTotal(user, date_start, date_end);
					active_users.push(user);
				} catch(e) {
					console.log(`Could not find data for user: ${user.displayName}`);
				}
			}

			pagination += 100;
		}

		// Save the data
		fs.writeFileSync(`./data-storage/user-${date_start}-to-present.json`, JSON.stringify(active_users, null, 2));
		console.log('JSON data is saved');
	} catch(err) {
		console.log(err.message);
		console.log(err.response.data.errorMessages);
	}
}

async function getIssueTotal(user, date_start, date_end) {
	// const query_data = await axios.post(`${base_url}/rest/api/3/search`, {
	// 	jql: `
	// 		"Assigned Tester[Dropdown]" = "${user.displayName}"
	// 			AND
	// 		(status = Merged OR status = "Awaiting Code Review")
	// 			AND
	// 		updated >= '${date_start}'
	// 			AND
	// 		updated <= '${date_end}'
	// 	`,
	// 	startAt: 0,
	// 	maxResults: 1
	// });

	const query_data = await axios.post(`${base_url}/rest/api/3/search`, {
		jql: `
			assignee = ${user.accountId}
				AND
			status = Merged
				AND
			updated >= '${date_start}'
		`,
		startAt: 0,
		maxResults: 1
	});

	return query_data.data.total;
}