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
            await axios.post("http://localhost:3001/auth/logout", {}, { withCredentials: true });
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
                        <svg xmlns="http://www.w3.org/2000/svg" className="bi bi-inbox-fill" width="40" height="37" role="img" aria-label="Bootstrap" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M4.98 4a.5.5 0 0 0-.39.188L1.54 8H6a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0A.5.5 0 0 1 10 8h4.46l-3.05-3.812A.5.5 0 0 0 11.02 4zm-1.17-.437A1.5 1.5 0 0 1 4.98 3h6.04a1.5 1.5 0 0 1 1.17.563l3.7 4.625a.5.5 0 0 1 .106.374l-.39 3.124A1.5 1.5 0 0 1 14.117 13H1.883a1.5 1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .106-.374z"/>
                        </svg>
                        <span className="fs-4 ps-2">Mail Sweep</span> 
                    </div> 
                    </div> 
                        <div className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0"> 

                            {isLoggedIn && (
                                <div className="d-flex" role="search" style={{ width: "350px" }}>
                                    <input 
                                    className="form-control me-2" 
                                    type="search" 
                                    placeholder="Search senders..." 
                                    aria-label="Search senders"
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                    />
                                </div>
                            )}

                        </div> 
                        
                    <div className="col-md-3 text-end"> 

                    <div className="col-md-9 text-end d-flex align-items-center justify-content-end gap-3">
                        <button type="button" onClick={handleLoginClick} className="btn btn-primary d-flex align-items-center justify-content-center">
                            <>
                            {isLoggedIn ? "Logout" : (
                                <>
                                Login
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google ms-2" viewBox="0 0 16 16">
                                    <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z"></path>
                                </svg>
                                </>
                            )}
                            </>
                        </button> 

                        {profilePic && (
                            <img src={profilePic}  onError={(e) => { e.target.src = "/profile.svg" }} alt="Profile" style={{ width: "40px", borderRadius: "50%" }}/>
                        )}
                        
                    </div> 
                </div> 
            </header> 
        </div>
    )
}

export default Navbar
