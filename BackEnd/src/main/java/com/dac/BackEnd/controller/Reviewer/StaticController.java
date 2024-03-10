package com.dac.BackEnd.controller.Reviewer;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dac.BackEnd.service.StaticService;

@RestController
@RequestMapping("api/reviewer/static")
public class StaticController {

    private static final Logger logger = LoggerFactory.getLogger(StaticController.class);
    @Autowired
    private StaticService staticService;

    // Other code...

    @GetMapping("/reviewerStats")
    public List<Map<String, Object>> getReviewerStats(@RequestParam("startTime") String startTime, @RequestParam("endTime") String endTime) {
        // Sử dụng DateTimeFormatter để parse chuỗi ngày tháng
        try{
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");
            LocalDateTime start = LocalDate.parse(startTime, formatter).atStartOfDay();
            LocalDateTime end = LocalDate.parse(endTime, formatter).atTime(LocalTime.MAX);
            return staticService.countPostsByReviewerInPeriod(start, end);
        }catch(Exception e){
            logger.error(e.getMessage());
            return null;
        
        }
    }

    @GetMapping("/filmStats")
    public List<Map<String, Object>> getFilmStats(@RequestParam("startTime") String startTime, @RequestParam("endTime") String endTime) {
        // Sử dụng DateTimeFormatter để parse chuỗi ngày tháng
        try{
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");
            LocalDateTime start = LocalDate.parse(startTime, formatter).atStartOfDay();
            LocalDateTime end = LocalDate.parse(endTime, formatter).atTime(LocalTime.MAX);
            return staticService.countPostsByFilmInPeriod(start, end);
        }catch(Exception e){
            logger.error(e.getMessage());
            return null;
        }
    }
}