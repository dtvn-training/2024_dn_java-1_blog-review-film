package com.dac.BackEnd.validation;

import com.dac.BackEnd.constant.ErrorConstants;
import com.dac.BackEnd.entity.BlogEntity.BlogStatus;
import com.dac.BackEnd.exception.MessageException;

public class BlogStatusValidation {

    // Phương thức kiểm tra status có hợp lệ không
    public static BlogStatus checkValidStatus(String status) {
        for (BlogStatus validStatus : BlogStatus.values()) {
            if (validStatus.toString().equals(status)) {
                return validStatus;
            }
        }
        // Ném ra ngoại lệ IllegalArgumentException nếu status không hợp lệ
        throw new MessageException(ErrorConstants.NOT_FOUND_MESSAGE, ErrorConstants.NOT_FOUND_CODE);
    }
}
