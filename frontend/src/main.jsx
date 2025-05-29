import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom' 
// BrowserRouter watches the browser's URL and gives route-related tools the info they need to show the right page or navigate
import App from './App'
import Home from './Home'
import Login from "./Login"

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>  
    <Routes> 
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  </BrowserRouter> 
)