const ProgressBar = ({ progress }) => {
    return (
        <div className="d-flex flex-column align-items-center bg-white" 
        style={{ 
            width: "100%", 
            // position: 'sticky', 
            top: '50px', 
            zIndex: '1010', 
            paddingLeft: '15%', 
            paddingRight: '15%'
        }}
        >
            <p className="mb-1 fw-bold">{ progress === 100 ? 'Inbox Read' : 'Inbox Progress'}</p>
            <div className="progress mb-3" style={{ height: "15px", width: "100%" }}>
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