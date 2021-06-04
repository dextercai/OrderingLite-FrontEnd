import axios from 'axios'

// create an axios instance
const service = axios.create({
	baseURL: process.env.VUE_APP_API_SRC, // url = base url + request url
	withCredentials: true, // send cookies when cross-domain requests
	timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
	config => {
		config.headers['X-Token'] = localStorage.getItem('sessionToken')
		return config
	},
	error => {
		// do something with request error
		console.log(error) // for debug
		return Promise.reject(error)
	}
)

export default service
