const path = require('path');
const util = require('util');
const fastText = require('fib-fasttext');
const ngram = require('./ngram');
const uniblock = require('./uniblock');

const m = new fastText.Classifier(path.join(__dirname, "model", "lid.176.ftz"));

m.predict_sync = util.sync(m.predict, true);

const ft_langs = {
    "en": true,
    "fr": true,
    "ro": true,
    "vi": true,
    "ja": true,
    "nl": true,
    "fi": true,
    "sl": true,
    "da": true
}

function detect(txt, default_lang = 'zh') {
    if (!txt || typeof txt != 'string')
        return default_lang;

    var uni_lang = uniblock.detect(txt);
    if (uni_lang && uni_lang != 'zh') {
        // console.log("uni_lang", uni_lang);
        return uni_lang;
    }

    var lang = ngram.detect(txt);
    if (lang && lang.length > 0) {
        lang = lang[0].lang;

        // console.log("ngram_lang", lang);

        if (uni_lang == 'zh') {
            if (lang == 'zh-tw')
                return 'zh-tw';
            if (lang == 'zh-cn')
                return 'zh-cn';
            return 'zh';
        }

        if (lang && !ft_langs[lang])
            return lang;
    }

    if (uni_lang == 'zh')
        return 'zh';

    lang = m.predict_sync(txt, 3);
    // console.log("fastText_lang", lang);

    return lang.length ? lang[0].label.replace("__label__", "") : default_lang;
}

exports.detect = detect;