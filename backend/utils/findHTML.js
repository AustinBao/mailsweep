function findHTML(payload) {
    let decodedString
    if (payload.mimeType == "text/html" || payload.mimeType == "text/plain"){
    decodedString = Buffer.from(payload.body.data, 'base64').toString('utf-8');
    return decodedString
    } else if (payload.mimeType == "multipart/alternative" || payload.mimeType == "multipart/mixed" || payload.mimeType == 'multipart/report' || payload.mimeType == 'multipart/related') {  // handles multipart/alternative or mixed
    var parts = payload.parts

    while (parts.length) {
        //shift removes the first element of an array and returns it
        var part = parts.shift()
        if (part.parts) {
        parts = parts.concat(part.parts)
        } else if (part.mimeType === 'text/html') {
        decodedString = Buffer.from(part.body.data, 'base64').toString('utf-8')
        return decodedString
        }
    }
    } else {
    console.log(payload.mimeType)
    }
}

export default findHTML