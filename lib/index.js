const path = require('path');
const fastText = require('fasttext');
const langdetect = require('langdetect');

const m = fastText.loadModel(path.join(__dirname, "model", "lid.176.ftz"));

const ft_langs = {
    "en": true,
    "vi": true,
    "ja": true,
    "sl": true,
    "da": true
}

function detect(txt) {
    var lang = langdetect.detect(txt);
    if (lang == null || lang.length == 0)
        return null;

    lang = lang[0].lang;
    if (lang && !ft_langs[lang])
        return lang;

    return m.predict(txt, 1)[0].label.replace('__label__', '');
}

exports.detect = detect;