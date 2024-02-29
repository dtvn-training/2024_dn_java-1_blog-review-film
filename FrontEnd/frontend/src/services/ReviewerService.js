import axios from "./customize-axios";

  const fetchSummaryData = (accessToken) => {
    const query = `/api/reviewer/dashboard`;
    return axios.get(query, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
   
  };
  
  export { fetchSummaryData };