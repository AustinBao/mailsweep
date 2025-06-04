import { useEffect, useState } from "react"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Card from "./components/Card";
import ProgressBar from "./components/ProgressBar";
import Footer from "./components/Footer";

const Home = () => {
  const [mail, setMail] = useState([])
  const [profilePic, setProfilePic] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0)
  const [mailCounters, setMailCounters] = useState({})
  const [sortOption, setSortOption] = useState("alphabetical")

  const navigate = useNavigate()

  useEffect(function checkAuthAndFetch() {
    axios.get("http://localhost:3001/auth/check-auth", { withCredentials: true })
    .then(() => axios.get("http://localhost:3001/gmail", { withCredentials: true }))
    .then(() => axios.get("http://localhost:3001/subscriptions", { withCredentials: true }))
    .then(res => setMail(res.data))
    .then(() => axios.get("http://localhost:3001/picture", { withCredentials: true }))
    .then(res => setProfilePic(res.data))
    .catch(err => { 
      console.error("Not authenticated", err);
      navigate("/login");
    });
  }, []);  

  //useEffect for updating page (senders, email counts, progress bar)
  useEffect(() => {
    //fetches total number of emails in inbox (positioned here because otherwise the useEffect would run without the total being updated properly)
    let total;
    axios.get("http://localhost:3001/gmail/userinfo", { withCredentials: true })
    .then(res => { 
      //just incase the inbox is fully empty because a few lines down there could be division by 0
      if (res.data === 0) {
        total = 1
      } else {
        total = res.data
      }
    })
    const fetchGmailInChunks = async () => {
      let finished = false;

      while (!finished) {
        try {
          const res = await axios.get("http://localhost:3001/gmail", { withCredentials: true });
          if (res.data.done) {  // when backend returns {done: true}
            console.log("Finished reading inbox.");
            finished = true;
          } 

          const subscriptions = await axios.get("http://localhost:3001/subscriptions", { withCredentials: true });
          setMail(subscriptions.data);
          setIsLoading(false);

          const counters = await axios.get("http://localhost:3001/mailcounter", { withCredentials: true });
          setMailCounters(counters.data); 

          var totalMailRead = 0
          for (const key in counters.data) {
            if (counters.data.hasOwnProperty(key)) {
              totalMailRead += counters.data[key]
              }
            }  

          if (finished) {
            setProgress(100)
          } else { 
            setProgress((totalMailRead/total) * 100)
          }
            
        } catch (err) {
          console.error("Error while fetching Gmail:", err);
          finished = true;
          setIsLoading(false);
        }
      }
    };
    fetchGmailInChunks();
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

  function handleOnDelete(emailId) {
    setMail(prev =>
      prev.map(m => (m.id === emailId ? { ...m, is_deleted: true } : m))
    );
    setMailCounters(prev => ({ ...prev, [emailId]: 0 }));
  }

  const filteredAndSortedMail = [...mail]
  .filter(m => m.sender.toLowerCase().includes(searchTerm.toLowerCase()))
  .sort((a, b) => {
    // Sort deleted to bottom
    if (a.is_deleted && !b.is_deleted) return 1;
    if (!a.is_deleted && b.is_deleted) return -1;

    if (sortOption === "most") {
      // Sort by most emails
      const aCount = mailCounters[a.id] ?? 0;
      const bCount = mailCounters[b.id] ?? 0;
      return bCount - aCount;
    } else {
      // Default: alphabetical
      return a.sender.localeCompare(b.sender);
    }
  });


  return (
    <div>
      <Navbar isLoggedIn={true} profilePic={profilePic} searchTerm={searchTerm} setSearchTerm={setSearchTerm} sortOption={sortOption} setSortOption={setSortOption} />

      {isLoading && (
        <div className="position-fixed top-50 start-50 translate-middle text-muted fs-2" style={{ zIndex: 1000, pointerEvents: 'none' }}>
          Looking through email...
        </div>
      )}
        
      <ProgressBar progress={progress}/>

      <div style={{marginLeft: "15%", marginRight: "15%"}}>
        <div className="d-flex justify-content-center my-2">

        </div>
        {/* <button className="btn btn-primary">hello</button> */}
        {filteredAndSortedMail.map((i, index) => (
          <Card 
            key={index} 
            id={i.id} 
            sender={i.sender} 
            sender_address={i.sender_address} 
            link={i.unsubscribe_link} 
            image={i.domain_pic}
            emailCount={i.is_deleted ? "Removed" : (mailCounters[i.id] + 1)}
            isUnsubscribed={i.is_unsubscribed}
            isDeleted={i.is_deleted}
            onUnsubscribe={handleOnSubscribe} 
            onDelete={handleOnDelete}
          /> 
        ))}
      </div>  
      <Footer />

    </div>
  )
}

export default Home
