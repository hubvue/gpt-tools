import axios from 'axios'
import { BASE_URL, type Response } from './config'

interface VariableParams{
  input: string
}

export const variableName = (params: VariableParams) => {
  return axios.post<Response<string>>(`${BASE_URL}/variable-name`, params)
}
