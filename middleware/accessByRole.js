const conf = require('../configs/url_by_role_access_cfg')

module.exports = function (server, db) {

	server.use(function (req, res, next) {

		let method = req.method || req.getMethod();
		let user = req.user;
		let role = getRole(user)
		let reqUrl = req.url;

		let urlAccessPatterns = conf[role]['urls'];

		if (role != 'default') {
			urlAccessPatterns = urlAccessPatterns.concat(conf['default']['urls'])
		}
		//console.log(urlAccessPatterns)
		urlAccessPatterns = replaceRouteParamsWithValues(urlAccessPatterns, user)
		console.log('urlAccessPatterns', urlAccessPatterns)
		if (permitAccess(reqUrl, method, urlAccessPatterns))
			return next()
		else
			res.send('access_denied_for_the_role', 201)

	})
}

function permitAccess(reqUrl, method, urlAccessPatterns) {
	console.log('permitAccess: ', reqUrl, method)

	let permit = false;

	urlAccessPatterns.forEach(pattern => {
		let regexpr = pattern.regexpr;
		let methods = pattern.methods;

		if (new RegExp(regexpr, 'i').test(reqUrl) && methods.indexOf(method) != -1) {
			permit = true;
		}

	});


	return permit;
}

function replaceRouteParamsWithValues(urlAccessPatterns, user, routeValues) {
	//console.log('replaceRouteParamsWithValues: ', user, routeValues)
	if (!routeValues)
		routeValues = {};
	if (user)
		routeValues.userId = user._id;

	return urlAccessPatterns.map(el => {
		let pattern = el.regexpr;

		for (const key in routeValues) {
			if (routeValues.hasOwnProperty(key)) {
				const rValue = routeValues[key];
				pattern = pattern.replace(new RegExp(`:${key}`, 'ig'), rValue)
			}
		}

		el.regexpr = pattern;

		return el;

	});


}

function getRole(user) {
	//console.log('getRole: ', user)
	if (!user)
		role = 'default';
	else
		role = user.role || 'issuer';

	return role;
}

