package com.project.www.config.oauth2;

import com.project.www.domain.CustomerVO;
import com.project.www.domain.SellerVO;
import com.project.www.repository.SellerMapper;
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
public class SellerPrincipalDetailsService implements UserDetailsService {

    @Autowired
    private SellerMapper sellerMapper;

    @Override
    public UserDetails loadUserByUsername(String id) throws UsernameNotFoundException {
        SellerVO svo = sellerMapper.findById(id);
        if(svo != null) {
            return new SellerPrincipalDetails(svo);
        }
        return null;
    }
}
