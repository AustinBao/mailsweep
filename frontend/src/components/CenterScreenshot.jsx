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

            <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mb-5"> 
                <button type="button" onClick={handleLoginClick} className="btn btn-primary btn-lg px-4 me-sm-3">Get Started</button> 
                <a href="https://github.com/AustinBao/mailsweep" target="_blank" rel="noopener noreferrer">
                    <button type="button" className="btn btn-outline-secondary btn-lg px-4">Github</button> 
                </a>
            </div>
        </div>
        <div className="overflow-hidden" style={{ maxHeight: "30vh" }}>
            <div className="container px-5"> 
                <img src="/imgs/linkedinProfPic_optimized_950.jpg" className="img-fluid border rounded-3 shadow-lg mb-4" alt="Example image" width="700" height="500" loading="lazy"/> 
            </div>
        </div>
    </div>
    )
}

export default CenterScreenshot