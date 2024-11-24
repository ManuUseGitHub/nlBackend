exports.data = [
    // default values
    ["verbose", false],
    ["rootp", "routes/"],

    // default behaviors
    ["onmatch", match => { }],
    ["onerr", ({
        message
    }) => {
        console.log(
            `[\x1b[31m/!\\\x1b[37m]`,
            `\x1b[31m ${message}\x1b[37m`
        )
    },],

    ["flat", false],

    // replace specific routes by custom
    ["translations", []],

    ["subr", null,
        ["obj", "cptlz", "b64", null]
    ],

    ["frame", { before: "", after: "" }]
]