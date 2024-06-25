package com.project.www.handler;

import com.project.www.domain.PagingVO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class PagingHandler {
    private int startPage; //시작페이지
    private int endPage; //마지막페이지
    private boolean prev; //이전
    private boolean next; //다음
    private int totalCount; //전체글 수
    private PagingVO pgvo;
    private int realEndPage; //찐마지막페이지
    private long id;

    public PagingHandler(PagingVO pgvo, int totalCount) {
        this.pgvo = pgvo;
        this.totalCount = totalCount;

        this.endPage = (int)Math.ceil(pgvo.getPageNum()/(double)5)*5; // 5개 단위로 페이지 계산
        this.startPage = this.endPage - 4;

        this.realEndPage = (int)Math.ceil(totalCount/(double)pgvo.getPageSize());

        if(this.endPage > this.realEndPage){
            this.endPage = this.realEndPage;
        }

        this.prev = this.startPage > 1;
        this.next = this.endPage < this.realEndPage;
    }

    public PagingHandler(PagingVO pgvo, int totalCount, long id) {
        this.pgvo = pgvo;
        this.totalCount = totalCount;
        this.id = id;

        this.endPage = (int)Math.ceil(pgvo.getPageNum()/(double)5)*5; // 5개 단위로 페이지 계산
        this.startPage = this.endPage - 4;

        this.realEndPage = (int)Math.ceil(totalCount/(double)pgvo.getPageSize());

        if(this.endPage > this.realEndPage){
            this.endPage = this.realEndPage;
        }

        this.prev = this.startPage > 1;
        this.next = this.endPage < this.realEndPage;
    }
}


