const routes = {
    login: "/login",
    register: "/register",
    home: "/",
    blogdetail: "/blogs/:id",
    allBlogs: "/blogs",
    allFilms: "/films",

    // Reviewer routes
    dashboardReviewer: "/reviewer",
    blogdetailReviewer: "/reviewer/blogs/:id",
    filmsReviewer: "/reviewerer/films",
    addBlog: "/reviewer/blogs/add",
    editBlog: "/reviewer/blogs/edit/:id",
  
    // Admin routes
    dashboardAdmin: "/admin",
    blogsAdmin: "/admin/blogs",
    blogDetailAdmin: "/admin/blogs/:id",
    filmsAdmin: "/admin/films",
    reviewersAdmin: "/admin/reviewers",
  
    addBlog: "/admin/blogs/add",
    addFilm: "/admin/films/add",
    addReviewer: "/admin/reviewers/add",
  
    editBlog: "/admin/blogs/edit/:id",
    editFilm: "/admin/films/edit/:id",
    editReviewer: "/admin/reviewers/edit/:id",
  };
  
  export default routes;