import { useNavigate } from 'react-router-dom';

const CenterScreenshot = () => {

    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate("/login"); 
    };

    return (
    <div className="px-4 pt-5 my-5 text-center border-bottom">
        <h1 className="display-4 fw-bold text-body-emphasis">Clean Inbox. Clear Mind.</h1>
        <div className="col-lg-6 mx-auto">
            <p className="lead mb-4">
            Instantly clean and organize your Gmail with Mail Sweep — the smart tool that helps you unsubscribe from unwanted emails, declutter your inbox, and take back control. No more digging through spam or endless scrolls — just a lighter, cleaner inbox in one click.
            </p>

            <div className="d-grid gap-2 d-sm-flex align-items-center justify-content-center mb-5"> 
                <button type="button" onClick={handleLoginClick} className="btn btn-primary btn-lg px-3 d-flex align-items-center justify-content-center gap-2 me-sm-3">
                    Get Started
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-arrow-right-short" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"/>
                    </svg>
                </button> 

                <a href="https://github.com/AustinBao/mailsweep" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                    <button type="button" className="btn btn-outline-secondary btn-lg px-4 d-flex align-items-center justify-content-center gap-2"> 
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-github" viewBox="0 0 16 16">
                         <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
                        </svg> 
                        Github
                    </button> 
                </a>
            </div>
        </div> 
        <div className="overflow-hidden" style={{ maxHeight: "30vh" }}>
            <div className="container px-5"> 
                <img src="/imgs/homess.png" className="img-fluid border rounded-3 shadow-lg mb-4" alt="Example image" width="700" height="500" loading="lazy"/> 
            </div>
        </div>
    </div>
    )
}

export default CenterScreenshot