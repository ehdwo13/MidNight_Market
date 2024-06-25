package com.project.www.domain;

import lombok.*;

@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class QnaVO {
    private long id; //문의 번호
    private String content; //문의 내용
    private String registerDate; //문의 작성일
    private String qnaStatus; //문의 답변 상태
    private String customerId; //고객 번호
}
