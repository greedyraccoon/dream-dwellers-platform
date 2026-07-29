package com.greedyraccoon.backend.blog.service;

import com.greedyraccoon.backend.blog.dto.BlogRequest;
import com.greedyraccoon.backend.blog.dto.BlogResponse;
import com.greedyraccoon.backend.blog.entity.Blog;
import com.greedyraccoon.backend.blog.repository.BlogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BlogService {

    private final BlogRepository blogRepository;

    public BlogService(BlogRepository blogRepository) {
        this.blogRepository = blogRepository;
    }

    @Transactional(readOnly = true)
    public List<BlogResponse> getAllBlogs() {
        return blogRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BlogResponse getBlogBySlug(String slug) {
        Blog blog = blogRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Blog post not found with slug: " + slug));
        return mapToResponse(blog);
    }

    @Transactional
    public BlogResponse createBlog(BlogRequest request) {
        if (blogRepository.existsBySlug(request.slug())) {
            throw new IllegalArgumentException("A blog post with this slug already exists.");
        }

        Blog blog = new Blog();
        blog.setTitle(request.title());
        blog.setSlug(request.slug());
        blog.setContent(request.content());
        blog.setCoverImageUrl(request.coverImageUrl());

        Blog savedBlog = blogRepository.save(blog);
        return mapToResponse(savedBlog);
    }

    @Transactional
    public void deleteBlog(Long id) {
        if (!blogRepository.existsById(id)) {
            throw new RuntimeException("Blog post not found with id: " + id);
        }
        blogRepository.deleteById(id);
    }

    private BlogResponse mapToResponse(Blog blog) {
        return new BlogResponse(
                blog.getId(),
                blog.getTitle(),
                blog.getSlug(),
                blog.getContent(),
                blog.getCoverImageUrl(),
                blog.getCreatedAt()
        );
    }
}