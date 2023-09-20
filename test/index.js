const { detect } = require('..');

var data = require("./data.json");
const test = require('test');
test.setup();

describe("fib-ld", () => {
    for (var lang in data) {
        describe(lang, () => {
            var l = lang;
            var txts = data[l];

            txts.forEach(txt => {
                it(txt, () => {
                    var lang1 = detect(txt);
                    assert.equal(l, lang1);
                });
            });
        });
    }

    describe("other", () => {
        it("$%^&#$%&^&^&*(^&*(^", () => {
            var lang = detect("$%^&#$%&^&^&*(^&*(^");
            assert.equal(null, lang);
        });

    });
})

test.run();
