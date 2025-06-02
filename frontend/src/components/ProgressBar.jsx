const ProgressBar = ({ progress, totalMail }) => {
    return (
        <div className="progress mb-3" style={{ height: "10px", width: "55%" }}>
        <div className="progress-bar" 
             role="progressbar" 
             style={{ width: "75%" }} 
             aria-valuenow="25" 
             aria-valuemin="0" 
             aria-valuemax="100">

             </div>

        </div>
    )
}   

export default ProgressBar