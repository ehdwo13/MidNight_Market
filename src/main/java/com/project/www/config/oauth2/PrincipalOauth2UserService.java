package com.project.www.config.oauth2;

import com.nimbusds.openid.connect.sdk.claims.UserInfo;
import com.project.www.config.oauth2.provider.GoogleUserInfo;
import com.project.www.config.oauth2.provider.KakaoUserInfo;
import com.project.www.config.oauth2.provider.NaverUserInfo;
import com.project.www.config.oauth2.provider.OAuth2UserInfo;
import com.project.www.domain.CustomerVO;
import com.project.www.repository.CustomerMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class PrincipalOauth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private CustomerMapper customerMapper;

    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        log.info("getAttributes : {}",oAuth2User.getAttributes());
        String provider = userRequest.getClientRegistration().getRegistrationId();
        OAuth2UserInfo oAuth2UserInfo = null;
        if(provider.equals("google")){
            oAuth2UserInfo = new GoogleUserInfo(oAuth2User.getAttributes());
        } else if (provider.equals("kakao")) {
            oAuth2UserInfo = new KakaoUserInfo(oAuth2User.getAttributes());
        } else if (provider.equals("naver")) {
            oAuth2UserInfo = new NaverUserInfo(oAuth2User.getAttributes());
        }
        provider = oAuth2UserInfo.getProvider();
        String providerId = oAuth2UserInfo.getProviderId();
        String id = oAuth2UserInfo.getEmail();
        String nickName= oAuth2UserInfo.getName();
        String role = "ROLE_USER";
        CustomerVO existingCustomer = customerMapper.findByUserName(providerId);
        if (existingCustomer == null) {
            log.info("New user, creating account");
            CustomerVO newCustomer = new CustomerVO();
            newCustomer.setId("("+provider+")"+id);
            newCustomer.setNickName(nickName);
            newCustomer.setProvider(provider);
            newCustomer.setProviderId(providerId);
            newCustomer.setRole(role);
            customerMapper.insert(newCustomer);
            return new PrincipalDetails(newCustomer, oAuth2User.getAttributes());
        } else {
            return new PrincipalDetails(existingCustomer, oAuth2User.getAttributes());
        }
    }
}