package com.project.www.repository;

import com.project.www.domain.ReviewLikeVO;
import com.project.www.domain.ReviewVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ReviewLikeMapper {

    ReviewLikeVO getReviewLike(ReviewLikeVO reviewLikeVO);

    int registerLike(ReviewLikeVO reviewLikeVO);

    int deleteLike(ReviewLikeVO reviewLikeVO);

    Boolean isExist(ReviewLikeVO reviewLikeVO);
}
