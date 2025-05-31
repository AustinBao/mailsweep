import axios from 'axios';

const Card = ({ id, sender, sender_address, link, image }) => {

    async function handleUnsubClick () {
        try{ 
            const result = await axios.post("http://localhost:3001/unsub", {email_id: id}, { withCredentials: true })
            console.log(result)
        } catch (err) {
            console.log("Error with unsubscribing" + err);
        }
    }

    return (
       <div className="card border-dark mb-3" style={{maxWidth: "18 rem"}}>
        <div className="card-header d-flex justify-content-between p-3" >
            <div className='d-flex align-items-center gap-2'>
                <img
                    src={image}
                    alt="favicon"
                    style={{ width: "30px", height: "30px", marginRight: "10px" }}
                />
                <h5 className="mb-0">{sender}</h5>
            </div>
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

