package com.dac.BackEnd.validation;

import com.dac.BackEnd.entity.BlogEntity.BlogStatus;

public class BlogStatusValidation {

    // Phương thức kiểm tra status có hợp lệ không
    public static BlogStatus checkValidStatus(String status) {
        for (BlogStatus validStatus : BlogStatus.values()) {
            if (validStatus.toString().equals(status)) {
                return validStatus;
            }
        }
        // Ném ra ngoại lệ IllegalArgumentException nếu status không hợp lệ
        throw new IllegalArgumentException("Invalid status: " + status);
    }
}
