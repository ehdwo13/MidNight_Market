package com.project.www.repository;

import com.project.www.domain.ProductCategoryDetailVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ProductCategoryDetailMapper {
    List<ProductCategoryDetailVO> getList();

    ProductCategoryDetailVO getMyCategoryDetail(long productCategoryDetailId);
}
