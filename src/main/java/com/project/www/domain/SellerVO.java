package com.project.www.domain;

import lombok.*;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class SellerVO {
    private String id;
    private String pw;
    private String shopName;
    private String tel;
    private String role;
}
