const Card = ({ sender, sender_address, link, image}) => {
    return (
       <div className="card border-dark mb-3" style={{maxWidth: "18 rem"}}>
        <div className="card-header d-flex gap-2 p-3" >
            <img
                src={image}
                alt="favicon"
                style={{ width: "24px", height: "24px", marginRight: "10px" }}
            />
            {sender}
            {sender_address}
        </div>
        <div className="card-body">
            <h5 className="card-title">Dark card title</h5>
            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
            <h4><a href={link}>Unsubscribe</a></h4>
        </div>
        </div> 
    )
}

export default Card

