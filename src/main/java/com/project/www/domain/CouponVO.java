package com.project.www.domain;

import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Setter
public class CouponVO {
    private long id;
    private String name;
    private long discountAmount;
    private String issueDate;
    private String endDate;
}
