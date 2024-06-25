package com.project.www.domain;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class ReviewLikeVO {
    private long reviewId;
    private String customerId;
}
