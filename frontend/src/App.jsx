import { useState, useEffect } from "react"
import emailServices from './services/email'

const Subscriptions = ({ subscriptions }) => {
  return (
    <div>
      {subscriptions.map((s) => <p key={s.id}>address: {s.address}</p>)}
    </div>
  )
}

const App = () => {
  const [subscriptions, setSubscriptions] = useState([])

  useEffect(() => {emailServices.getAll().then(initialSubscriptions => setSubscriptions(initialSubscriptions))}, [])

  return (
    <div>
      <h1>Hello</h1>
      <Subscriptions subscriptions={subscriptions} />
    </div>
  )
}

export default App