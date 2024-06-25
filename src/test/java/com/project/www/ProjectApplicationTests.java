package com.project.www;

import com.project.www.domain.HelpVO;
import com.project.www.domain.ProductVO;
import com.project.www.repository.HelpMapper;
import com.project.www.repository.NoticeMapper;
import com.project.www.repository.ProductMapper;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import java.util.HashSet;
import java.util.Random;
import java.util.Set;

@RunWith(SpringRunner.class)
@SpringBootTest
class ProjectApplicationTests {

    @Autowired
    private HelpMapper helpmapper;

    @Autowired
    private ProductMapper productMapper;

    @Test
    void contextLoads() {
        for (int i = 0; i < 100; i++) {
            HelpVO hvo = HelpVO.builder()
                    .id("작성자" + i)
                    .title("제목입니다" + i)
                    .content("내용입니다" + i)
                    .build();

            helpmapper.insert(hvo);
        }
    }


    //상품 할인율 랜덤으로 50개 넣기 메서드
    @Test
    void productRandomSaleInsertMethod() {

        Set<Integer> uniqueNumbers = new HashSet<>(); //중복안되게 set으로 생성
        Random random = new Random(); //랜덤 객체 생성

        while (uniqueNumbers.size() < 50) { //set사이즈가 50을 초과하면 종료
            int randomNumber = random.nextInt(273) + 1; // 1 273까지 난수 생성
            uniqueNumbers.add(randomNumber);
        }

        for (int number : uniqueNumbers) {

            int[] possibleNumbers = {10, 20, 30, 40, 50}; //할인율 배열로저장
            int randomIndex = random.nextInt(possibleNumbers.length); //배열 index 난수 생성
            int randomSaleNumbers = possibleNumbers[randomIndex]; //할인율 난수 생성

            ProductVO productVO = ProductVO.builder()
                    .id(number)
                    .discountRate(randomSaleNumbers)
                    .build();

			productMapper.updateProductDiscountRate(productVO);
        }
    }

}



