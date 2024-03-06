package com.dac.BackEnd.service;

import java.util.List;

import com.dac.BackEnd.model.response.HomeResponse;

public interface HomeService {

    HomeResponse getBlogRecentAndTopFilm();

    List<Object> getAllSearchHome(String searchText);
    
}
