package com.project.www.service;

import com.project.www.domain.AddressVO;
import com.project.www.domain.CustomerVO;
import com.project.www.repository.CustomerMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class CustomerServiceImpl implements CustomerService{
    private final CustomerMapper customerMapper;

    @Override
    public int insert(CustomerVO cvo) {
        int isOk = customerMapper.insert(cvo);
        return isOk;
    }

    @Override
    public int checkEmail(String email) {
        int isOk = customerMapper.checkEmail(email);
        return isOk;
    }

    @Override
    public int checkNickName(String nickName) {
        int isOk = customerMapper.checkNickName(nickName);
        return isOk;
    }

    @Override
    public String findNickName(String nickName) {
        return customerMapper.findNickName(nickName);
    }

    @Override
    public int findId(String id) {
        return customerMapper.findId(id);
    }

    @Override
    public void updateDefaultPw(String id, String pw) {
        customerMapper.updateDefaultPw(id, pw);
    }

    @Override
    public void updatePw(String id, String pw) {
        customerMapper.updatePw(id, pw);
    }

    @Override
    public List<CustomerVO> getList() {
        return customerMapper.getList();
    }

    @Override
    public List<AddressVO> getMyAddrList(String customerId) {
        return customerMapper.getMyAddrList(customerId);
    }
}
