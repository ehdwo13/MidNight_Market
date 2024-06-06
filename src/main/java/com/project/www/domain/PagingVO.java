package com.project.www.domain;

import lombok.*;

@AllArgsConstructor
@ToString
@Getter
@Setter
public class PagingVO {
    private int pageNum; //현재 페이지 번호
    private int pageSize; //한 페이지에 표시할 항목 수

    public PagingVO() {
        this.pageNum = 1;
        this.pageSize = 10;
    }

    public int getPageStart() {
        return (this.pageNum - 1) * this.pageSize;
    }
}
