package com.dac.BackEnd.model.response;

import java.util.List;

import com.dac.BackEnd.model.Blog;
import com.dac.BackEnd.model.Film;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HomeResponse {
    private List<Blog> recentBlogs;
    private List<Film> topFilms;
}
