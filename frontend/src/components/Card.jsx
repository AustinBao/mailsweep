const Card = ({ sender, link }) => {
    return (
       <div class="card border-dark mb-3" style={{maxWidth: "18 rem"}}>
        <div class="card-header p-3" >{sender}</div>
        <div class="card-body">
            <h5 class="card-title">Dark card title</h5>
            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
            <h4><a href={link}>Unsubscribe</a></h4>
        </div>
        </div> 
    )
}

export default Card