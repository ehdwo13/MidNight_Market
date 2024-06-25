package com.project.www.service;

import com.project.www.domain.BasketVO;
import com.project.www.domain.ProductVO;
import com.project.www.repository.BasketMapper;
import com.project.www.repository.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BasketServiceImple implements BasketService{

    private final BasketMapper basketMapper;
    private final ProductMapper productMapper;

    @Override
    public BasketVO productDuplicationVerify(BasketVO basketVO) {
        return basketMapper.productDuplicationVerify(basketVO);
    }


    @Override
    public String register(BasketVO basketVO) {
        return basketMapper.register(basketVO) > 0 ? "register_success" : "fail";
    }

    @Override
    public String productDuplicationUpdate(BasketVO basketVO) {
        return basketMapper.productDuplicationUpdate(basketVO) > 0 ? "update_success"+basketVO.getQty() : "fail";
    }

    @Override
    public List<BasketVO> getMyBasket(String email) {

        List<BasketVO> myBasket = basketMapper.getMyBasket(email);


        for(BasketVO bvo : myBasket){
            bvo.setProductVO(productMapper.getDetail(bvo.getProductId()));

            //현재 수량이 잔여수량보다 많을 경우 최대 잔여수량으로 수정
            if(bvo.getQty() > bvo.getProductVO().getTotalQty() ){
                bvo.setQty(bvo.getProductVO().getTotalQty()); //최대 잔여수량으로 넣기
                basketMapper.update(bvo);
            }
        }

        return myBasket;
    }

    @Override
    public ProductVO getProductDetail(long productId) {
        return productMapper.getDetail(productId);
    }

    @Override
    public int delete(List<BasketVO> basketList) {

        int isOk = 1;

        //여러개 이기때문에 for문으로 삭제
        for(BasketVO bvo : basketList){
            isOk *= basketMapper.delete(bvo);
        }

        return isOk;
    }

    @Override
    public int update(BasketVO basketVO) {
        return basketMapper.update(basketVO);
    }

    @Override
    public int getBasketTotalCount(String username) {
        return basketMapper.getBasketTotalCount(username);
    }

    @Override
    public int myBasketCheckedUpdate(BasketVO basketVO) {
        return basketMapper.myBasketCheckedUpdate(basketVO);
    }


}