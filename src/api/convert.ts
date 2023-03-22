import axios from 'axios'
import { BASE_URL, type Response } from './config'

interface ConvertParams{
  input: string
  origin: string
  target: string
  mode: 'type' | 'code'
}

export const convert = (params: ConvertParams) => {
  return axios.post<Response<string>>(`${BASE_URL}/code-convert`, params)
}
