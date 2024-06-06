package com.project.www.controller;

import com.project.www.domain.ProductDTO;
import com.project.www.domain.ProductVO;
import com.project.www.domain.SellerVO;
import com.project.www.service.SellerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/seller/*")
@Controller
public class SellerController {

    private final SellerService ssv;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @GetMapping("/register")
    public void register(){}

    @PostMapping("/register")
    public String register(SellerVO sellerVO){
        log.info("셀러객체 {}", sellerVO);
        //Password 암호화
        sellerVO.setPw(bCryptPasswordEncoder.encode(sellerVO.getPw()));

        int isOk = ssv.register(sellerVO);

        return "/index";
    }

    @GetMapping("/myRegisteredProduct")
    public void productList(Model model){
    //아이디 또는 이메일 a태그 또는 프린시펄로 받아오기

        String id = "dbscksdnd";

        List<ProductVO> list = ssv.getMyRegisteredProduct(id);
        
        log.info(">>>>>상품 리스트 출력{}",list);

        model.addAttribute("list",list);
    }

    @PutMapping (value = "/productQtyUpdate", consumes = "application/json", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> productQtyUpdate(@RequestBody ProductVO productVO){

        log.info("변경될 수량값 확인>>>>{}", productVO);
        int isOk = ssv.productQtyUpdate(productVO);

        return isOk > 0 ? new ResponseEntity<String>("true", HttpStatus.OK) :
            new ResponseEntity<String>("false",HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ResponseBody
    @GetMapping("/checkId/{id}")
    public String checkId(@PathVariable("id") String id){
        log.info("아이디 값{}", id);
        int isOk = ssv.checkId(id);
        if(isOk > 0){
            return "0";
        }
        return "1";
    }
    @ResponseBody
    @GetMapping("/checkShopName/{shopName}")
    public String checkShopName(@PathVariable("shopName") String shopName){
        int isOk = ssv.checkShopName(shopName);
        if(isOk > 0){
            return "0";
        }
        return "1";
    }


}
