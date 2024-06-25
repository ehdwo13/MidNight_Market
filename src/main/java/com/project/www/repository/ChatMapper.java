package com.project.www.repository;

import com.project.www.domain.ChatRoomVO;
import com.project.www.domain.MessageVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ChatMapper {
    void insertChatRoom(ChatRoomVO chatRoom);
    List<ChatRoomVO> findChatRoomsByUserId(@Param("userId") String userId);
    List<MessageVO> findMessagesByChatRoomId(@Param("chatRoomId") Long chatRoomId);
    void insertMessage(MessageVO message);
    void deleteChatRoom(Long chatRoomId);
    Long getTargetChatRoom(String customerId, String sellerId);
}