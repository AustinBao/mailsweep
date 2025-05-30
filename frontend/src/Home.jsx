import { useEffect, useState } from "react"
import emailServices from './services/email'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Card from "./components/Card";

const Home = () => {
  const [mail, setMail] = useState([])
  const navigate = useNavigate()

  useEffect(function checkAuthAndFetch() {
    axios.get("http://localhost:3001/api/check-auth", { withCredentials: true })
    .then(res => {
      console.log("User is authenticated");
      return axios.get("http://localhost:3001/api/subscriptions", { withCredentials: true });
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
      <Navbar isLoggedIn={true}/>
      
      {/* <button onClick={HandleLogoutButton}>Logout</button> */}

      <div style={{marginLeft: "15%", marginRight: "15%"}}>
        {mail.map((i) => (
          <Card key={i.id} sender={i.sender_address} link={i.unsubscribe_link} /> 
        ))}
      </div>  

      
    </div>
  )
}

export default Home
