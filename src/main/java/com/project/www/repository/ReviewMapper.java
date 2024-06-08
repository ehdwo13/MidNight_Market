package com.project.www.repository;

import com.project.www.domain.ReviewVO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ReviewMapper {
    int register(ReviewVO reviewVO);
}
