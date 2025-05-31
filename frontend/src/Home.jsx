import { useEffect, useState } from "react"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Card from "./components/Card";

const Home = () => {
  const [mail, setMail] = useState([])
  const [profilePic, setProfilePic] = useState("");

  const navigate = useNavigate()

  useEffect(function checkAuthAndFetch() {
    axios.get("http://localhost:3001/api/check-auth", { withCredentials: true })
    .then(() => axios.get("http://localhost:3001/api/gmail", { withCredentials: true }))
    .then(() => axios.get("http://localhost:3001/api/subscriptions", { withCredentials: true }))
    .then(res => setMail(res.data))
    .then(() => axios.get("http://localhost:3001/api/people", { withCredentials: true }))
    .then(res => setProfilePic(res.data))
    .catch(err => {
      console.error("Not authenticated", err);
      navigate("/login");
    });
}, []); 


  return (
    <div>
      <Navbar isLoggedIn={true} profilePic={profilePic}/>
      
      <div style={{marginLeft: "15%", marginRight: "15%"}}>
        {mail.map((i) => (
          <Card key={i.id} sender={i.sender} sender_address={i.sender_address} link={i.unsubscribe_link}/> 
        ))}
      </div>  

      
    </div>
  )
}

export default Home
