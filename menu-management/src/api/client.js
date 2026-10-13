import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error)
    }

    const { code, description, detail } = error.response?.data ?? {}
    const apiError = new Error(description ?? '서버 요청을 처리하지 못했습니다.')

    apiError.code = code
    apiError.detail = detail

    return Promise.reject(apiError)
  },
)

export default apiClient
