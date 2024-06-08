package com.project.www.domain;

import lombok.*;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class ReviewImageVO {
    private long reviewId;
    private String reviewImage;
    private String reviewThumbImage;
}
