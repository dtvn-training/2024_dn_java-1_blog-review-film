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
import org.springframework.web.multipart.MultipartFile;

import com.dac.BackEnd.constant.ErrorConstants;
import com.dac.BackEnd.constant.TypeImageConstants;
import com.dac.BackEnd.convertor.BlogConvertor;
import com.dac.BackEnd.convertor.ContentConvertor;
import com.dac.BackEnd.convertor.FilmConvertor;
import com.dac.BackEnd.entity.ContentEntity;
import com.dac.BackEnd.entity.FilmEntity;
import com.dac.BackEnd.entity.BlogEntity.BlogEntity;
import com.dac.BackEnd.entity.BlogEntity.BlogStatus;
import com.dac.BackEnd.entity.UserEntity.UserEntity;
import com.dac.BackEnd.entity.UserEntity.UserRole;
import com.dac.BackEnd.exception.MessageException;
import com.dac.BackEnd.model.Blog;
import com.dac.BackEnd.model.Content;
import com.dac.BackEnd.model.request.BlogInput;
import com.dac.BackEnd.model.request.ContentInput;
import com.dac.BackEnd.model.response.ResponsePage;
import com.dac.BackEnd.repository.BlogRepository;
import com.dac.BackEnd.repository.ContentRepository;
import com.dac.BackEnd.repository.FilmRepository;
import com.dac.BackEnd.repository.UserRepository;
import com.dac.BackEnd.service.BlogService;
import com.dac.BackEnd.service.ImageService;
import com.dac.BackEnd.validation.BlogStatusValidation;


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

    @Autowired
    private ImageService imageService;

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
        return blogRepository.findAllByDeleteFlagFalseOrderByInsertDateTimeDesc(PageRequest.of(page - 1, 10))
            .stream()
            .map(BlogConvertor::toModel)
            .toList();
    }

    @Override
    public List<Blog> getAllBlogsByStatus(String status, int page) {
        return blogRepository.findAllByStatusAndDeleteFlagFalseOrderByInsertDateTimeDesc(
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
        return blogRepository.findAllByDeleteFlagFalseAndPostTimeBetweenOrderByInsertDateTimeDesc(startTime, endTime, PageRequest.of(page - 1, 10))
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
        entity.setImage(imageService.upload(blogInput.getBlogImage(), TypeImageConstants.BLOG_IMAGE));
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
            entity.setImageUrl(imageService.upload(content.getImage(), TypeImageConstants.CONTENT_IMAGE));
            entity.setInsertDateTime(blog.getInsertDateTime());
            entity.setInsertBy(blog.getInsertBy());
            entity.setUpdateDateTime(blog.getUpdateDateTime());
            entity.setUpdateBy(blog.getUpdateBy());
            return contentRepository.save(entity);
    }

    @Override
    public Blog updateBlog(BlogInput blogInput, Long blogId) {
        BlogEntity entity = blogRepository.findById(blogId).orElseThrow(() -> new MessageException(ErrorConstants.NOT_FOUND_MESSAGE, ErrorConstants.NOT_FOUND_CODE));
        entity.setTitle(blogInput.getTitle());
        entity.setSummary(blogInput.getSummary());
        entity.setPoint(blogInput.getPoint());
        return BlogConvertor.toModel(blogRepository.save(entity));
    }

    @Override
    public List<Content> updateContent(List<ContentInput> contentInputs, Long blogId) {
        List<ContentEntity> contentEntities = new ArrayList<>();
        for (ContentInput contentInput : contentInputs) {
            ContentEntity contentEntity = contentRepository.findById(contentInput.getId()).orElseThrow(() -> new MessageException(ErrorConstants.NOT_FOUND_MESSAGE, ErrorConstants.NOT_FOUND_CODE));
            if (contentEntity.getBlog().getId() != blogId) {
                throw new MessageException(ErrorConstants.INVALID_DATA_MESSAGE, ErrorConstants.INVALID_DATA_CODE);
            }
            contentEntity.setContent(contentInput.getContent());
            contentEntities.add(contentRepository.save(contentEntity));
        }
        return contentEntities.stream().map(ContentConvertor::toModel).toList();
    }

    @Override
    public Object updateImageBlog(MultipartFile file, Long blogId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new MessageException(ErrorConstants.UNAUTHORIZED_MESSAGE, ErrorConstants.UNAUTHORIZED_CODE);
        }
        BlogEntity entity = blogRepository.findById(blogId).orElseThrow(() -> new MessageException(ErrorConstants.NOT_FOUND_MESSAGE, ErrorConstants.NOT_FOUND_CODE));
        entity.setImage(imageService.upload(file, TypeImageConstants.BLOG_IMAGE));
        entity.setUpdateDateTime(LocalDateTime.now());
        entity.setUpdateBy(userRepository.findByEmailAndRole(authentication.getName(), UserRole.ROLE_ADMIN)
                                            .orElseThrow(() -> new MessageException(ErrorConstants.FORBIDDEN_MESSAGE, ErrorConstants.FORBIDDEN_CODE)));
        return BlogConvertor.toModel(blogRepository.save(entity));
    }

    @Override
    public Object updateImageContent(List<ContentInput> contents, Long blogId) {
        List<ContentEntity> contentEntities = new ArrayList<>();
        for (ContentInput contentInput : contents) {
            ContentEntity entity = contentRepository.findById(blogId).orElseThrow(() -> new MessageException(ErrorConstants.NOT_FOUND_MESSAGE, ErrorConstants.NOT_FOUND_CODE));
            if (entity.getBlog().getId() != blogId) {
                throw new MessageException(ErrorConstants.INVALID_DATA_MESSAGE, ErrorConstants.INVALID_DATA_CODE);
            }
            entity.setImageUrl(imageService.upload(contentInput.getImage(), TypeImageConstants.CONTENT_IMAGE));
            contentEntities.add(contentRepository.save(entity));

        }
        return contentEntities.stream().map(ContentConvertor::toModel).toList();
    }

    @Override
    public void deleteBlog(Long blogId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new MessageException(ErrorConstants.UNAUTHORIZED_MESSAGE, ErrorConstants.UNAUTHORIZED_CODE);
        }
        BlogEntity entity = blogRepository.findById(blogId).orElseThrow(() ->  new MessageException(ErrorConstants.NOT_FOUND_MESSAGE, ErrorConstants.NOT_FOUND_CODE));
        if (entity.getDeleteFlag()) {
            throw new MessageException(ErrorConstants.INVALID_DATA_MESSAGE, ErrorConstants.INVALID_DATA_CODE);
        }
        entity.setDeleteFlag(true);
        blogRepository.save(entity);
    }
}
