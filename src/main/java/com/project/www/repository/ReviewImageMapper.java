package com.project.www.repository;

import com.project.www.domain.ReviewImageVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ReviewImageMapper {

    void register(List<ReviewImageVO> reviewImageVOList);
}
