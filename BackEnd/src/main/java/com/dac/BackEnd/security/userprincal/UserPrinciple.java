package com.dac.BackEnd.security.userprincal;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.dac.BackEnd.entity.UserEntity.UserEntity;
import com.dac.BackEnd.entity.UserEntity.UserRole;
import com.dac.BackEnd.entity.UserEntity.UserStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class UserPrinciple implements UserDetails{

    private Long id;
    private String email;
    @JsonIgnore
    private String password;
    private UserRole role;
    private String name;
    private String phone;
    private UserStatus status;
    private Collection<? extends GrantedAuthority> authorities;

    public static UserDetails build(UserEntity user) {
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(user.getRole().name()));
        return new UserPrinciple(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                user.getRole(),
                user.getName(),
                user.getPhone(),
                user.getStatus(),
                authorities
        );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
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
