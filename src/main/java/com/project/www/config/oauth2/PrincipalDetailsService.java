package com.project.www.config.oauth2;

import com.project.www.domain.CustomerVO;
import com.project.www.repository.CustomerMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Slf4j
public class PrincipalDetailsService implements UserDetailsService {

    @Autowired
    private CustomerMapper customerMapper;

    @Override
    public UserDetails loadUserByUsername(String providerId) throws UsernameNotFoundException {
        CustomerVO userEntity = customerMapper.findByUserName(providerId);
        if(userEntity != null) {
            return new PrincipalDetails(userEntity);
        }
        return null;
    }

}
