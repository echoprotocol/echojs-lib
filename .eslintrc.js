module.exports = {
	"extends": "airbnb",
	"env": {
		"browser": false,
		"jest": true
	},
	"plugins": [
		"import"
	],
	"rules": {
		"arrow-parens": [
			"error",
			"always"
		],
		"padded-blocks": [
			"error",
			{
				"classes": "always"
			}
		],
		"class-methods-use-this": 0,
		"max-len": ["error", { "code": 120, "tabWidth": 4 }],
		"no-continue": 0,
		"no-param-reassign": 0,
		"no-restricted-syntax": 0,
		"no-tabs": 0,
		"no-underscore-dangle": 0,
		"indent": [
			"error",
			"tab",
			{
				"SwitchCase": 1
			}
		],
		"no-shadow": [
			"error",
			{
				"allow": [
					"resolve",
					"reject",
					"done",
					"cb",
					"err"
				]
			}
		]
	}
};
