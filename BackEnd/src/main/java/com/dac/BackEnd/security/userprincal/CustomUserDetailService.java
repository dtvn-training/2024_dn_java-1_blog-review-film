package com.dac.BackEnd.security.userprincal;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.dac.BackEnd.constant.ErrorConstants;
import com.dac.BackEnd.entity.UserEntity.UserEntity;
import com.dac.BackEnd.exception.MessageException;
import com.dac.BackEnd.repository.UserRepository;

@Service
public class CustomUserDetailService implements UserDetailsService{

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserEntity user = userRepository.findUserByDeleteFlagFalseAndEmail(email).orElseThrow(()-> new MessageException(ErrorConstants.INVALID_CREDENTIALS_MESSAGE, ErrorConstants.INVALID_CREDENTIALS_CODE));
        return UserPrinciple.build(user);

    }

    public static void main(String[] args) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        System.out.println(passwordEncoder.encode("@Trongnguyen123"));
    }
}
