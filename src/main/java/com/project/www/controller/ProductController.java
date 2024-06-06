package com.project.www.controller;

import com.project.www.domain.BasketVO;
import com.project.www.domain.ProductDTO;
import com.project.www.domain.ProductVO;
import com.project.www.domain.SlangVO;
import com.project.www.handler.FileHandler;
import com.project.www.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/product/*")
public class ProductController {

    private final ProductService psv;
    private final FileHandler fileHandler;

    //상품 등록 페이지 이동
    @GetMapping("/register")
    public void register(Model model){

        ProductDTO productDTO = psv.getProductCategoryList();

        model.addAttribute("productDTO",productDTO);


    }

    //상품등록
    @PostMapping("/register")
    public String register(ProductVO productVO,
                           @RequestParam(name = "file",required = false)MultipartFile file,
                           @RequestParam(name = "files",required = false)MultipartFile[] files){

        //처음 가격 입력시 할인율이 0이기 떄문에 할인가격 == 처음가격
        productVO.setDiscountPrice(productVO.getPrice());

        ProductDTO productDTO = new ProductDTO();

        productDTO.setProductVO(fileHandler.uploadFile(file,productVO));
        productDTO.setImageList(fileHandler.uploadFiles(files,productVO));



        log.info(">>>프로덕트DTO{}",productDTO);

        int isOk = psv.insert(productDTO);


        return "redirect:/";
    }

    //상품 상세페이지
    @GetMapping("/detail")
    public void detail(@RequestParam("id")long id, Model model){

        //프린시팔로 현재 사용중인 아이디 받아야 한다
        String customerId = "oco0217@gmail.com";
        
        log.info(">>>>Product Detail Id 확인>>>>{}",id);
        ProductDTO productDTO = psv.getDetail(customerId ,id);

        log.info(">>>DTO확인>>>>{}",productDTO);

        model.addAttribute("productDTO",productDTO);

        model.addAttribute("customerId",customerId);
        model.addAttribute("productId",id);

    }

    @ResponseBody
    @PostMapping("/slang/{customerId}/{productId}")
    public String slangPost(@PathVariable("customerId")String customerId, @PathVariable("productId")long productId){

        log.info("찜하기 테스트 잘 연결됌{} , {}", productId,customerId);
        int isOk = psv.slangPost(new SlangVO(customerId, productId));
        return isOk > 0 ? "post_success" : "post_fail";
    }

    @ResponseBody
    @DeleteMapping("/slang/{customerId}/{productId}")
    public String slangDelete(@PathVariable("customerId")String customerId, @PathVariable("productId")long productId){

        //log.info("찜하기 테스트 잘 연결됌");
        int isOk = psv.slangDelete(new SlangVO(customerId, productId));
        return isOk > 0 ? "delete_success" : "delete_fail";
    }


        //상품 리스트 페이지
    @GetMapping("/list")
    public void list(Model model){

    }


    @GetMapping("/product/detailPopup")
    public String detailPopup() {
        return "product/detailPopup"; //
    }

    @GetMapping("/mySlang")
    public void mySlang(){}

    @ResponseBody
    @GetMapping("/getMySlangProduct/{customerId}")
    public List<ProductVO> getMySlangProduct(@PathVariable("customerId")String customerId){
        log.info(">>>>내가찜한품목 고객아이디 확인>>>{}",customerId);
        return psv.getMySlangProduct(customerId);
    }

}