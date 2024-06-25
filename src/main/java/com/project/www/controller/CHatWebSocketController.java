package com.project.www.controller;


import com.project.www.domain.MessageVO;
import com.project.www.service.ChatService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
public class CHatWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    @Autowired
    private ChatService csv;

    public CHatWebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(MessageVO messageVO) {
        csv.saveMessage(messageVO);
        messagingTemplate.convertAndSend("/topic/" + messageVO.getChatRoomId(), messageVO);
    }

    @MessageMapping("/chat.addUser")
    public void addUser(MessageVO messageVO) {
        messagingTemplate.convertAndSend("/topic/" + messageVO.getChatRoomId(), messageVO);
    }
}