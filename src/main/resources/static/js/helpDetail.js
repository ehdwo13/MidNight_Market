document.getElementById('delBtn').addEventListener('click',()=>{
    if(confirm("질문을 삭제하시겠습니까?")){
        document.getElementById('realDelBtn').click();
        alert("삭제되었습니다.");
    }else{
        alert("취소되었습니다.");
    }
});