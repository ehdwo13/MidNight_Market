package com.project.www.service;

import com.project.www.domain.AddressVO;
import com.project.www.repository.AddressMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class AddressServiceImpl implements AddressService {
    private final AddressMapper addressMapper;

    @Override
    public int register(AddressVO avo) {
        return addressMapper.register(avo);
    }

    @Override
    public List<AddressVO> getList() {
        return addressMapper.getList();
    }

    @Override
    public int update(AddressVO avo) {
        addressMapper.resetIsMain(avo.getCustomerId()); // 다른 주소들의 isMain을 N으로 초기화
        return addressMapper.update(avo);
    }

    @Override
    public int delete(long ano) {
        return addressMapper.delete(ano);
    }

    @Override
    public AddressVO getAddress(AddressVO avo) {
        return addressMapper.getAddress(avo);
    }
}
