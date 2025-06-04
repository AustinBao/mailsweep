const ProgressBar = ({ progress }) => {
    return (
        <div className="d-flex flex-column align-items-center" style={{ width: "100%" }}>
            <p className="mb-1 fw-bold">Inbox Progress</p>
            <div className="progress mb-3" style={{ height: "10px", width: "100%" }}>
                <div 
                    className="progress-bar" 
                    role="progressbar" 
                    style={{ width: `${progress}%` }} 
                    aria-valuenow={progress} 
                    aria-valuemin="0" 
                    aria-valuemax="100">
                </div>
            </div>
        </div>
    );
}

export default ProgressBar