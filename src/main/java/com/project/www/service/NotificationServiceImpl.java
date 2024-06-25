package com.project.www.service;

import com.project.www.domain.NotificationVO;
import com.project.www.repository.NotificationMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService{
    private final NotificationMapper notificationMapper;

    @Override
    public void insert(NotificationVO nvo) {
        notificationMapper.insert(nvo);
    }

    @Override
    public List<NotificationVO> getList(String username) {
        return notificationMapper.getList(username);
    }

    @Override
    public boolean deleteNotificationByContent(String content,String id) {
        int rowsAffected = notificationMapper.deleteByContent(content, id);
        return rowsAffected > 0;
    }

    @Override
    public int getCount(String customerId) {
        return notificationMapper.getCount(customerId);
    }
}
