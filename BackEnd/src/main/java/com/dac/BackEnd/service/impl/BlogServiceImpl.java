package com.dac.BackEnd.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.dac.BackEnd.constant.ErrorConstants;
import com.dac.BackEnd.constant.TypeImageConstants;
import com.dac.BackEnd.convertor.BlogConvertor;
import com.dac.BackEnd.convertor.ContentConvertor;
import com.dac.BackEnd.entity.ContentEntity;
import com.dac.BackEnd.entity.BlogEntity.BlogEntity;
import com.dac.BackEnd.entity.BlogEntity.BlogStatus;
import com.dac.BackEnd.entity.UserEntity.UserEntity;
import com.dac.BackEnd.entity.UserEntity.UserRole;
import com.dac.BackEnd.exception.MessageException;
import com.dac.BackEnd.model.Blog;
import com.dac.BackEnd.model.Content;
import com.dac.BackEnd.model.request.BlogInput;
import com.dac.BackEnd.model.request.ContentInput;
import com.dac.BackEnd.model.request.DeleteRequest;
import com.dac.BackEnd.model.request.StatusRequest;
import com.dac.BackEnd.model.response.PagedResponse;
import com.dac.BackEnd.model.response.ResponsePage;
import com.dac.BackEnd.repository.BlogRepository;
import com.dac.BackEnd.repository.ContentRepository;
import com.dac.BackEnd.repository.FilmRepository;
import com.dac.BackEnd.repository.UserRepository;
import com.dac.BackEnd.service.BlogService;
import com.dac.BackEnd.service.ImageService;
import com.dac.BackEnd.validation.BlogStatusValidation;

@Service
public class BlogServiceImpl implements BlogService {

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

    private static final int PER_PAGE = 10;
    private static final int PER_PAGE_GUEST = 6;

    public ResponsePage getPageInfo(Page<BlogEntity> blog, int page, int per_page) {
        ResponsePage responsePage = new ResponsePage();
        responsePage.setPage(page);
        responsePage.setPer_page(per_page);
        responsePage.setTotal(blog.getTotalElements());
        responsePage.setTotal_pages(blog.getTotalPages());
        return responsePage;
    }

    @Override
    public PagedResponse<Blog> getAllBlogs(String status, String searchText, LocalDateTime startTime,
            LocalDateTime endTime, int page) {
        Authentication authentication = getAuthentication();
        UserEntity userEntity = getUserEntity(authentication);
        Page<BlogEntity> blog = getBlogEntities(status, searchText, startTime, endTime, userEntity,
                PageRequest.of(page - 1, PER_PAGE));
        PagedResponse<Blog> pagedResponse = new PagedResponse<>();
        pagedResponse.setContent(blog.getContent().stream().map(BlogConvertor::toModel).toList());
        pagedResponse.setResponsePage(getPageInfo(blog, page, PER_PAGE));
        return pagedResponse;
    }

    @Override
    public Blog getBlogById(Long blogId) {
        Authentication authentication = getAuthentication();
        UserEntity userEntity = getUserEntity(authentication);
        BlogEntity blogEntity = getBlogEntityById(blogId);

        checkOwnershipAndRole(blogEntity, userEntity);

        return BlogConvertor.toModel(blogEntity);
    }

    @Override
    public void updateStatusBlog(StatusRequest status) {
        BlogStatus blogStatus = BlogStatusValidation.checkValidStatus(status.getStatus());
        status.getIds().forEach(blogId -> {
            BlogEntity blogEntity = blogRepository.findById(blogId)
                    .orElseThrow(() -> notFoundException());
            blogEntity.setStatus(blogStatus);
            if (BlogStatus.APPROVE == blogEntity.getStatus()) {
                blogEntity.setPostTime(LocalDateTime.now());
            }
            blogRepository.save(blogEntity);
        });
    }

    @Override
    public Blog createNewBlog(BlogInput blogInput) {
        BlogEntity blogEntity = saveBlogEntity(blogInput);
        List<ContentEntity> contentEntities = blogInput.getContents().stream()
                .map(contentInput -> saveContentEntity(blogEntity, contentInput))
                .collect(Collectors.toList());
        blogEntity.setContents(contentEntities);
        return BlogConvertor.toModel(blogEntity);
    }

    @Override
    public Blog updateBlog(BlogInput blogInput, Long blogId) {
        BlogEntity entity = blogRepository.findById(blogId)
                .orElseThrow(() -> notFoundException());
        entity.setTitle(blogInput.getTitle());
        entity.setSummary(blogInput.getSummary());
        entity.setPoint(blogInput.getPoint());
        return BlogConvertor.toModel(blogRepository.save(entity));
    }

    @Override
    public List<Content> updateContent(List<ContentInput> contentInputs, Long blogId) {
        LocalDateTime now = LocalDateTime.now();
        Authentication authentication = getAuthentication();
        UserEntity userEntity = userRepository.findByEmailAndDeleteFlagFalse(authentication.getName()).orElseThrow(
                () -> new MessageException(ErrorConstants.UNAUTHORIZED_MESSAGE, ErrorConstants.UNAUTHORIZED_CODE));
        List<ContentEntity> contentEntities = contentInputs.stream()
                .map(contentInput -> {
                    if (contentInput.getId() == null) {
                        ContentEntity contentEntity = new ContentEntity();
                        contentEntity.setBlog(blogRepository.findById(blogId).orElseThrow(() -> notFoundException()));
                        contentEntity.setContent(contentInput.getContent());
                        contentEntity.setImageUrl(
                                imageService.upload(contentInput.getImageContent(), TypeImageConstants.CONTENT_IMAGE));
                        contentEntity.setInsertDateTime(now);
                        contentEntity.setInsertBy(userEntity);
                        contentEntity.setUpdateDateTime(now);
                        contentEntity.setUpdateBy(userEntity);
                        return contentRepository.save(contentEntity);
                    } else {
                        ContentEntity contentEntity = contentRepository.findById(contentInput.getId())
                                .orElseThrow(() -> notFoundException());
                        if (!contentEntity.getBlog().getId().equals(blogId)) {
                            throw new MessageException(ErrorConstants.INVALID_DATA_MESSAGE,
                                    ErrorConstants.INVALID_DATA_CODE);
                        }
                        contentEntity.setContent(contentInput.getContent());
                        if (contentInput.getImageContent() != null) {
                            contentEntity.setImageUrl(imageService.upload(contentInput.getImageContent(), TypeImageConstants.CONTENT_IMAGE));
                        }
                        return contentRepository.save(contentEntity);
                    }
                })
                .collect(Collectors.toList());
        return contentEntities.stream().map(ContentConvertor::toModel).toList();
    }

    @Override
    public Object updateImageBlog(MultipartFile file, Long blogId) {
        Authentication authentication = getAuthentication();
        BlogEntity entity = blogRepository.findById(blogId)
                .orElseThrow(() -> notFoundException());
        entity.setImage(imageService.upload(file, TypeImageConstants.BLOG_IMAGE));
        entity.setUpdateDateTime(LocalDateTime.now());
        entity.setUpdateBy(userRepository.findByEmailAndDeleteFlagFalse(authentication.getName())
                .orElseThrow(
                        () -> new MessageException(ErrorConstants.UNAUTHORIZED_MESSAGE,
                                ErrorConstants.UNAUTHORIZED_CODE)));
        return BlogConvertor.toModel(blogRepository.save(entity));
    }

    @Override
    public void deleteBlog(Long blogId) {
        Authentication authentication = getAuthentication();
        BlogEntity entity = blogRepository.findById(blogId)
                .orElseThrow(() -> notFoundException());
        if (entity.getDeleteFlag()) {
            throw new MessageException(ErrorConstants.INVALID_DATA_MESSAGE, ErrorConstants.INVALID_DATA_CODE);
        }
        entity.setDeleteFlag(true);
        blogRepository.save(entity);
    }

    @Override
    public void deleteBlogs(DeleteRequest deletes) {
        deletes.getIds().forEach(this::deleteBlog);
    }

    public BlogEntity saveBlogEntity(BlogInput blogInput) {
        Authentication authentication = getAuthentication();
        LocalDateTime now = LocalDateTime.now();

        BlogEntity entity = new BlogEntity();
        entity.setFilm(filmRepository.findById(blogInput.getFilmId())
                .orElseThrow(() -> notFoundException()));
        entity.setTitle(blogInput.getTitle());
        entity.setSummary(blogInput.getSummary());
        entity.setPoint(blogInput.getPoint());
        entity.setImage(imageService.upload(blogInput.getBlogImage(), TypeImageConstants.BLOG_IMAGE));
        entity.setImageIntroduce(imageService.upload(blogInput.getBlogImageIntroduce(), TypeImageConstants.BLOG_IMAGE));
        UserEntity userEntity = getUserEntity(authentication);
        Set<String> roles = AuthorityUtils.authorityListToSet(authentication.getAuthorities());
        if (roles.contains(UserRole.ROLE_ADMIN.name())) {
            entity.setPostTime(now);
            entity.setStatus(BlogStatus.APPROVE);
        } else {
            entity.setStatus(BlogStatus.WAITING);
        }
        entity.setInsertDateTime(now);

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
        if (content.getImageContent() != null) {
            entity.setImageUrl(imageService.upload(content.getImageContent(), TypeImageConstants.CONTENT_IMAGE));
        }
        entity.setInsertDateTime(blog.getInsertDateTime());
        entity.setInsertBy(blog.getInsertBy());
        entity.setUpdateDateTime(blog.getUpdateDateTime());
        entity.setUpdateBy(blog.getUpdateBy());
        return contentRepository.save(entity);
    }

    private Authentication getAuthentication() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throwUnauthorizedException();
        }
        return authentication;
    }

    private UserEntity getUserEntity(Authentication authentication) {
        return userRepository.findUserByDeleteFlagFalseAndEmail(authentication.getName())
                .orElseThrow(() -> notFoundException());
    }

    private boolean rolesContainReviewer() {
        Set<String> roles = AuthorityUtils.authorityListToSet(getAuthentication().getAuthorities());
        return roles.contains(UserRole.ROLE_REVIEWER.name());
    }

    private Page<BlogEntity> getBlogEntities(String status, String searchText, LocalDateTime startTime,
            LocalDateTime endTime, UserEntity userEntity, Pageable pageable) {
        return rolesContainReviewer()
                ? blogRepository.findAllBlogs(userEntity, BlogStatusValidation.checkValidStatus(status), searchText,
                        startTime, endTime, pageable)
                : blogRepository.findAllBlogs(null, BlogStatusValidation.checkValidStatus(status), searchText,
                        startTime, endTime, pageable);
    }

    private BlogEntity getBlogEntityById(Long blogId) {
        return blogRepository.findById(blogId)
                .orElseThrow(() -> notFoundException());
    }

    private void checkOwnershipAndRole(BlogEntity blogEntity, UserEntity userEntity) {
        if (rolesContainReviewer() && blogEntity.getInsertBy() != userEntity) {
            throwForbiddenException();
        }
    }

    private void throwUnauthorizedException() {
        throw new MessageException(ErrorConstants.UNAUTHORIZED_MESSAGE, ErrorConstants.UNAUTHORIZED_CODE);
    }

    private void throwForbiddenException() {
        throw new MessageException(ErrorConstants.FORBIDDEN_MESSAGE, ErrorConstants.FORBIDDEN_CODE);
    }

    private MessageException notFoundException() {
        return new MessageException(ErrorConstants.NOT_FOUND_MESSAGE, ErrorConstants.NOT_FOUND_CODE);
    }

    @Override
    public Blog getBlogByIdGuest(Long blogId) {
        return BlogConvertor.toModel(blogRepository.findBlogByIdGuest(blogId).orElseThrow(() -> notFoundException()));
    }

    @Override
    public PagedResponse<Blog> getAllBlogsGuest(String searchText, int page) {
        Page<BlogEntity> blog = blogRepository.findAllBlogsGuest(searchText, PageRequest.of(page - 1, PER_PAGE_GUEST));
        PagedResponse<Blog> pagedResponse = new PagedResponse<>();
        pagedResponse.setContent(blog.getContent().stream().map(BlogConvertor::toModel).toList());
        pagedResponse.setResponsePage(getPageInfo(blog, page, PER_PAGE_GUEST));
        return pagedResponse;
    }

    @Override
    public PagedResponse<Blog> getAllBlogsByFilmGuest(Long filmId, int page) {
        Page<BlogEntity> blog = blogRepository.findAllBlogsByFilmGuest(
                filmRepository.findById(filmId).orElseThrow(() -> notFoundException()),
                PageRequest.of(page - 1, PER_PAGE_GUEST));
        PagedResponse<Blog> pagedResponse = new PagedResponse<>();
        pagedResponse.setContent(blog.getContent().stream().map(BlogConvertor::toModel).toList());
        pagedResponse.setResponsePage(getPageInfo(blog, page, PER_PAGE_GUEST));
        return pagedResponse;
    }

    @Override
    public Blog updateImageIntroduceBlog(MultipartFile file, Long blogId) {
        Authentication authentication = getAuthentication();
        BlogEntity entity = blogRepository.findById(blogId)
                .orElseThrow(() -> notFoundException());
        entity.setImageIntroduce(imageService.upload(file, TypeImageConstants.BLOG_IMAGE));
        entity.setUpdateDateTime(LocalDateTime.now());
        entity.setUpdateBy(userRepository.findByEmailAndDeleteFlagFalse(authentication.getName())
                .orElseThrow(
                        () -> new MessageException(ErrorConstants.FORBIDDEN_MESSAGE, ErrorConstants.FORBIDDEN_CODE)));
        return BlogConvertor.toModel(blogRepository.save(entity));
    }
}
