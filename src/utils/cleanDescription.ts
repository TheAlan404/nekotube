export const cleanDescription = (text = "") => {
    let parser = new DOMParser();
    let doc = parser.parseFromString(text, "text/html");
    return doc.documentElement.textContent;
};
