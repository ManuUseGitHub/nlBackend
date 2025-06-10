const accessControl = (req, res, next) => {
	const bearer = req.headers.authorization;
	if (!bearer || bearer !== "Bearer " + process.env.ACCESS_TOKEN) {
		return res.status(403).json({
			message: "Forbidden resource",
			error: "Forbidden",
			statusCode: 403,
		});
	}
	next();
};

module.exports = {
	accessControl,
};
