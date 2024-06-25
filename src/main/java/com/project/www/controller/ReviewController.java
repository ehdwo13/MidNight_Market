package com.project.www.controller;

import com.project.www.domain.ReviewVO;
import com.project.www.handler.FileHandler;
import com.project.www.service.ReviewService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;

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
        return rsv.register(fileHandler.reviewImageUploadFiles(files,reviewVO));
    }

    @ResponseBody
    @GetMapping("/getMyWriteCompletedReviewList/{customerId}")
    public List<ReviewVO> getMyWriteCompletedReviewList(@PathVariable("customerId")String customerId){
       return rsv.getMyWriteCompletedReviewList(customerId);
    }


}
