export const cleanDescription = (text = "") => {
    let parser = new DOMParser();
    let doc = parser.parseFromString(text.replaceAll("<br>", "\n"), "text/html");
    return doc.documentElement.textContent;
};
