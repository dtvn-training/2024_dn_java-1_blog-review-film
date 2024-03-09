package com.dac.BackEnd.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.dac.BackEnd.service.StaticService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.dac.BackEnd.constant.ErrorConstants;
import com.dac.BackEnd.convertor.BlogConvertor;
import com.dac.BackEnd.entity.ContentEntity;
import com.dac.BackEnd.entity.BlogEntity.BlogEntity;
import com.dac.BackEnd.entity.BlogEntity.BlogStatus;
import com.dac.BackEnd.entity.UserEntity.UserEntity;
import com.dac.BackEnd.exception.MessageException;
import com.dac.BackEnd.model.Blog;
import com.dac.BackEnd.model.request.BlogInput;
import com.dac.BackEnd.model.request.ContentInput;
import com.dac.BackEnd.model.response.ResponsePage;
import com.dac.BackEnd.repository.BlogRepository;
import com.dac.BackEnd.repository.ContentRepository;
import com.dac.BackEnd.repository.FilmRepository;
import com.dac.BackEnd.repository.UserRepository;
import com.dac.BackEnd.service.BlogService;
import com.dac.BackEnd.validation.BlogStatusValidation;

import jakarta.transaction.Transactional;


@Service
public class StaticServiceimpl implements StaticService {

    @Autowired
    private BlogRepository blogRepository;

    public List<Map<String, Object>> countPostsByReviewerInPeriod(LocalDateTime startTime, LocalDateTime endTime) {
        return blogRepository.countPostsByReviewerInPeriod(startTime, endTime);
    }
}