package com.project.www.service;

import com.project.www.domain.NoticeVO;

import java.util.List;

public interface NoticeService {
    void register(NoticeVO nvo);

    List<NoticeVO> getList();

    NoticeVO getDetail(long id);

    void remove(long id);

    int modify(NoticeVO nvo);
}
