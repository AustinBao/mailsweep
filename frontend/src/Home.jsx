import { useEffect, useState } from "react"
import emailServices from './services/email'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [mail, setMail] = useState([])
  const navigate = useNavigate()

  useEffect(function checkAuthAndFetch() {
    axios.get("http://localhost:3001/api/check-auth", { withCredentials: true })
    .then(res => {
      console.log("User is authenticated");
      return axios.get("http://localhost:3001/api/gmail", { withCredentials: true });
    })
    .then(res => {
      setMail(res.data);
    })
    .catch(err => {
      console.error("Not authenticated", err);
      navigate("/login")
    });
  }, []);


  async function HandleLogoutButton() {
    try {
      await axios.post("http://localhost:3001/logout", {}, { withCredentials: true });
      console.log("User logged out");
      navigate('/'); 
    } catch(error) {
      console.log("Failed to logout: " + error);
    }
  } 

  return (
    <div>
      <h1>Welcome to the home page!</h1>
      
      <button onClick={HandleLogoutButton}>Logout</button>

      <div>
        {mail.messages?.map((msg, index) => (
          <p key={index}>Message ID: {msg.id}</p>
        ))}
      </div>  

      
    </div>
  )
}

export default Home
