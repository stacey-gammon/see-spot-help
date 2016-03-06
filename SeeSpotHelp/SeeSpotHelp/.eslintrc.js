module.exports = {
    "extends": "google",
	"parserOptions": {
		"ecmaVersion": 6,
		"sourceType": "module",
		"ecmaFeatures": {
			"jsx": true
		},
	},
	"rules": {
		"semi": 2,
		"indent": [2, "tab"],
		"new-cap": [0],
		"max-len": [2, 100],
		"eqeqeq": [0]
	},
	"env": {
        "browser": true,
        "node": true
    }
};
