const Db = require('tingodb')().Db;

const db = new Db('../db', {});

// Fetch a collection to insert document into
let collection = db.collection("default_certificates");

const lorem = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia, doloremque explicabo nemo voluptate facilis assumenda recusandae? Temporibus nesciunt, porro voluptatem eaque a similique aliquid, ducimus commodi, exercitationem quasi vel deserunt unde mollitia amet illum rem id fugiat dicta saepe vitae magni repellendus quas veniam eligendi? Voluptatem eos repudiandae numquam neque. Voluptatum nulla reiciendis praesentium dolorem vitae voluptate tempora at fuga, esse, mollitia asperiores sequi voluptates modi rem rerum aspernatur commodi suscipit atque iure earum architecto totam natus laborum! Asperiores iure voluptates similique expedita, totam optio placeat fugiat eum. Atque tempore dignissimos voluptatem placeat dicta consequuntur soluta tempora distinctio laborum sint neque rerum vel, assumenda dolorem aliquam id totam aliquid sed blanditiis eligendi officiis in! Deserunt aut molestias, commodi ducimus, cupiditate rerum ullam consequatur, ipsa laborum laboriosam explicabo possimus nulla consectetur mollitia eos qui sequi illo cumque iste id quos natus expedita optio. Nobis illo nemo eligendi! Ducimus, adipisci! Vel, hic!';

let certificates = [];

for (let i = 0; i < 30; i++) {
	certificates.push({
		certificate_guid: Math.floor(Math.random() * 90000) + 10000,
		name: 'Java EE',
		description: lorem,
		timestamp: Date.now(),
		issuer: Math.floor(Math.random() * 90000) + 10000,
		receiver: Math.floor(Math.random() * 90000) + 10000,
		status: 'incomplete',
	})

}

// Insert documents
collection.insert(certificates, function (err, result) {

	console.log(result, err)
});