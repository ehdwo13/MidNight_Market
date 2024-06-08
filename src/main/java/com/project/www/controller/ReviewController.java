package com.project.www.controller;

import com.project.www.domain.ReviewVO;
import com.project.www.handler.FileHandler;
import com.project.www.service.ReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

@RequestMapping("/review/*")
@RestController
@Slf4j
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService rsv;
    private final FileHandler fileHandler;

    @ResponseBody
    @PostMapping("/register")
    public String register(@ModelAttribute ReviewVO reviewVO,@RequestParam(required = false, name = "files") MultipartFile[] files){
        log.info(">>>>리뷰객체 확인>>>{}",reviewVO);
        log.info("파일 온거 확인>>>>{}",(Object) files);


        int isOk = rsv.register(fileHandler.reviewImageUploadFiles(files,reviewVO));
        return isOk > 0 ? "register_success" : "register_fail";
    }

}
