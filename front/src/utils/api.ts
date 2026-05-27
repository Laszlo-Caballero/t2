import axios from "axios";
import { VAR } from "../config/const";

export const api = axios.create({
  baseURL: VAR.api,
});
