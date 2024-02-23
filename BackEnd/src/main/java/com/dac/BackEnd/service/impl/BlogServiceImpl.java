package com.dac.BackEnd.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

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
public class BlogServiceImpl implements BlogService{

    @Autowired
    private BlogRepository blogRepository;

    @Autowired
    private FilmRepository filmRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ContentRepository contentRepository;

    @Override
    public ResponsePage getPageInfo(int page, String by, String status, String searchText, LocalDateTime startTime, LocalDateTime endTime) {
        int totalBlogs = 0;
        int totalPages = 0;
        int perPage = 10;
        switch (by) {
            case "status":
                if (status != null) {
                    totalBlogs = blogRepository.countAllBlogsByStatus(BlogStatusValidation.checkValidStatus(status));
                }
                break;
            case "searchText":
                if (searchText != null) {
                    totalBlogs = blogRepository.countAllBlogsByText(searchText);
                }
                break;
            case "postTime":
                if (startTime != null && endTime != null) {
                    totalBlogs = blogRepository.countAllBlogsByPostTime(startTime, endTime);
                }
                break;
            default:
                totalBlogs = blogRepository.countAllBlogs();
                break;
        }

        if (totalBlogs == 0) {
            throw new MessageException(ErrorConstants.NOT_FOUND_MESSAGE, ErrorConstants.NOT_FOUND_CODE);
        }

        totalPages = (int) Math.ceil((double) totalBlogs / perPage);

        if (page < 1 || page > totalPages) {
            throw new MessageException(ErrorConstants.NOT_FOUND_MESSAGE, ErrorConstants.NOT_FOUND_CODE);
        }

        ResponsePage responsePage = new ResponsePage();
        responsePage.setPage(page);
        responsePage.setPer_page(perPage);
        responsePage.setTotal(totalBlogs);
        responsePage.setTotal_pages(totalPages);
        return responsePage;
    }

    @Override
    public List<Blog> getAllBlogs(int page) {
        return blogRepository.findAllByOrderByInsertDateTimeDesc(PageRequest.of(page - 1, 3))
            .stream()
            .map(BlogConvertor::toModel)
            .toList();
    }

    @Override
    public List<Blog> getAllBlogsByStatus(String status, int page) {
        return blogRepository.findAllByStatusOrderByInsertDateTimeDesc(
            BlogStatusValidation.checkValidStatus(status), PageRequest.of(page - 1, 10))
            .stream()
            .map(BlogConvertor::toModel)
            .toList();
    }

    @Override
    public List<Blog> getAllBlogByText(String searchText, int page) {
        return blogRepository.findAllBySearchText(searchText, PageRequest.of(page - 1, 10))
            .stream()
            .map(BlogConvertor::toModel)
            .toList();
    }

    @Override
    public List<Blog> getAllBlogByPostTime(LocalDateTime startTime, LocalDateTime endTime, int page) {
        return blogRepository.findAllByPostTimeBetween(startTime, endTime, PageRequest.of(page - 1, 10))
            .stream()
            .map(BlogConvertor::toModel)
            .toList();
    }

    @Override
    public Blog getBlogById(Long blogId) {
        return BlogConvertor.toModel(blogRepository.findById(blogId).orElseThrow(() -> new MessageException(ErrorConstants.NOT_FOUND_MESSAGE, ErrorConstants.NOT_FOUND_CODE)));
    }

    @Override
    public void updateStatusBlog(Long blogId, String status) {
        BlogStatus blogStatus = BlogStatusValidation.checkValidStatus(status);
        BlogEntity blogEntity = blogRepository.findById(blogId).orElseThrow(() -> new MessageException(ErrorConstants.NOT_FOUND_MESSAGE, ErrorConstants.NOT_FOUND_CODE));
        blogEntity.setStatus(blogStatus);
        if (BlogStatus.APPROVE == blogEntity.getStatus()) {
            blogEntity.setPostTime(LocalDateTime.now());
        }
        blogRepository.save(blogEntity);
    }

    @Override
    public Blog createNewBlog(BlogInput blogInput) {
        BlogEntity blogEntity = saveBlogEntity(blogInput);
        List<ContentEntity> contentEntities = new ArrayList<>();
        for (ContentInput contentInput : blogInput.getContents()) {
            contentEntities.add(saveContentEntity(blogEntity, contentInput));
        }
        blogEntity.setContents(contentEntities);
        // return BlogConvertor.toModel(blogRepository.findById(blogEntity.getId()).orElseThrow(() -> new MessageException(ErrorConstants.NOT_FOUND_MESSAGE, ErrorConstants.NOT_FOUND_CODE)));
        return BlogConvertor.toModel(blogEntity);
    }

    public BlogEntity saveBlogEntity(BlogInput blogInput) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new MessageException(ErrorConstants.UNAUTHORIZED_MESSAGE, ErrorConstants.UNAUTHORIZED_CODE);
        }

        LocalDateTime now = LocalDateTime.now();

        BlogEntity entity = new BlogEntity();
        entity.setFilm(filmRepository.findById(blogInput.getFilmId())
                                        .orElseThrow(() -> new MessageException(ErrorConstants.NOT_FOUND_MESSAGE, ErrorConstants.NOT_FOUND_CODE)));
        entity.setTitle(blogInput.getTitle());
        entity.setSummary(blogInput.getSummary());
        entity.setPoint(blogInput.getPoint());
        Set<String> roles = AuthorityUtils.authorityListToSet(authentication.getAuthorities());
        if (roles.contains("ROLE_ADMIN")) {
            entity.setPostTime(now);
            entity.setStatus(BlogStatus.APPROVE);
        }
        entity.setStatus(BlogStatus.WAITING);
        entity.setInsertDateTime(now);
        UserEntity userEntity = userRepository.findUserByDeleteFlagFalseAndEmail(authentication.getName())
                                                .orElseThrow(() -> new MessageException(ErrorConstants.NOT_FOUND_MESSAGE, ErrorConstants.NOT_FOUND_CODE));
        entity.setInsertBy(userEntity);
        entity.setUpdateDateTime(now);
        entity.setUpdateBy(userEntity);
        entity.setDeleteFlag(false);
        return blogRepository.save(entity);
    }

    private ContentEntity saveContentEntity(BlogEntity blog, ContentInput content) {
        ContentEntity entity = new ContentEntity();
            entity.setBlog(blog);
            entity.setContent(content.getContent());
            entity.setInsertDateTime(blog.getInsertDateTime());
            entity.setInsertBy(blog.getInsertBy());
            entity.setUpdateDateTime(blog.getUpdateDateTime());
            entity.setUpdateBy(blog.getUpdateBy());
            return contentRepository.save(entity);
        
    }

    

    

    

}
