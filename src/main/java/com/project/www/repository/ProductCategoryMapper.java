package com.project.www.repository;

import com.project.www.domain.ProductCategoryVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ProductCategoryMapper {
    List<ProductCategoryVO> getList();

    ProductCategoryVO getMyCategory(long productCategoryId);
}
