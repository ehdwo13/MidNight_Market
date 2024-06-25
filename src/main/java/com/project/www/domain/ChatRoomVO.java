package com.project.www.domain;

import lombok.*;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class ChatRoomVO {
    private Long id;
    private String customerId;
    private String sellerId;
}
