package com.project.www.service;

import com.project.www.domain.ReviewDTO;
import com.project.www.domain.ReviewLikeVO;
import com.project.www.domain.ReviewVO;

import java.util.List;

public interface ReviewService {
    String register(ReviewDTO reviewDTO);

    int registerLike(ReviewLikeVO reviewLikeVO);

    int deleteLike(ReviewLikeVO reviewLikeVO);

    int getCount(String reviewId);

    void update(ReviewLikeVO reviewLikeVO);

    void delete(ReviewLikeVO reviewLikeVO);

    Boolean isExist(ReviewLikeVO reviewLikeVO);

    List<ReviewVO> getMyWriteCompletedReviewList(String customerId);

    List<ReviewVO> getReviewDesc(long id);
}
