package com.project.www.service;

import com.project.www.domain.NoticeVO;
import com.project.www.domain.PagingVO;
import com.project.www.repository.NoticeMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class NoticeServiceImpl implements NoticeService{
    private final NoticeMapper noticeMapper;

    @Override
    public void register(NoticeVO nvo) {
        noticeMapper.register(nvo);
    }

    @Override
    public List<NoticeVO> getList(PagingVO pgvo) {
        List<NoticeVO> list = noticeMapper.getList(pgvo);
        return list;
    }

    @Override
    public NoticeVO getDetail(long id) {
        NoticeVO nvo = noticeMapper.getDetail(id);
        return nvo;
    }

    @Override
    public void remove(long id) {
        noticeMapper.remove(id);
    }

    @Override
    public int modify(NoticeVO nvo) {
        return noticeMapper.modify(nvo);
    }

    @Override
    public int getTotal(PagingVO pgvo) {
        return noticeMapper.getTotal(pgvo);
    }
}
