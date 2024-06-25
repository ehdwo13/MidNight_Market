package com.project.www.repository;

import com.project.www.domain.NoticeVO;
import com.project.www.domain.PagingVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface NoticeMapper {
    void register(NoticeVO nvo);

    List<NoticeVO> getList(PagingVO pgvo);

    NoticeVO getDetail(long id);

    void remove(long id);

    int modify(NoticeVO nvo);

    int getTotal(PagingVO pgvo);
}
