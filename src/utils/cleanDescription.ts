export const cleanDescription = (text: string) => {
    text = text.replaceAll("\n", "<br>");
    text = text.replaceAll("&lt;", "<");
    text = text.replaceAll("&gt;", ">");
    //text = text.replace(/(<a href\=\")(.+)(\">)(.+)(<\/a>)/g, (match, p1, uri, p3, content, p5) => {
    text = text.replace(/(<a href\=\")([^"]+)(\">)([^<]+)(<\/a>)/g, (match, p1, uri, p3, content, p5) => {
        return content;
    });

    return text;
};
