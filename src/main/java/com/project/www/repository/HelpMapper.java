package com.project.www.repository;

import com.project.www.domain.HelpVO;
import com.project.www.domain.PagingVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface HelpMapper {

//    List<HelpVO> getList();
    List<HelpVO> getList(PagingVO pgvo);

    int insert(HelpVO hvo);

    HelpVO getDetail(long hno);

    int modify(HelpVO hvo);

    int delete(long hno);

    void replyRegister(HelpVO hvo);

    void replyUpdate(HelpVO hvo);

    int getTotal(PagingVO pgvo);

    List<HelpVO> getMyList(String name);

    int getMyTotal(String name);

    List<HelpVO> getListToAdmin();
}
