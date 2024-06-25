package com.project.www.handler;

import com.project.www.domain.*;
import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
@Slf4j
public class FileHandler {

    private final String UP_DIR = "C:\\image\\";

    //image 파일(1개)을 넣어주고 링크 리턴하는 메서드
    public ProductVO uploadFile(MultipartFile file, ProductVO productVO) {


        LocalDate date = LocalDate.now();
        String today = date.toString();
        today = today.replace("-", File.separator);

        File folders = new File(UP_DIR, today);

        //Folders Create
        if (!folders.exists()) {
            folders.mkdirs();
        }

        //FileName Save
        String origianlFileName = file.getOriginalFilename();
        String fileName = origianlFileName.substring(
                origianlFileName.lastIndexOf(File.separator) + 1);

        //UUID Create
        UUID uuid = UUID.randomUUID();
        String uuidStr = uuid.toString();

        String fullFileName = uuidStr + "_" + fileName;

        File storeFile = new File(folders, fullFileName);

        try {
            file.transferTo(storeFile);
            File thumbNail = new File(folders, uuidStr + "_th_" + fileName);
            //썸네일 이미지 크기 조절
            Thumbnails.of(storeFile).size(84, 84).toFile(thumbNail);

            //productVO에 주소 저장
            productVO.setMainImage("/upload/" + today + "/" + fullFileName);
            productVO.setThumbImage("/upload/" + today + "/" + uuidStr + "_th_" + fileName);


        } catch (Exception e) {
            e.printStackTrace();
        }

        return productVO;
    }


    //상품 상세이미지 메소드
    public List<ProductDetailImageVO> uploadFiles(MultipartFile[] files, ProductVO productVO) {

        List<ProductDetailImageVO> imageList = new ArrayList<>();

        LocalDate date = LocalDate.now();
        String today = date.toString();
        today = today.replace("-", File.separator);

        File folders = new File(UP_DIR, today);

        if (!folders.exists()) {
            folders.mkdirs();
        }

        for (MultipartFile file : files) {
            ProductDetailImageVO fvo = new ProductDetailImageVO();

            UUID uuid = UUID.randomUUID();
            String uuidStr = uuid.toString();

            String originalFileName = file.getOriginalFilename();
            String fileName = originalFileName.substring(
                    originalFileName.lastIndexOf(File.separator) + 1);

            String fullFileName = uuidStr + "_" + fileName;

            File storeFile = new File(folders, fullFileName);

            try {
                file.transferTo(storeFile);
                fvo.setDetailImage("/upload/" + today + "/" + fullFileName);

                int sequence = Integer.parseInt(fileName.substring(fileName.indexOf('.') - 1, fileName.indexOf('.')));

                fvo.setSequence(sequence);

            } catch (Exception e) {
                e.printStackTrace();
            }
            imageList.add(fvo);
        }
        return imageList;
    }

    //리뷰이미지 업로드
    public ReviewDTO reviewImageUploadFiles(MultipartFile[] files, ReviewVO reviewVO) {

        //DTO객체 생성
        ReviewDTO reviewDTO = new ReviewDTO();

        //DTO에 reviewVO 객체 저장
        reviewDTO.setReviewVO(reviewVO);

        //만약 파일이 없다면 바로 리턴
        if(files == null){
            reviewDTO.setReviewImageVOList(null);
            return reviewDTO;
        }

        LocalDate date = LocalDate.now();
        String today = date.toString();
        today = today.replace("-", File.separator);

        File folders = new File(UP_DIR, today);

        if (!folders.exists()) {
            folders.mkdirs();
        }

        List<ReviewImageVO> reviewImageVOList = new ArrayList<>();

        for (MultipartFile file : files) {
            ReviewImageVO fvo = new ReviewImageVO();

            UUID uuid = UUID.randomUUID();
            String uuidStr = uuid.toString();

            String originalFileName = file.getOriginalFilename();
            String fileName = originalFileName.substring(
                    originalFileName.lastIndexOf(File.separator) + 1);

            String fullFileName = uuidStr + "_" + fileName;

            File storeFile = new File(folders, fullFileName);

            try {
                file.transferTo(storeFile);
                File thumbNail = new File(folders, uuidStr + "_th_" + fileName);
                //썸네일 이미지 크기 조절
                Thumbnails.of(storeFile).size(100, 100).toFile(thumbNail);

                //ReviewImageVO에 주소 저장
                fvo.setReviewImage("/upload/" + today + "/" + fullFileName);
                //썸네일저장
                fvo.setReviewThumbImage("/upload/" + today + "/" + uuidStr + "_th_" + fileName);
                reviewImageVOList.add(fvo);
            } catch (Exception e) {
                e.printStackTrace();
            }
            //리뷰 이미지 리스트를 ReviewDTO에 저장
            reviewDTO.setReviewImageVOList(reviewImageVOList);

        }
        return reviewDTO;

    }
}
