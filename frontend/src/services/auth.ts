import axios from './api';
export const register = (name:string,email:string,password:string) => axios.post('/auth/register',{name,email,password});
export const login = (email:string,password:string) => axios.post('/auth/login',{email,password});
