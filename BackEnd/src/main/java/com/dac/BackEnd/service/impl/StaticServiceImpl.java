package com.dac.BackEnd.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dac.BackEnd.repository.BlogRepository;
import com.dac.BackEnd.service.StaticService;


@Service
public class StaticServiceImpl implements StaticService {

    @Autowired
    private BlogRepository blogRepository;

    public List<Map<String, Object>> countPostsByReviewerInPeriod(LocalDateTime startTime, LocalDateTime endTime) {
        return blogRepository.countPostsByReviewerInPeriod(startTime, endTime);
    }

    public List<Map<String, Object>> countPostsByFilmInPeriod(LocalDateTime startTime, LocalDateTime endTime) {
        return blogRepository.countPostsByFilmInPeriod(startTime, endTime);
    }
}