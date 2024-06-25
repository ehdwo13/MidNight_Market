package com.project.www.config.oauth2;

import com.project.www.domain.CustomerVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

@Slf4j
public class PrincipalDetails implements UserDetails, OAuth2User {

    private final CustomerVO cvo;
    private Map<String, Object> attributes;

    //일반로그인
    public PrincipalDetails(CustomerVO cvo){
        this.cvo = cvo;
    }
    //OAuth 로그인
    public PrincipalDetails(CustomerVO cvo, Map<String, Object> attributes){
        this.cvo = cvo;
        this.attributes = attributes;
    }


    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> collect = new ArrayList<>();
        collect.add(new GrantedAuthority() {
            @Override
            public String getAuthority() {
                return cvo.getRole();
            }
        });
        return collect;
    }

    @Override
    public String getPassword() {
        return cvo.getPw();
    }

    @Override
    public String getUsername() {
        return cvo.getId();
    }

    public String getNickName(){
        return cvo.getNickName();
    }

    public Boolean getStatus(){return cvo.isMStatus();}

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public String getName() {
        return null;
    }

    public String getAuth(){
        return cvo.getRole();
    }
    public Boolean getMStatus(){
        return cvo.isMStatus();
    }

    public long getPoint(){return  cvo.getPoint();}

    public void updatePoints(long point) {
        cvo.setPoint(point);
    }

    public void updateMStatus(boolean mStatus) {cvo.setMStatus(mStatus);}
}
