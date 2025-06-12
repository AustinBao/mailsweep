import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Navbar = ({ isLoggedIn, profilePic, searchTerm, setSearchTerm, sortOption, setSortOption, filterOption, setFilterOption, onRefresh }) => {
    const navigate = useNavigate();

    const handleLoginClick = async () => {
        if (!isLoggedIn) {
            navigate("/login");
        } else {
            await axios.post("http://localhost:3001/auth/logout", {}, { withCredentials: true });
            console.log("User logged out");
            navigate("/");
        }
    };

    return (
        <nav className="navbar navbar-expand-xl navbar-light bg-white border-bottom sticky-top" style={{ zIndex: 1020 }}>
            <div className="container" style={{ maxWidth: "70%" }}>
                {/* Brand + Name */}
                <div className="navbar-brand d-flex align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="bi bi-inbox-fill" width="40" height="37" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M4.98 4a.5.5 0 0 0-.39.188L1.54 8H6a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0A.5.5 0 0 1 10 8h4.46l-3.05-3.812A.5.5 0 0 0 11.02 4zm-1.17-.437A1.5 1.5 0 0 1 4.98 3h6.04a1.5 1.5 0 0 1 1.17.563l3.7 4.625a.5.5 0 0 1 .106.374l-.39 3.124A1.5 1.5 0 0 1 14.117 13H1.883a1.5 1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .106-.374z" />
                    </svg>
                    <span className="fs-4 ps-2">Mail Sweep</span>
                </div>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarContent">
                    {isLoggedIn && (
                        <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center gap-2 mx-auto my-3" style={{ maxWidth: '500px', width: '100%' }}>
                            {/* Refresh button */}
                            <button type="button" className="btn btn-outline-secondary" onClick={onRefresh}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
                                </svg>
                            </button>
                            {/* Toast Message */}
                            <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
                                <div id="refreshToast" className="toast text-white bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
                                    <div className="toast-header bg-success text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-inbox-fill me-2" viewBox="0 0 16 16">
                                        <path d="M4.98 4a.5.5 0 0 0-.39.188L1.54 8H6a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0A.5.5 0 0 1 10 8h4.46l-3.05-3.812A.5.5 0 0 0 11.02 4zm-1.17-.437A1.5 1.5 0 0 1 4.98 3h6.04a1.5 1.5 0 0 1 1.17.563l3.7 4.625a.5.5 0 0 1 .106.374l-.39 3.124A1.5 1.5 0 0 1 14.117 13H1.883a1.5 1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .106-.374z" />
                                    </svg>
                                    <strong className="me-auto">Refresh Successful!</strong>
                                    <small>Mail Sweep</small>
                                    <button type="button" className="btn-close btn-close-white ms-2 mb-1" data-bs-dismiss="toast" aria-label="Close"></button>
                                    </div>
                                </div>
                            </div>
                            {/* Search bar */}
                            <input
                                className="form-control"
                                type="search"
                                placeholder="Search senders..."
                                aria-label="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {/* Sort dropdown */}
                            <div className="btn-group">
                                <button type="button" className="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-sort-down" viewBox="0 0 16 16">
                                        <path d="M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5M7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1z"/>
                                    </svg> 
                                </button>
                                <ul className="dropdown-menu">
                                    <li><button className="dropdown-item" onClick={() => setSortOption("most")}> Most Emails </button></li>
                                    <li><hr class="dropdown-divider"/></li>
                                    <li><button className="dropdown-item" onClick={() => setSortOption("least")}> Least Emails </button></li>
                                    <li><hr class="dropdown-divider"/></li>
                                    <li><button className="dropdown-item" onClick={() => setSortOption("recent")}> Most Recent </button></li>
                                    <li><hr class="dropdown-divider"/></li>
                                    <li><button className="dropdown-item" onClick={() => setSortOption("oldest")}> Least Recent </button></li>
                                    <li><hr class="dropdown-divider"/></li>
                                    <li><button className="dropdown-item" onClick={() => setSortOption("alphabetical")}> A → Z </button></li>
                                </ul>
                            </div>
                            {/* Filter dropdown */}
                            <div className="btn-group">
                                <button type="button" className="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-funnel-fill" viewBox="0 0 16 16">
                                    <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5z"/>
                                    </svg>
                                </button>
                                <ul className="dropdown-menu">
                                    <li><button className="dropdown-item" onClick={() => setFilterOption("none")}> None </button></li>
                                    <li><hr class="dropdown-divider"/></li>
                                    <li><button className="dropdown-item" onClick={() => setFilterOption("active")}> Active </button></li>
                                    <li><hr class="dropdown-divider"/></li>
                                    <li><button className="dropdown-item" onClick={() => setFilterOption("unsubscribed")}> Unsubscribed </button></li>
                                    <li><hr class="dropdown-divider"/></li>
                                    <li><button className="dropdown-item" onClick={() => setFilterOption("deleted")}> Deleted </button></li>
                                </ul>
                            </div>
                        </div>
                    )}

                    <div className="d-flex justify-content-center align-items-center ms-auto gap-2 my-3">
                        <button type="button" onClick={handleLoginClick} className="btn btn-primary d-flex align-items-center justify-content-center">
                            {isLoggedIn ? "Logout" : (
                                <>
                                    Login
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google ms-2" viewBox="0 0 16 16">
                                        <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z"></path>
                                    </svg>
                                </>
                            )}
                        </button>

                        {profilePic && (
                            <img src={profilePic} alt="Profile" onError={(e) => { e.target.src = "/profile.svg" }} style={{ width: "40px", borderRadius: "50%" }} />
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
