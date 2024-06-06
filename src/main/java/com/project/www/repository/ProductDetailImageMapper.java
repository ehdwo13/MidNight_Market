package com.project.www.repository;

import com.project.www.domain.ProductDetailImageVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ProductDetailImageMapper {

     void insert(ProductDetailImageVO image);

    List<ProductDetailImageVO> getDetail(long id);
}
