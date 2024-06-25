package com.project.www.handler;

import com.project.www.domain.ListPagingVO;
import com.project.www.domain.PagingVO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ListPagingHandler {

    private int startPage;
    private int endPage;
    private int realEndPage;
    private boolean prev, next;
    private int totalCount;
    private ListPagingVO pgvo;

    public ListPagingHandler(ListPagingVO pgvo, int totalCount) {

        this.pgvo = pgvo;
        this.totalCount = totalCount;

        this.endPage = (int) Math.ceil(pgvo.getPageNo()/ (double)5) * 5;

        this.startPage = this.endPage - 4;

        this.realEndPage = (int)Math.ceil(this.totalCount / (double)pgvo.getQty());

        if(this.realEndPage < this.endPage) {
            this.endPage = this.realEndPage;
        }

        this.prev = this.startPage>1;
        this.next = this.realEndPage > this.endPage;

    }



}
