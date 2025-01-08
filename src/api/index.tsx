import axios from "axios";

const request = axios.create({
    baseURL: "https://676d57bd0e299dd2ddff3c52.mockapi.io/Product"
})

export {request}