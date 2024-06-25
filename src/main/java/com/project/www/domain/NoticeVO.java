package com.project.www.domain;

import lombok.*;

@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class NoticeVO {
    private long id;
    private String title;
    private String registerDate;
    private String content;
    private String formattedDate;
}
