package com.dac.BackEnd.controller.Admin;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dac.BackEnd.convertor.UserConvertor;
import com.dac.BackEnd.model.User;
import com.dac.BackEnd.model.response.ResponsePage;
import com.dac.BackEnd.model.response.Responses;
import com.dac.BackEnd.service.UserService;

@RestController
@RequestMapping("api/admin/users")
public class ReviewerAdminController {

    @Autowired
    private UserService userService;


    @GetMapping()
    public Responses getAllReiviewer(@RequestParam(required = false, defaultValue = "1") int page) {
        List<User> users = userService.getAllUser(page);
        Responses responses = new Responses();
        // ResponsePage rp = new ResponsePage();
        // rp.setPage(page);
        // rp.setPer_page(6);
        // rp.setTotal(12);
        // rp.setTotal_pages(2);
        responses.setPage(page);
        responses.setPer_page(6);
        responses.setTotal(12);
        responses.setTotal_pages(2);
        responses.setCode(200);
        responses.setMessage(new ArrayList<>()); // Khởi tạo một danh sách trống cho message
        responses.getMessage().add("Successful"); // Thêm thô ng điệp thành công vào danh sách message
        // responses.setPageInfo(rp);
        responses.setData(UserConvertor.convertToObjects(users));
        return responses;
    }    
}
