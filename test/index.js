const { detect } = require('..');

var data = require("./data.json");
const { describe, it } = require("node:test");
const assert = require("node:assert");

describe("fib-ld", () => {
    for (var lang in data) {
        (function(lang) {
            describe(lang, () => {
                var l = lang;
                var txts = data[l];

                txts.forEach(txt => {
                    it(txt, () => {
                        var lang1 = detect(txt, "zh");
                        // Handle language variants
                        // ms/id are essentially the same language (Malay/Indonesian)
                        let isMatch = (l === lang1) ||
                            (l === 'ms' && lang1 === 'id') ||
                            (l === 'id' && lang1 === 'ms');
                        assert.ok(isMatch, `Expected ${l} but got ${lang1}`);
                    });
                });
            });
        })(lang);
    }
})
