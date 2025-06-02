import axios from 'axios';

const Card = ({ id, sender, sender_address, link, image, isUnsubscribed, onUnsubscribe, emailCount }) => {

    async function handleUnsubClick () {
        try{ 
            await axios.post("http://localhost:3001/unsub", {email_id: id}, { withCredentials: true })
            onUnsubscribe(id);
        } catch (err) {
            console.log("Error with unsubscribing: " + err);
        }
    }

    async function handleCleanInbox () {
        try{ 
            await axios.post("http://localhost:3001/delete", {subscription_id: id}, { withCredentials: true })
        
        } catch (err) {
            console.log("Error with delete: " + err);
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
                <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-primary mx-2" style={{borderRadius: '0%'}}>{(emailCount > 1) ? `${emailCount} Emails` : `1 Email` }</span>
                </div>
            </div>
            <span>{sender_address}</span> 
        </div>
        <div className="card-body">
            <div className='d-flex justify-content-between align-items-center mb-2'>
            <h5 className="card-title">Dark card title</h5>
            <div className='d-flex align-items-center gap-2'>
            <span
                style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                marginLeft: "40px",
                backgroundColor: isUnsubscribed ? "red" : "green",
                display: "inline-block",
                }}
                
            ></span>
            <p className="mb-0">{isUnsubscribed ? "Unsubscribed" : "Active Subscription"}</p>
            </div>

            </div>
            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
            <div className="d-flex gap-5">
                <h4><a target="_blank" href={link} onClick={handleUnsubClick}>Unsubscribe</a></h4>
                <h4><a onClick={handleCleanInbox} href='#'>Clean Inbox</a></h4>
            </div>
        </div>

        </div> 
    )
}

export default Card

