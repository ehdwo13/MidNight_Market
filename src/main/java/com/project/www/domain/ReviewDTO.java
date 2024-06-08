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
    private List<ReviewImageVO> reviewImageVOList;

}
