import { useEffect, useState } from "react"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Card from "./components/Card";

const Home = () => {
  const [mail, setMail] = useState([])
  const [profilePic, setProfilePic] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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

  function handleOnSubscribe (emailId) {
    setMail(prev =>
      prev.map(m => {
        if (m.id === emailId) {
          return { ...m, is_unsubscribed: true };   // ...m means everything the same as prev array
        } else {
          return m;
        }
      })
    );
  }

  const filteredAndSortedMail = [...mail].sort((a, b) => {
    const aStartsWith = a.sender.toLowerCase().startsWith(searchTerm.toLowerCase());
    const bStartsWith = b.sender.toLowerCase().startsWith(searchTerm.toLowerCase());

    if (aStartsWith && !bStartsWith) return -1;
    if (!aStartsWith && bStartsWith) return 1;
    return 0;
  });

  return (
    <div>
      <Navbar isLoggedIn={true} profilePic={profilePic} searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
  
      <div style={{marginLeft: "15%", marginRight: "15%"}}>
        {/* <button className="btn btn-primary">hello</button> */}
        {filteredAndSortedMail.map((i, index) => (
          <Card 
            key={index} 
            id={i.id} 
            sender={i.sender} 
            sender_address={i.sender_address} 
            link={i.unsubscribe_link} 
            image={i.domain_pic}
            isUnsubscribed={i.is_unsubscribed}
            onUnsubscribe={handleOnSubscribe} /> 
        ))}
      </div>  
    </div>
  )
}

export default Home
