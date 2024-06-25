package com.project.www.service;

import com.project.www.domain.ChatRoomVO;
import com.project.www.domain.MessageVO;

import java.util.List;

public interface ChatService {
    ChatRoomVO createChatRoom(String customerId, String sellerId);
    List<ChatRoomVO> getChatRoomsByUserId(String userId);
    List<MessageVO> getMessagesByChatRoomId(Long chatRoomId);
    void saveMessage(MessageVO message);
    void deleteChatRoom(Long chatRoomId);
    Long getTargetChatRoom(String customerId, String sellerId);
}
