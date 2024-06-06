package com.project.www.service;

import com.project.www.domain.NoticeVO;
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
    public List<NoticeVO> getList() {
        List<NoticeVO> list = noticeMapper.getList();
        return list;
    }
}
