package com.project.www.domain;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Setter
public class CouponDTO {
    private CouponVO cvo;
    private MemberCouponVO memberCouponVO;

}
