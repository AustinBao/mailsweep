function findSender(headers) { 
    let fromHeader;
    for (let i = 0; i < headers.length; i++) {
        const header = headers[i];
        if (header.name.toLowerCase() === "from") {
            fromHeader = header;
            break; 
        }
    }
    const sender = fromHeader ? fromHeader.value : "Unknown sender";

    return sender
}

export default findSender