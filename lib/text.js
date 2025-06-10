class EntriesBuilder {
	current = "";
	constructor(text) {
		this.current = text;
		return this;
	}
	escapeLitteralSrings = () => {
		const p = /(?<yes>"[^\"]+")|(?<no>.+)/gm;
		let m;
		const lines = [];
		const preTreatment = this.current.replace(/\\"/gm, "''");
		while ((m = p.exec(preTreatment))) {
			const { yes, no } = m.groups;
			if (yes) {
				lines.push(
					yes
						.replace(/"/g, "")
						.replace(/,/g, "\u{FE50}")
						.replace(";", "\u{FE54}")
				);
			} else {
				lines.push(no);
			}
		}
		this.current = lines.join("\n");
		return this;
	};
	cutSentences() {
		const p =
			/\s?(?<cut>[^\.?!\n\r]+(?:[a-zA-Z][.]){2,}[^\.?!\n\r]+[.?!]+[\r\n]?|[^\.?!\n\r]+[.?!]+[\r\n]?|.+[\r\n]?)/gm;
		let m;
		const lines = [];
		while ((m = p.exec(this.current))) {
			const { cut } = m.groups;
			lines.push(cut.trim());
		}
		this.current = lines.join("\n");
		return this;
	}
	build() {
		return this.current
			.replace(/''/gm, '"')
			.replace(";", "\u{FE54}")
			.replace(/\\,/gm, "\u{FE50}")
			.replace(/[\n\r]+/gm, ",")
			.replace(/\,{2,}/gm, ",")
			.replace(/,\s*/gm, "; ")
			.replace(/\u{FE50}/gmu, ",")
			.split("; ");
	}
	toString() {
		return this.current.replace(/\u{FE50}/gmu, ",");
	}
}

module.exports = {
	EntriesBuilder,
};
