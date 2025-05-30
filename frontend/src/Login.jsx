import { FcGoogle } from "react-icons/fc"

const Login = () => {
   return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="text-center p-5 bg-white shadow rounded">
        <h1 className="mb-4">Login</h1>
        <a href="http://localhost:3001/auth/google" className="text-decoration-none">
          <button className="btn btn-outline-dark d-flex align-items-center gap-2 px-4 py-2">
            <FcGoogle size={24} />
            <span>Sign in with Google</span>
          </button>
        </a>
      </div>
    </div>
  );
}

export default Login
