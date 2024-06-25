package com.project.www.service;

import com.project.www.domain.NoticeVO;
import com.project.www.domain.PagingVO;

import java.util.List;

public interface NoticeService {
    void register(NoticeVO nvo);

    List<NoticeVO> getList(PagingVO pgvo);

    NoticeVO getDetail(long id);

    void remove(long id);

    int modify(NoticeVO nvo);

    int getTotal(PagingVO pgvo);
}
