{
  "title": "layout",
  "definition": [
    {
      mode: 'jade',
      code: "p hello {{world}}",
      process: 'jade'
    },
    {
      mode: 'mustache',
      code: null,
      process: 'ractive'
    },
    {
      mode: 'json',
      name: 'ractive',
      code: null,
      definition: true
    },
    "error": null
  },
  "config": {
    "layout": {
      "jade": {
        "theme": "solarized_light",
        "gutter": true,
        "tab": 2,
        "softTab": false,
        "highlightLine": false,
        "invisibles": false,
        "indentGuides": true,
        "fadeFold": true,
        "scrollPastEnd": true
      }
    }
  }
}