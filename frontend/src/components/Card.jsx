import axios from 'axios';

const Card = ({ sender, sender_address, link, image }) => {

    async function handleUnsubClick () {
        await axios.post("http://localhost:3001/unsub", {id: id}, { withCredentials: true })
    }

    return (
       <div className="card border-dark mb-3" style={{maxWidth: "18 rem"}}>
        <div className="card-header d-flex justify-content-between p-3" >
            <img
                src={image}
                alt="favicon"
                style={{ width: "24px", height: "24px", marginRight: "10px" }}
            />
            <h5>{sender}</h5>
            <span>{sender_address}</span> 
        </div>
        <div className="card-body">
            <h5 className="card-title">Dark card title</h5>
            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
            <div className="d-flex gap-4">
                <h4><a target="_blank" href={link} onClick={handleUnsubClick}>Unsubscribe</a></h4>
                {/* <h4><a target="_blank" style={{ color: "red" }} href={link}>Clear Inbox</a></h4> */}
            </div>
        </div>
        </div> 
    )
}

export default Card

