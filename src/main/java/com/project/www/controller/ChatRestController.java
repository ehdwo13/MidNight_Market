package com.project.www.controller;

import com.project.www.domain.ChatRoomVO;
import com.project.www.domain.MessageVO;
import com.project.www.service.ChatService;
import com.sun.tools.jconsole.JConsoleContext;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/chat")
public class ChatRestController {

    @Autowired
    private ChatService chatService;

    @PostMapping("/rooms")
    public ChatRoomVO createChatRoom(@RequestParam String customerId, @RequestParam String sellerId) {
        return chatService.createChatRoom(customerId, sellerId);
    }

    @GetMapping("/rooms/{userId}")
    public List<ChatRoomVO> getChatRoomsByUserId(@PathVariable String userId) {
        return chatService.getChatRoomsByUserId(userId);
    }

    @GetMapping("/messages/{chatRoomId}")
    public List<MessageVO> getMessagesByChatRoomId(@PathVariable Long chatRoomId) {
        return chatService.getMessagesByChatRoomId(chatRoomId);
    }

    @DeleteMapping("/rooms/{chatRoomId}")
    public void deleteChatRoom(@PathVariable Long chatRoomId) {
        chatService.deleteChatRoom(chatRoomId);
    }
    @GetMapping("/getRoomId/{customerId}/{sellerId}")
    public Long getRoomId(@PathVariable String customerId, @PathVariable String sellerId) {
        return chatService.getTargetChatRoom(customerId, sellerId);
    }
}