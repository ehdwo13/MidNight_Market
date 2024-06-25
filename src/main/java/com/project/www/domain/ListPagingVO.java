package com.project.www.domain;

import lombok.*;

@Getter
@Setter
@ToString
@AllArgsConstructor
public class ListPagingVO {

    private int PageNo;
    private int qty;

    private String category;
    private String categoryDetail;
    private String type;
    private String subType;
    private String search;
    private String description;

    public ListPagingVO(){
        this.PageNo = 1;
        this.qty = 9;
    }

    public int getPageStart(){
        return (this.PageNo -1 ) * this.qty;
    }


}
