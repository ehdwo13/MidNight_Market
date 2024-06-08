package com.project.www.repository;

import com.project.www.domain.NoticeVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface NoticeMapper {
    void register(NoticeVO nvo);

    List<NoticeVO> getList();

    NoticeVO getDetail(long id);

    void remove(long id);

    int modify(NoticeVO nvo);
}
