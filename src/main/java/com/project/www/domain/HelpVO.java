package com.project.www.domain;

import lombok.*;


@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class HelpVO {
    private long hno; //순번
    private String id; //작성자id
    private String title;
    private String content;
    private String reply; //답변유무
    private String replyContent; //답변내용
    private String secret; // 비밀글 여부
    private String customerId; //고객번호
    private String regAt; //작성일
    private String modAt; //수정일
}
