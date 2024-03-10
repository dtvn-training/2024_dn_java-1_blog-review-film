package com.dac.BackEnd.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;



public interface StaticService {
    public List<Map<String, Object>> countPostsByReviewerInPeriod(LocalDateTime startTime, LocalDateTime endTime);
    public List<Map<String, Object>> countPostsByFilmInPeriod(LocalDateTime startTime, LocalDateTime endTime);
}
