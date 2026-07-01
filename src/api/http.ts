import axios from 'axios'

const http = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
})

export default http
