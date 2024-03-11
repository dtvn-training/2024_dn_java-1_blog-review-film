package com.dac.BackEnd.service;

import com.dac.BackEnd.model.response.SummaryResponse;

public interface DashboardService {

    SummaryResponse getInfoSummary();

    SummaryResponse getInfoSummaryByReviewer();
    
}
