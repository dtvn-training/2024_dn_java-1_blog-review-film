package com.dac.BackEnd.controller.Admin;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dac.BackEnd.constant.SuccessConstants;
import com.dac.BackEnd.convertor.BlogConvertor;
import com.dac.BackEnd.convertor.UserConvertor;
import com.dac.BackEnd.exception.MessageException;
import com.dac.BackEnd.model.response.Response;
import com.dac.BackEnd.model.response.ResponsesBody;
import com.dac.BackEnd.service.UserService;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("api/admin/reviewers")
public class UserAdminController {

    @Autowired
    private UserService userService;
    
    @GetMapping()
    public ResponseEntity<?> getAllReviewer(@RequestParam(required = false, defaultValue = "1") int page,
                                @RequestParam(required = false) String status,
                                @RequestParam(required = false) String searchText) {
        try {
            ResponsesBody body = new ResponsesBody();
            if (status != null) {
                body.setData(UserConvertor.convertToObjects(userService.getAllUserByStatus(status, page)));
                body.setPageInfo(userService.getPageInfo(page, "status", status, searchText));
            } else if (searchText != null) {
                body.setData(UserConvertor.convertToObjects(userService.getAllUserByText(searchText, page)));
                body.setPageInfo(userService.getPageInfo(page, "searchText", status, searchText));
            } else {
                body.setData(UserConvertor.convertToObjects(userService.getAllUser(page)));
                body.setPageInfo(userService.getPageInfo(page, "all", status, searchText));
            }
            body.setCode(SuccessConstants.OK_CODE);
            body.setMessage(Arrays.asList(new MessageException(SuccessConstants.OK_MESSAGE), SuccessConstants.OK_CODE));
            return ResponseEntity.ok(body);
        } catch (MessageException e) {
            Response response = new Response();
            response.setCode(e.getErrorCode());
            response.setMessage(Arrays.asList(e));
            return ResponseEntity.status(e.getErrorCode()).body(response);
        }
    }
    
}
