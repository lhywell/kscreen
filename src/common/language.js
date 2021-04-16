export default function language() {
    let lang = null;
    let language = null;

    if (navigator.appName == 'Netscape') {
        language = navigator.language;
    } else {
        language = navigator.browserLanguage;
    }
    if (language.indexOf('en') > -1) {
        lang = "en"
    } else if (language.indexOf('zh') > -1) {
        lang = "zh"
    } else {
        lang = "en"
    }
    return lang
}