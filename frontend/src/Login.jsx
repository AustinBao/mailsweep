import { FcGoogle } from "react-icons/fc"
import "./css/login.css"
import Navbar from "./components/Navbar";

const Login = () => {
   return (
    <div>
      <div className="login-bkg d-flex align-items-center justify-content-center vh-100 bg-light">
        <div className="login-card text-center p-5 bg-white shadow rounded">
          <h1 className="mb-4 fw-light">Login to <strong>Mail Sweep</strong></h1>
          <a href="http://localhost:3001/auth/google" className="text-decoration-none">
            <button className="btn btn-outline-dark d-flex align-items-center gap-3 px-4 py-3 mx-auto">
              <FcGoogle size={24} />
              <span>Sign in with Google</span>
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login
