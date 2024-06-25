package com.project.www.domain;

import lombok.*;

import java.util.List;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class ReviewVO {

    private long id;
    private String content;
    private long star;
    private String registerDate;
    private String customerId;
    private long productId;
    private long ordersId;
    private long revUpCount;
    private String nickName;
    private List<ReviewImageVO> reviewImageVOList;
    private ReviewLikeVO reviewLikeVO;
    private ProductVO productVO;
}
