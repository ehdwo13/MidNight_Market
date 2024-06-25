package com.project.www.service;

import com.project.www.config.oauth2.PrincipalDetails;
import com.project.www.domain.*;
import com.project.www.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewServiceImple implements ReviewService {

    private final ReviewMapper reviewMapper;
    private final OrdersMapper ordersMapper;
    private final ReviewImageMapper reviewImageMapper;
    private final ReviewLikeMapper reviewLikeMapper;
    private final ProductMapper productMapper;
    private final CustomerMapper customerMapper;

    @Transactional
    @Override
    public String register(ReviewDTO reviewDTO) {

        try {
            CustomerVO customerVO = customerMapper.selectOne(reviewDTO.getReviewVO().getCustomerId());
            long addedPoints = 0;
            int isOk = reviewMapper.register(reviewDTO.getReviewVO()); //리뷰 등록
            boolean mStatus = customerVO.isMStatus();
            String resultInfo = "";
            
            if (reviewDTO.getReviewImageVOList() != null) {//파일이 있을 경우
                for (ReviewImageVO reviewImageVO : reviewDTO.getReviewImageVOList()) {
                    reviewImageVO.setReviewId(reviewDTO.getReviewVO().getId());
                }
                isOk *= reviewImageMapper.register(reviewDTO.getReviewImageVOList()); //리뷰 이미지들 등록
                addedPoints = 100;
            }

            if(reviewDTO.getReviewImageVOList() == null){//파일이 없을 경우
            addedPoints = 50;
            }
            
            if(customerVO.isMStatus()){//멤버쉽일 경우
                addedPoints *= 2;
            }

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if(authentication != null && authentication.getPrincipal() instanceof PrincipalDetails){
                PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
                principalDetails.updatePoints(principalDetails.getPoint() + addedPoints); //포인트 업데이트
                customerVO.setPoint(principalDetails.getPoint() + addedPoints); //객체에 포인트 업데이트
            }

            isOk *= customerMapper.pointUpdate(customerVO);
            isOk *= productMapper.reviewCountUpdate(reviewDTO.getReviewVO().getProductId()); //상품에 리뷰달린개수 +1
            isOk *= ordersMapper.isReviewCommentUpdate(reviewDTO.getReviewVO()); //주문정보에 리뷰 등록 업데이트


            if (isOk == 0) {//리뷰 등록 안됐을 경우 Exception
                throw new RuntimeException("리뷰등록 실패");
            }


            if(addedPoints == 50 && !mStatus){ //멤버쉽이 아니고 사진 업로드 안했을 시
                resultInfo = "리뷰를 달아주셔서 감사합니다.\n50포인트가 적립 되었습니다.";
            }

            if(addedPoints == 100 && !mStatus){//멤버쉽이 아니고 사진 업로드 했을 시
                resultInfo = "리뷰를 달아주셔서 감사합니다.\n 사진도 등록하여 100포인트가 적립 되었습니다.";
            }

            if(addedPoints == 100 && mStatus){
                resultInfo = "(멤버쉽 혜택 2배 적용!!)\n리뷰를 달아주셔서 감사합니다.\n100포인트가 적립 되었습니다.";
            }

            if(addedPoints == 200 && mStatus){
                resultInfo = "(멤버쉽 혜택 2배 적용!!)\n리뷰를 달아주셔서 감사합니다.\n 사진도 등록하여 200포인트가 적립 되었습니다.";
            }

            return resultInfo+"/"+addedPoints;


        } catch (RuntimeException e) {
            e.printStackTrace();
            throw new RuntimeException("리뷰 등록 과정에서 예외가 발생했습니다: " + e.getMessage(), e);
        }
    }

    @Transactional
    @Override
    public int registerLike(ReviewLikeVO reviewLikeVO) {
        int isOK = reviewLikeMapper.registerLike(reviewLikeVO);
        return isOK;
    }

    @Transactional
    @Override
    public int deleteLike(ReviewLikeVO reviewLikeVO) {
        int isOK = reviewLikeMapper.deleteLike(reviewLikeVO);
        return isOK;
    }

    @Override
    public int getCount(String reviewId) {
        return reviewMapper.getCount(reviewId);
    }

    @Override
    public void update(ReviewLikeVO reviewLikeVO) {
        reviewMapper.update(reviewLikeVO);
    }

    @Override
    public void delete(ReviewLikeVO reviewLikeVO) {
        reviewMapper.delete(reviewLikeVO);
    }

    @Override
    public Boolean isExist(ReviewLikeVO reviewLikeVO) {
        return reviewLikeMapper.isExist(reviewLikeVO);
    }

    @Override
    public List<ReviewVO> getMyWriteCompletedReviewList(String customerId) {
        List<ReviewVO> reviewVOList = reviewMapper.getMyWriteCompletedReviewList(customerId);

        reviewVOList.forEach(item -> {
            item.setReviewImageVOList(reviewImageMapper.getReviewImgList(item.getId()));
            item.setProductVO(productMapper.getDetail(item.getProductId()));
        });

        return reviewVOList;
    }

    @Override
    public List<ReviewVO> getReviewDesc(long id) {
        return reviewMapper.getReviewDesc(id);
    }


}
