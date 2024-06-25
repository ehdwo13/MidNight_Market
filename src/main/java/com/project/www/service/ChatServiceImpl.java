package com.project.www.service;

import com.project.www.domain.ChatRoomVO;
import com.project.www.domain.MessageVO;
import com.project.www.repository.ChatMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatServiceImpl implements ChatService {

    @Autowired
    private ChatMapper chatMapper;

    @Override
    public ChatRoomVO createChatRoom(String customerId, String sellerId) {
        ChatRoomVO chatRoom = new ChatRoomVO();
        chatRoom.setCustomerId(customerId);
        chatRoom.setSellerId(sellerId);
        chatMapper.insertChatRoom(chatRoom);
        return chatRoom;
    }

    @Override
    public List<ChatRoomVO> getChatRoomsByUserId(String userId) {
        return chatMapper.findChatRoomsByUserId(userId);
    }

    @Override
    public List<MessageVO> getMessagesByChatRoomId(Long chatRoomId) {
        return chatMapper.findMessagesByChatRoomId(chatRoomId);
    }

    @Override
    public void saveMessage(MessageVO message) {
        chatMapper.insertMessage(message);
    }

    @Override
    public void deleteChatRoom(Long chatRoomId) {
        chatMapper.deleteChatRoom(chatRoomId);
    }

    @Override
    public Long getTargetChatRoom(String customerId, String sellerId) {
        return chatMapper.getTargetChatRoom(customerId,sellerId);
    }
}