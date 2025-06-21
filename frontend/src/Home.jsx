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
  const [sortOption, setSortOption] = useState("most")
  const [filterOption, setFilterOption] = useState("none")

  const navigate = useNavigate()

  console.log("VITE_API_URL =", import.meta.env.VITE_API_URL);

  useEffect(() => {
  axios.get(`${import.meta.env.VITE_API_URL}/auth/check-auth`, { withCredentials: true })
    .then(() => {
      return Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/gmail`, { withCredentials: true }),
        axios.get(`${import.meta.env.VITE_API_URL}/subscriptions`, { withCredentials: true }),
        axios.get(`${import.meta.env.VITE_API_URL}/picture`, { withCredentials: true }),
      ]);
    })
    .then(([gmailRes, subsRes, picRes]) => {
      console.log("Subscriptions:", subsRes.data);
      console.log("Picture:", picRes.data);
      setMail(subsRes.data);        // subscriptions are what you display
      setProfilePic(picRes.data);   // shows top-right avatar
      setIsLoading(false);
    })
    .catch(err => {
      console.error("Not authenticated", err);
      navigate("/login");
    });
  }, []);


  //useEffect for updating page (senders, email counts, progress bar)
  useEffect(() => {
    const fetchGmailInChunks = async () => {
      let finished = false;

      while (!finished) {
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/gmail`, { withCredentials: true });
          if (res.data.done) {  // when backend returns {done: true}
            console.log("Finished reading inbox.");
            finished = true;
          } 

          const subscriptions = await axios.get(`${import.meta.env.VITE_API_URL}/subscriptions`, { withCredentials: true });
          setMail(subscriptions.data);
          setIsLoading(false);

          const counters = await axios.get(`${import.meta.env.VITE_API_URL}/mailcounter`, { withCredentials: true });
          setMailCounters(counters.data); 

          const userInfo = await axios.get(`${import.meta.env.VITE_API_URL}/gmail/userinfo`, { withCredentials: true })
          let totalMailRead = userInfo.data.totalMailParsed
          let inboxSize = userInfo.data.threadsTotal  
          console.log(totalMailRead)

          if (finished) {
            setProgress(100)
          } else { 
            setProgress((totalMailRead/inboxSize) * 100)    
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

  const handleRefresh = async () => {
    const toastElement = document.getElementById('refreshToast');
    const refreshToast = new bootstrap.Toast(toastElement);
    refreshToast.show();

    let finished = false;

    while (!finished) {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/gmail`, { withCredentials: true });
        console.log(res)
        if (res.data.done) {
          console.log("Finished reading inbox.");
          finished = true;
        } 
        
        const subscriptions = await axios.get(`${import.meta.env.VITE_API_URL}/subscriptions`, { withCredentials: true });
        setMail(subscriptions.data);
        setIsLoading(false);

        const counters = await axios.get(`${import.meta.env.VITE_API_URL}/mailcounter`, { withCredentials: true });
        setMailCounters(counters.data); 
          
      } catch (err) {
        console.error("Error while fetching NEW Gmail:", err);
        finished = true;
        setIsLoading(false);
      }
    }
  };

  function handleOnSubscribe (emailId) {
    const toastElement = document.getElementById('unsubToast');
    const unsubToast = new bootstrap.Toast(toastElement);
    unsubToast.show();

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
    const toastElement = document.getElementById('deleteToast');
    const deleteToast = new bootstrap.Toast(toastElement);
    deleteToast.show();

    setMail(prev =>
      prev.map(m => (m.id === emailId ? { ...m, is_deleted: true } : m))
    );

    setMailCounters(prev => ({ ...prev, [emailId]: 0 }));
  }

  const filteredAndSortedMail = [...mail]
  // Apply filterOption
  .filter(m => {
    if (filterOption === "active") return !m.is_unsubscribed;
    if (filterOption === "unsubscribed") return m.is_unsubscribed;
    if (filterOption === "deleted") return m.is_deleted;
    return true; // on none don't change order
  })
  // Apply searchBar (do this after filterOption so you don't show filtered emails)
  .filter(m =>
    (m.sender?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  )
  // Apply sortOption
  .sort((a, b) => {
    // Sort deleted to bottom
    if (a.is_deleted && !b.is_deleted) return 1;
    if (!a.is_deleted && b.is_deleted) return -1;

    if (sortOption === "most") {
      const aCount = mailCounters[a.id] ?? 0;
      const bCount = mailCounters[b.id] ?? 0;
      return bCount - aCount;
    } else if (sortOption === "alphabetical") {
      return a.sender.localeCompare(b.sender);
    } else if (sortOption === "least") {
      const aCount = mailCounters[a.id] ?? 0;
      const bCount = mailCounters[b.id] ?? 0;
      return aCount - bCount;
    } else if (sortOption === "oldest") {
      return a.latest_date - b.latest_date
    } else {
      return 0; // sorts recent by default
    }
  });

  return (
    <div>
      <Navbar 
        isLoggedIn={true} 
        profilePic={profilePic} 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        sortOption={sortOption}
        setSortOption={setSortOption} 
        filterOption={filterOption}
        setFilterOption={setFilterOption}
        onRefresh={handleRefresh} />

      {isLoading && (
        <div className="position-fixed top-50 start-50 translate-middle text-muted fs-2" style={{ zIndex: 1000, pointerEvents: 'none' }}>
          Looking through email...
        </div>
      )}
        
      <ProgressBar progress={progress}/>

      <div style={{marginLeft: "15%", marginRight: "15%"}}>
        <div className="d-flex justify-content-center my-2">

        </div>
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
            latestDate={i.latest_date}
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
