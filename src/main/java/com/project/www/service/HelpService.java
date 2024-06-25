package com.project.www.service;

import com.project.www.domain.HelpVO;
import com.project.www.domain.PagingVO;

import java.util.List;

public interface HelpService {
//    List<HelpVO> getList();
    List<HelpVO> getList(PagingVO pgvo);

    int register(HelpVO hvo);

    HelpVO getDetail(long hno);

    int modify(HelpVO hvo);

    int delete(long hno);

    void replyRegister(HelpVO hvo);

    int getTotal(PagingVO pgvo);

    List<HelpVO> getMyList(String name);

    int getMyTotal(String name);

    List<HelpVO> getListToAdmin();
}
