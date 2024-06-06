package com.project.www.domain;

import lombok.Data;

@Data
public class MailVO {
    private String receiver;
    private String title;
    private String content;
}
