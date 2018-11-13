module.exports = function (server, db) {
	require('./common')(server, db)
	require('./drafts')(server, db)
	require('./certificates')(server, db)
	require('./registration')(server, db);
}