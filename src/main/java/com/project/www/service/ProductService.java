package com.project.www.service;

import com.project.www.domain.ProductDTO;
import com.project.www.domain.ProductVO;
import com.project.www.domain.SlangVO;

import java.util.List;

public interface ProductService {
    int insert(ProductDTO productDTO);

    ProductDTO getDetail(String customerId, long id);


    ProductDTO getProductCategoryList();

    int slangPost(SlangVO slangVO);

    int slangDelete(SlangVO slangVO);

    List<ProductVO> getMySlangProduct(String customerId);
}
