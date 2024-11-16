module.exports = function data_posts() {
	let posts = [];
	for (var i = 1; i <= 24; i++) {
		let date = new Date("2024-01-" + i);

		let post = {
			id: i,
			title: "Post Title " + i,
			author: "user" + i,
			created: date,

			messages: [
				{
					body: "Initial post " + i + ".",
					author: "1user" + i,
					created: date
				},
				{
					body: "First reply of post " + i + ".",
					author: "2user" + i, 
					created: date
				},
				{
					body: "Second reply of post " + i + ".",
					author: "3user" + i,
					created: date
				},
			]
		};

		posts.push(post);
	}

	return posts;
};