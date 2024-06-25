package com.project.www.controller;

import com.project.www.domain.NotificationVO;
import com.project.www.service.NotificationService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/notification/*")
@Controller
public class NotificationController {
    private final NotificationService nsv;

    @GetMapping("/notifications")
    @ResponseBody
    public List<NotificationVO> getNotifications(HttpSession ses) {
        String username = (String) ses.getAttribute("id");
        if(username != null) {
            List<NotificationVO> notificationList = nsv.getList(username);
            return notificationList;
        }
        return null;
    }
    @DeleteMapping("/{content}/{id}")
    @ResponseBody
    public ResponseEntity<?> deleteNotification(@PathVariable("content") String content, @PathVariable("id")String id) {
        try {
            boolean isDeleted = nsv.deleteNotificationByContent(content,id);
            if (isDeleted) {
                return ResponseEntity.ok().body("Notification deleted successfully");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Notification not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting notification");
        }
    }

    @ResponseBody
    @GetMapping("/count/{customerId}")
    public int count(@PathVariable("customerId")String customerId) {
        return nsv.getCount(customerId);
    }


}
