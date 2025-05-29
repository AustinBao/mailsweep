import * as cheerio from 'cheerio';

function decodeString(decodedString) { 
    const $ = cheerio.load(decodedString);
    const allLinks = $('a');
    const linkArray = allLinks.toArray();
    
    //loops through array of links, turns link to lowercase (case insensitive) and checks if the link text includes the word unsubscribe
    for (let i = 0; i < linkArray.length; i++) {
        const linkElement = linkArray[i];
        const linkText = $(linkElement).text().toLowerCase();   

        if (linkText.includes("unsubscribe")) {
        return linkElement.attribs.href
        }
    }
}

export default decodeString