package com.project.www.domain;

import lombok.*;

import java.time.LocalDateTime;


@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class MessageVO {
    private Long id;
    private Long chatRoomId;
    private String senderId;
    private String senderType;
    private String content;
    private LocalDateTime sendTime;
}
