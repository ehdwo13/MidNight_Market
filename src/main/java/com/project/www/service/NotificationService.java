package com.project.www.service;

import com.project.www.domain.NotificationVO;

import java.util.List;

public interface NotificationService {
    void insert(NotificationVO nvo);

    List<NotificationVO> getList(String username);

    boolean deleteNotificationByContent(String content,String id);

    int getCount(String customerId);
}
