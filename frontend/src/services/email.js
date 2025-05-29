import axios from 'axios'

const baseURL = 'http://localhost:3001'

const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true  // needed for gmail api auth. sends cookie back
})

const getAllUsers = () => {
  const request = axiosInstance.get(baseURL + "/api/subscriptions")
  return request.then(response => response.data)
}

const getMail = () => {
  const request = axiosInstance.get(baseURL + "/api/gmail")
  return request.then(response => response.data)
}

export default {
  getAllUsers,
  getMail
}