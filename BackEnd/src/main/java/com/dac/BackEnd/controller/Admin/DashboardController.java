package com.dac.BackEnd.controller.Admin;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dac.BackEnd.constant.SuccessConstants;
import com.dac.BackEnd.exception.MessageException;
import com.dac.BackEnd.model.response.Response;
import com.dac.BackEnd.model.response.ResponseBody;
import com.dac.BackEnd.service.DashboardService;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("api/admin/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;
    

    @GetMapping()
    public ResponseEntity<?> getInfoSummary() {
        try {
            ResponseBody body = new ResponseBody();
            body.setCode(SuccessConstants.OK_CODE);
            body.setData(dashboardService.getInfoSummary());
            body.setMessage(Arrays.asList(SuccessConstants.OK_MESSAGE, SuccessConstants.OK_CODE));
            return ResponseEntity.ok().body(body);
        } catch (MessageException e) {
            Response body = new Response();
            body.setCode(e.getErrorCode());
            body.setMessage(Arrays.asList(e));
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
        }
    }
    
}
