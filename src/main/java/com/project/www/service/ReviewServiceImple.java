package com.project.www.service;

import com.project.www.domain.ReviewDTO;
import com.project.www.domain.ReviewImageVO;
import com.project.www.repository.OrdersMapper;
import com.project.www.repository.ReviewImageMapper;
import com.project.www.repository.ReviewMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewServiceImple implements ReviewService{

    private final ReviewMapper reviewMapper;
    private final OrdersMapper ordersMapper;
    private final ReviewImageMapper reviewImageMapper;

    @Transactional
    @Override
    public int register(ReviewDTO reviewDTO) {

        log.info("리뷰DTO객체 확인>>>>{}", reviewDTO);

        int isOk = reviewMapper.register(reviewDTO.getReviewVO());
        log.info("아이디값 잘되나 확인>>{}",reviewDTO.getReviewVO().getId());
        if(isOk > 0){

            //파일이 있을 경우
            if(reviewDTO.getReviewImageVOList() != null){
            for(ReviewImageVO reviewImageVO : reviewDTO.getReviewImageVOList()){
                reviewImageVO.setReviewId(reviewDTO.getReviewVO().getId());
            }

            reviewImageMapper.register(reviewDTO.getReviewImageVOList());

            }

            return ordersMapper.isReviewCommentUpdate(reviewDTO.getReviewVO());
        }

        return 0;
    }
}
