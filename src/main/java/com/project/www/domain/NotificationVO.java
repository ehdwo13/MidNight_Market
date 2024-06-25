package com.project.www.domain;

import lombok.*;

@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class NotificationVO {
    private String notifyContent;
    private String notifyDate;
    private Boolean isRead;
    private String customerId;
}
