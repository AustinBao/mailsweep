import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Navbar = ({ isLoggedIn, profilePic, searchTerm, setSearchTerm }) => {

    const navigate = useNavigate();

    //modularise handleLoginClick and handleLogoutClick then onClick function has conditional to determine what onclick function is passed?
    const handleLoginClick = async () => {
        if (!isLoggedIn) {
            navigate("/login"); 
        } else if (isLoggedIn) {
            // modularise this function
            await axios.post("http://localhost:3001/logout", {}, { withCredentials: true });
            console.log("User logged out");
            navigate("/")
        }
    };

    return (
        <div className="container"> 
            <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
                <div className="col-md-3 mb-2 mb-md-0"> 
                    <div className="d-inline-flex"> 
                        <svg className="bi" width="40" height="32" role="img" aria-label="Bootstrap">
                            <use xlinkHref="#bootstrap"></use>
                        </svg> 
                        <svg xmlns="http://www.w3.org/2000/svg" className="bi bi-inbox-fill" width="40" height="32" role="img" aria-label="Bootstrap" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M4.98 4a.5.5 0 0 0-.39.188L1.54 8H6a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0A.5.5 0 0 1 10 8h4.46l-3.05-3.812A.5.5 0 0 0 11.02 4zm-1.17-.437A1.5 1.5 0 0 1 4.98 3h6.04a1.5 1.5 0 0 1 1.17.563l3.7 4.625a.5.5 0 0 1 .106.374l-.39 3.124A1.5 1.5 0 0 1 14.117 13H1.883a1.5 1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .106-.374z"/>
                        </svg>
                        <span className="fs-5 ps-2">Mail Sweep</span> 
                    </div> 
                    </div> 
                        <div className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0"> 

                            {isLoggedIn && (
                                <div className="d-flex" role="search" style={{ width: "300px" }}>
                                    <input 
                                    className="form-control me-2" 
                                    type="search" 
                                    placeholder="Search senders..." 
                                    aria-label="Search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            )}

                        </div> 
                    <div className="col-md-3 text-end"> 

                    <div className="col-md-9 text-end d-flex align-items-center justify-content-end gap-3">
                        <button type="button" onClick={handleLoginClick} className="btn btn-primary">{isLoggedIn ? "Logout": "Login"}</button> 

                        {profilePic && (
                            <img src={profilePic} alt="Profile" style={{ width: "40px", borderRadius: "50%" }}/>
                        )}
                        
                    </div> 
                </div> 
            </header> 
        </div>
    )
}

export default Navbar
