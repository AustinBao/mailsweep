import { useState, useEffect } from "react"
import { FcGoogle } from "react-icons/fc"

const Login = () => {
  return (
    <div>
        <h1>Login page</h1>

        <a href="http://localhost:3001/auth/google">
        <button>
          <FcGoogle />
          Sign in with Google
        </button>
      </a>
    </div>
  )
}

export default Login
