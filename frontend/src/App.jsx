import { useState, useEffect } from "react"
import emailServices from './services/email'
import { FcGoogle } from "react-icons/fc"


const Subscriptions = ({ subscriptions }) => {
  return (
    <div>
      {subscriptions.map((s) => <p key={s.id}>Name: {s.name} | Email: {s.email}</p>)}
    </div>
  )
}


const App = () => {
  const [subscriptions, setSubscriptions] = useState([])

  useEffect(() => {emailServices.getAllUsers().then(initialSubscriptions => setSubscriptions(initialSubscriptions))}, [])

  return (
    <div>
      <h1>Hello</h1>
      <Subscriptions subscriptions={subscriptions} />

      <a href="http://localhost:3001/auth/google">
        <button>
          <FcGoogle />
          Sign in with Google
        </button>
      </a>
    </div>
  )
}

export default App