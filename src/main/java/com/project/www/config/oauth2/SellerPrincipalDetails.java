package com.project.www.config.oauth2;

import com.project.www.domain.SellerVO;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;

public class SellerPrincipalDetails implements UserDetails {

    private final SellerVO svo;

    public SellerPrincipalDetails(SellerVO svo) {
        this.svo = svo;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> collect = new ArrayList<>();
        collect.add(new GrantedAuthority() {
            @Override
            public String getAuthority() {
                return svo.getRole();
            }
        });
        return collect;
    }

    @Override
    public String getPassword() {
        return svo.getPw();
    }

    @Override
    public String getUsername() {
        return svo.getId();
    }
    public String getShopName(){
        return svo.getShopName();
    }

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
}
