document.getElementById('cmtAddBtn').addEventListener('click', () => {
    let cmtWriter = document.getElementById('cmtWriter').value;
    let cmtText = document.getElementById('cmtText').value;

if(cmtText == null || cmtText === ''){
        alert("댓글을 입력해주세요. ")
        document.getElementById('cmtText').focus();
        return false;
 }else{
        let cmtData = {
            bno : bnoVal,
            writer : cmtWriter,
            content : cmtText
        }
          postCommentToServer(cmtData).then(result => {
                    if(result === "1"){
                        alert("댓글 입력 성공");
                        document.getElementById('cmtText').value = "";
                        spreadList(bnoVal);
                    }
                })
            }
        });

async function postCommentToServer(cmtData){
    try {
        const url = '/qna/post';
        const config = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(cmtData)
        };
        const resp = await fetch(url, config);
        const result = await resp.text();
        return result;
    } catch (error) {
        console.log(error);
    }
}