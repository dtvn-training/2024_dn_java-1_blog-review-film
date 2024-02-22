package com.dac.BackEnd.validation;

import com.dac.BackEnd.constant.ErrorConstants;
import com.dac.BackEnd.entity.UserEntity.UserStatus;
import com.dac.BackEnd.exception.MessageException;

public class UserStatusValidation {
    // Phương thức kiểm tra status có hợp lệ không
    public static UserStatus checkValidStatus(String status) {
        for (UserStatus validStatus : UserStatus.values()) {
            if (validStatus.toString().equals(status)) {
                return validStatus;
            }
        }
        // Ném ra ngoại lệ IllegalArgumentException nếu status không hợp lệ
        throw new MessageException(ErrorConstants.NOT_FOUND_MESSAGE, ErrorConstants.NOT_FOUND_CODE);
    }
}
