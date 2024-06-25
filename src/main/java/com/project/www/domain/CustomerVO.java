package com.project.www.domain;


import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Setter
public class CustomerVO {
    private String id;
    private String pw;
    private String nickName;
    private String provider;
    private String providerId;
    private String registerDate;
    private String address;
    private String role;
    private boolean mStatus;
    private String mRegDate;
    private long point;


}
