import axios from 'axios';

const Card = ({ id, sender, sender_address, link, image, emailCount, isUnsubscribed, isDeleted, latestDate, onUnsubscribe, onDelete }) => {
    
    async function handleUnsubClick () {
        try{ 
            await axios.post(`https://mailsweep.up.railway.app/gmail/unsub`, {email_id: id}, { withCredentials: true })
            onUnsubscribe(id);
        } catch (err) {
            console.log("Error with unsubscribing: " + err);
        }
    }

    async function handleCleanInbox () {
        try{ 
            await axios.post(`https://mailsweep.up.railway.app/gmail/delete`, {subscription_id: id}, { withCredentials: true })
            onDelete(id); // updates parent state (marks card as deleted + resets counter)
        } catch (err) {
            console.log("Error with delete: " + err);
        }
    }

    function formatUnixTime(unix) {
        const date = new Date(unix * 1);
        return date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }


    return (
       <div className="card border-dark mb-3" style={{maxWidth: "18 rem", backgroundColor: isDeleted ? "#ffd6d6" : "white", transition: "background-color 0.3s ease"}}>
        <div className="card-header d-flex justify-content-between p-3" >
            <div className='d-flex align-items-center gap-3'>
                {/* Favicon image */}
                <img src={image} alt="favicon" style={{ width: "30px", height: "30px"}}/>
                {/* Sender name */}
                <h5 className="mb-0">{sender}</h5>
                {/* Email count */}
                <span className="badge rounded-pill text-bg-warning text-muted">
                    {emailCount === "Removed" ? "Removed" : `${emailCount} Email${emailCount > 1 ? "s" : ""}`}
                </span>
            </div>
            <span>{sender_address}</span> 
        </div>
        <div className="card-body">
            <div className='d-flex justify-content-between align-items-center mb-2'>
                <div className='d-flex gap-2 pb-3'>
                    <h5 className="card-title">Latest Email -</h5>
                    <p className="card-text">{formatUnixTime(latestDate)}</p>
                </div>
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
            

            {/* <p className="">Some quick example text to build on the card title and make up the bulk of the card’s content.</p> */}
            <div className="d-flex gap-4">
                <h4><a target="_blank" href={link} onClick={handleUnsubClick}>Unsubscribe</a></h4>
                <h4><a onClick={handleCleanInbox} href='#'>Clean Inbox</a></h4>
            </div>
            
            {/* Toast Message - Unsubscribe*/}
            <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1055 }}>
                <div id="unsubToast" className="toast text-white bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="true" data-bs-delay="2000">
                    <div className="toast-header bg-success text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-inbox-fill me-2" viewBox="0 0 16 16">
                        <path d="M4.98 4a.5.5 0 0 0-.39.188L1.54 8H6a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0A.5.5 0 0 1 10 8h4.46l-3.05-3.812A.5.5 0 0 0 11.02 4zm-1.17-.437A1.5 1.5 0 0 1 4.98 3h6.04a1.5 1.5 0 0 1 1.17.563l3.7 4.625a.5.5 0 0 1 .106.374l-.39 3.124A1.5 1.5 0 0 1 14.117 13H1.883a1.5 1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .106-.374z" />
                    </svg>
                    <strong className="me-auto">Unsubscribe Successful!</strong>
                    <small>Mail Sweep</small>
                    <button type="button" className="btn-close btn-close-white ms-2 mb-1" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            </div>
            {/* Toast Message - Delete*/}
            <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1055 }}>
                <div id="deleteToast" className="toast text-white bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="true" data-bs-delay="2000">
                    <div className="toast-header bg-success text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-inbox-fill me-2" viewBox="0 0 16 16">
                        <path d="M4.98 4a.5.5 0 0 0-.39.188L1.54 8H6a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0A.5.5 0 0 1 10 8h4.46l-3.05-3.812A.5.5 0 0 0 11.02 4zm-1.17-.437A1.5 1.5 0 0 1 4.98 3h6.04a1.5 1.5 0 0 1 1.17.563l3.7 4.625a.5.5 0 0 1 .106.374l-.39 3.124A1.5 1.5 0 0 1 14.117 13H1.883a1.5 1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .106-.374z" />
                    </svg>
                    <strong className="me-auto">Deletion Successful!</strong>
                    <small>Mail Sweep</small>
                    <button type="button" className="btn-close btn-close-white ms-2 mb-1" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            </div>

        </div>

        </div> 
    )
}

export default Card

