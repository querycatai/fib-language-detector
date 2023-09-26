const fs = require('fs');
const path = require('path');

const unicode_module = '@unicode/unicode-15.1.0';
const unicode = require(unicode_module);

var _langlist = [];
var _wordLangProbMap = {};

/**
* Unicode Initialization
*/
var UnicodeBlocks = [];
function getUnicodeBlock(char) {
    for (var i = 0; i < UnicodeBlocks.length; i++)
        if (UnicodeBlocks[i].regex.test(char))
            return UnicodeBlocks[i].name;

    return null;
}

const skip_langs = {
    "Arabic": true,
    "Basic_Latin": true,
    "Cyrillic": true,
    "Devanagari": true,
    "General_Punctuation": true,
    "Latin_Extended_A": true,
    "Latin_Extended_Additional": true,
    "Latin_Extended_B": true,
    "Latin_1_Supplement": true,
};

const lang_names = {
    "Bengali": "bn",
    "Greek_And_Coptic": "el",
    "Gujarati": "gu",
    "Hebrew": "he",
    "Kannada": "kn",
    "Hangul_Syllables": "ko",
    "Malayalam": "ml",
    "Gurmukhi": "pa",
    "Tamil": "ta",
    "Telugu": "te",
    "Thai": "th"
};

function detect(text) {
    var langs = {};

    for (var i = 0; i < text.length; i++) {
        var ch = text[i];
        var block = getUnicodeBlock(ch);
        if (!skip_langs[block]) {
            if (!langs[block])
                langs[block] = 0;
            langs[block]++;
        }
    }

    if (langs["CJK_Unified_Ideographs"])
        return langs["Hiragana"] || langs["Katakana"] ? "ja" : "zh";

    var keys = Object.keys(langs);
    if (keys.length == 1)
        return lang_names[keys[0]];

    return null;
};

/**
 * LangDetect Initialization
 */
function prepare() {
    var langlist = fs.readdir(path.join(__dirname, "profiles"));

    for (var i = 0; i < langlist.length; i++) {
        var file = langlist[i],
            lang = file.split('.')[0],
            profile = require(path.join(__dirname, "profiles", file));

        if (_langlist.indexOf[lang] >= 0) throw new Error('duplicate the same language profile');
        _langlist.push(lang);

        for (var word in profile.freq) {
            if (!_wordLangProbMap[word]) _wordLangProbMap[word] = new Array(langlist.length);
            var len = word.length;
            if (len >= 1 && len <= 3) {
                var prob = profile.freq[word] / profile.n_words[len - 1];
                _wordLangProbMap[word][i] = prob;
            }
        }
    }

    unicode.Block.forEach(function (unicode_block) {
        UnicodeBlocks.push({
            name: unicode_block,
            regex: require(`${unicode_module}/Block/` + unicode_block + '/regex')
        });
    });
}

prepare();

exports.getUnicodeBlock = getUnicodeBlock;
exports.langlist = _langlist;
exports.wordLangProbMap = _wordLangProbMap;
exports.detect = detect;
