import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom' 
import 'bootstrap/dist/css/bootstrap.min.css';

// BrowserRouter watches the browser's URL and gives route-related tools the info they need to show the right page or navigate
import App from './App'
import Home from './Home'
import Login from "./Login"
import PrivacyPolicy from './PrivacyPolicy'
import TermsOfService from './TermsOfService'

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>  
    <Routes> 
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
    </Routes>
  </BrowserRouter> 
)