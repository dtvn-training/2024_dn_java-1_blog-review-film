import axios from "./customize-axios";


const fetchDataHome = () => {
    
    let query = '/api/home';
    return axios.get(query);
    
}

export { fetchDataHome }