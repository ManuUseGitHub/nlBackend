const getMockedTranslate = async () => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve({
				text: "Moi !",
				detectedSourceLang: "nl",
				billedCharacters: 3,
				modelTypeUsed: undefined,
			});
		}, 1000);
	});
};

module.exports = {
	getMockedTranslate,
};
