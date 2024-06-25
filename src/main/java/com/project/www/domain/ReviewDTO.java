package com.project.www.domain;

import lombok.*;

import java.util.List;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class ReviewDTO {

    private ReviewVO reviewVO;
    private List<ReviewVO> reviewVOList;
    private List<ReviewImageVO> reviewImageVOList;
    private ReviewLikeVO reviewLikeVO;
}
