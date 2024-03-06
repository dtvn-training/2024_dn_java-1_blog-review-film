import axios from "./customize-axios";


const fetchDataHome = () => {
    
    let query = '/api/home';
    return axios.get(query);
    
}

const fetchDataSearch = (text) => {
    let query = `/api/search?searchText=${text}`;
    return axios.get(query);
    
}

const fetchDataSearchBlog = (searchText) => {
    let query = `/api/blogs?searchText=${searchText}`;
    return axios.get(query);
    
}

const fetchDataBlogs = (page) => {
    return axios.get(`/api/blogs?page=${page}`);
}

const fetchDataBlogsByFilm = (filmId, page) => {
    return axios.get(`/api/blogs/film/${filmId}?page=${page}`);
}

const fetchDataSearchFilm = (searchText) => {
    let query = `/api/films?searchText=${searchText}`;
    return axios.get(query);
    
}

const fetchDataFilms = (page) => {
    return axios.get(`/api/films?page=${page}`);
}

export { fetchDataHome, fetchDataSearch, fetchDataSearchBlog, fetchDataBlogs, fetchDataFilms, fetchDataSearchFilm, fetchDataBlogsByFilm }