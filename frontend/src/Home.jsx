import { useEffect, useState } from "react"
import emailServices from './services/email'

const Home = () => {
  const [mail, setMail] = useState([])

  useEffect(() => {
    emailServices.getMail().then(data => {
      console.log(data)
      setMail(data)
    })
  }, [])

  return (
    <div>
      <h1>Welcome to the home page!</h1>
      <div>
        {mail.messages?.map((msg, index) => (
          <p key={index}>Message ID: {msg.id}</p>
        ))}
      </div>
    </div>
  )
}

export default Home
