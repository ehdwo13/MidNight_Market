package com.project.www.config.oauth2;

import com.project.www.config.oauth2.provider.GoogleUserInfo;
import com.project.www.config.oauth2.provider.KakaoUserInfo;
import com.project.www.config.oauth2.provider.NaverUserInfo;
import com.project.www.config.oauth2.provider.OAuth2UserInfo;
import com.project.www.domain.CustomerVO;
import com.project.www.domain.NotificationVO;
import com.project.www.repository.CustomerMapper;
import com.project.www.service.MemberCouponService;
import com.project.www.service.NotificationService;
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
    @Autowired
    private final NotificationService nsv;
    @Autowired
    private final MemberCouponService mscv;

    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
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
        String role = "role_user";
        CustomerVO existingCustomer = customerMapper.findByUserName(providerId);
        if (existingCustomer == null) {
            CustomerVO newCustomer = new CustomerVO();
            newCustomer.setId("("+provider+")"+id);
            newCustomer.setNickName(nickName);
            newCustomer.setProvider(provider);
            newCustomer.setProviderId(providerId);
            newCustomer.setRole(role);
            customerMapper.insert(newCustomer);
            NotificationVO nvo = new NotificationVO();
            nvo.setCustomerId("("+provider+")"+id);
            mscv.addCoupon("("+provider+")"+id,"1");
            nvo.setNotifyContent("회원가입을 환영합니다. 3천원 쿠폰이 발급되었습니다. ");
            nsv.insert(nvo);
            return new PrincipalDetails(newCustomer, oAuth2User.getAttributes());
        } else {
            return new PrincipalDetails(existingCustomer, oAuth2User.getAttributes());
        }
    }
}