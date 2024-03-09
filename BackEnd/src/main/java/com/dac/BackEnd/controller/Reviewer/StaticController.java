package com.dac.BackEnd.controller.Reviewer;

import com.dac.BackEnd.service.BlogService;
import com.dac.BackEnd.service.StaticService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("api/reviewer/static")
public class StaticController {

    @Autowired
    private StaticService staticService;

    // Other code...

    @GetMapping("/reviewerStats")
    public List<Map<String, Object>> getReviewerStats(@RequestParam("startTime") String startTime, @RequestParam("endTime") String endTime) {
        LocalDateTime start = LocalDateTime.parse(startTime);
        LocalDateTime end = LocalDateTime.parse(endTime);
        return staticService.countPostsByReviewerInPeriod(start, end);
    }
}