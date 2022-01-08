import Mustache from "mustache";

const utils = {
    parseHTML: (htmlString) => {
        const parser = new DOMParser();
        return parser.parseFromString(htmlString.trim(), 'text/html').body.firstChild;
    },
    parseMustacheTemplate(templateString, templateData) {
        return this.parseHTML(Mustache.render(templateString, templateData));
    }
    
}

export default utils;

