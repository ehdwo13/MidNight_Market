package com.project.www.service;

import com.project.www.domain.ProductDTO;
import com.project.www.domain.ProductVO;
import com.project.www.domain.SellerVO;
import com.project.www.repository.ProductMapper;
import com.project.www.repository.SellerMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
@Slf4j
public class SellerServiceImple implements SellerService {

    private final SellerMapper sellerMapper;
    private final ProductMapper productMapper;

    @Override
    public int register(SellerVO sellerVO) {
        return sellerMapper.register(sellerVO);
    }

    @Override
    public List<ProductVO> getMyRegisteredProduct(String id) {
        return productMapper.getMyRegisteredProduct(id);
    }

    @Override
    public String myRegisteredProductUpdate(ProductVO productVO) {

        String type = productVO.getDescription();


        switch (type) {
            case "quantity" -> {
                productMapper.productQtyUpdate(productVO);
                return "수량이 " + productVO.getTotalQty() + "개 추가되었습니다.";  //수량변경
            }
            case "price" -> {
                productMapper.productPriceUpdate(productVO);
                return "가격이 " + productVO.getPrice() + "원 으로 변경되었습니다.";  //기존가 변경
            }
            case "discount" -> {
                productMapper.updateProductDiscountRate(productVO);
                return "할인율이 " + productVO.getDiscountRate() + "% 으로 변경되었습니다.";  //할인율 변경
            }
            case "discountDelete"->{
                productMapper.updateProductDiscountRateDelete(productVO);
                return "할인율이 삭제되었습니다.";  //할인율 변경
            }
        }
        return "비상식적인 요청입니다.";
    }

    @Override
    public int checkId(String id) {
        int count = sellerMapper.checkId(id);
        return count;
    }

    @Override
    public int checkShopName(String shopName) {
        int count = sellerMapper.checkShopName(shopName);
        return count;
    }

    @Override
    public List<SellerVO> getList() {
        return sellerMapper.getList();
    }

    @Override
    public String getShopName(String sellerId) {
        return sellerMapper.getShopName(sellerId);
    }

    @Override
    public String getSellerId(String marketName) {
        return sellerMapper.getSellerId(marketName);
    }


}
