package com.project.www.repository;

import com.project.www.domain.NotificationVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface NotificationMapper {
    void insert(NotificationVO nvo);

    List<NotificationVO> getList(String username);

    int deleteByContent(@Param("content") String content, @Param("id") String id);

    int getCount(String customerId);
}
