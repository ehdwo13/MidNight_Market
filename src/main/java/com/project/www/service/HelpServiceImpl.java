package com.project.www.service;

import com.project.www.domain.HelpVO;
import com.project.www.domain.NotificationVO;
import com.project.www.domain.PagingVO;
import com.project.www.repository.HelpMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class HelpServiceImpl implements HelpService {
    private final HelpMapper helpMapper;
    private final NotificationService nsv;

    @Override
    public List<HelpVO> getList(PagingVO pgvo) {
        return helpMapper.getList(pgvo);
    }

    @Override
    public int register(HelpVO hvo) {
        return helpMapper.insert(hvo);
    }

    @Override
    public HelpVO getDetail(long hno) {
        return helpMapper.getDetail(hno);
    }

    @Override
    public int
    modify(HelpVO hvo) {
        return helpMapper.modify(hvo);
    }

    @Override
    public int delete(long hno) {
        return helpMapper.delete(hno);
    }

    @Transactional
    @Override
    public void replyRegister(HelpVO hvo) {
        helpMapper.replyUpdate(hvo);
        helpMapper.replyRegister(hvo);
        long hno = hvo.getHno();
        HelpVO helpVO = helpMapper.getDetail(hno);
        NotificationVO nvo = new NotificationVO();
        nvo.setCustomerId(helpVO.getCustomerId());
        nvo.setNotifyContent("1대1문의사항 "+hno+"번게시글 답변이 등록되었습니다. ");
        nsv.insert(nvo);
    }

    @Override
    public int getTotal(PagingVO pgvo) {
        return helpMapper.getTotal(pgvo);
    }

    @Override
    public List<HelpVO> getMyList(String name) {
        return helpMapper.getMyList(name);
    }

    @Override
    public int getMyTotal(String name) {
        return helpMapper.getMyTotal(name);
    }

    @Override
    public List<HelpVO> getListToAdmin() {
        return helpMapper.getListToAdmin();
    }

}
