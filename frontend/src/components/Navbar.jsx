import react from "react"
import { useNavigate } from 'react-router-dom';

const Navbar = () => {

    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate("/login"); 
    };

    return (
        <div className="container"> 
            <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
                <div className="col-md-3 mb-2 mb-md-0"> 
                    <a href="/" className="d-inline-flex link-body-emphasis text-decoration-none"> 
                        <svg className="bi" width="40" height="32" role="img" aria-label="Bootstrap">
                            <use xlinkHref="#bootstrap"></use>
                        </svg> 
                        <svg xmlns="http://www.w3.org/2000/svg" className="bi bi-inbox-fill" width="40" height="32" role="img" aria-label="Bootstrap" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M4.98 4a.5.5 0 0 0-.39.188L1.54 8H6a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0A.5.5 0 0 1 10 8h4.46l-3.05-3.812A.5.5 0 0 0 11.02 4zm-1.17-.437A1.5 1.5 0 0 1 4.98 3h6.04a1.5 1.5 0 0 1 1.17.563l3.7 4.625a.5.5 0 0 1 .106.374l-.39 3.124A1.5 1.5 0 0 1 14.117 13H1.883a1.5 1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .106-.374z"/>
                        </svg>
                        <span className="fs-5 ps-2">Mail Sweep</span> 
                    </a> 
                    </div> 
                        <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0"> 
                            <li><a href="#" className="nav-link px-2 link-secondary">Home</a></li> 
                            <li><a href="#" className="nav-link px-2">Features</a></li> 
                            <li><a href="#" className="nav-link px-2">Pricing</a></li> 
                            <li><a href="#" className="nav-link px-2">FAQs</a></li> 
                            <li><a href="#" className="nav-link px-2">About</a></li> 
                        </ul> <div className="col-md-3 text-end"> 
                    <button type="button" onClick={handleLoginClick} className="btn btn-primary">Login</button> 
                </div> 
            </header> 
        </div>
    )
}

export default Navbar
