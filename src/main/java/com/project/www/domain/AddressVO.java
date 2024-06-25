package com.project.www.domain;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class AddressVO {
    private long ano;
    private String address;
    private String customerId;
    private String isMain; // 기본배송지 여부
    private String addrNickName; // 주소별칭 ex)집, 친구네
    private String addrName; // 받으실분
    private String contactNum; // 연락처
}
