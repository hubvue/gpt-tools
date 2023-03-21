import axios from 'axios'

const BASE_URL = 'https://gpt.cckim.cn/chatgpt'

export interface Response<T> {
  err: string | null
  message: string
  data: T
}

interface ConvertParams{
  input: string
  origin: string
  target: string
  mode: 'type' | 'code'
}

export const convert = (params: ConvertParams) => {
  return axios.post<Response<string>>(`${BASE_URL}/code-convert`, params)
}

axios.interceptors.request.use((config) => {
  if (config.method === 'post') {
    config.headers['Content-Type'] = 'multipart/form-data'
    const form = new FormData()
    for (const key in config.data) {
      form.append(key, config.data[key])
    }
    config.data = form
  }
  return config
})

axios.interceptors.response.use((res) => {
  return res.data
})
