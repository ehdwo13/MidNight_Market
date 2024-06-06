package com.project.www.service;

import com.project.www.domain.ProductDTO;
import com.project.www.domain.ProductDetailImageVO;
import com.project.www.domain.ProductVO;
import com.project.www.domain.SlangVO;
import com.project.www.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
@Slf4j
public class ProductServiceImple implements ProductService{

    private final ProductMapper productMapper;
    private final ProductDetailImageMapper productDetailImageMapper;
    private final ProductCategoryMapper productCategoryMapper;
    private final ProductCategoryDetailMapper productCategoryDetailMapper;
    private final SlangMapper slangMapper;

    @Transactional
    @Override
    public int insert(ProductDTO productDTO) {

        int isOK = productMapper.insert(productDTO.getProductVO());


        long productId = productMapper.getProductId();

        log.info(">>>>>상품번호 마지막 가져오기>>>>>{}",productId);

        if(isOK > 0){
            for(ProductDetailImageVO image : productDTO.getImageList()){
                image.setProductId(productId);

        log.info(">>>>세부이미지 리스트>>>>>{}",image);

                productDetailImageMapper.insert(image);
            }
        }

        return isOK;
    }

    @Override
    public ProductDTO getDetail(String customerId, long id) {

        ProductDTO productDTO = new ProductDTO();
        productDTO.setProductVO(productMapper.getDetail(id));
        productDTO.setImageList(productDetailImageMapper.getDetail(id));
        productDTO.setPcdVO(productCategoryDetailMapper.getMyCategoryDetail(productDTO.getProductVO().getProductCategoryDetailId()));
        productDTO.setPcVO(productCategoryMapper.getMyCategory(productDTO.getPcdVO().getProductCategoryId()));
        productDTO.setSlangVO(slangMapper.getMySlang(customerId, id));

        return productDTO;
    }

    @Override
    public ProductDTO getProductCategoryList() {

        ProductDTO productDTO = new ProductDTO();

        productDTO.setPcList(productCategoryMapper.getList());
        productDTO.setPcdList(productCategoryDetailMapper.getList());


        return productDTO;
    }

    @Override
    public int slangPost(SlangVO slangVO) {
        return slangMapper.slangPost(slangVO);
    }

    @Override
    public int slangDelete(SlangVO slangVO) {
        return slangMapper.slangDelete(slangVO);
    }

    @Override
    public List<ProductVO> getMySlangProduct(String customerId) {

        List<SlangVO> slangVOS = slangMapper.getMySlangProductList(customerId);

        List<ProductVO> productVOS = new ArrayList<>();

        for(SlangVO svo : slangVOS){
            productVOS.add(productMapper.getDetail(svo.getProductId()));
        }

        return productVOS;
    }


}
