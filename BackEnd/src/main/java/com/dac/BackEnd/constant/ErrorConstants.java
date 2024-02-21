package com.dac.BackEnd.constant;

public class ErrorConstants {

    public static final int INVALID_CREDENTIALS_CODE = 401;
    public static final String INVALID_CREDENTIALS_MESSAGE = "Invalid username or password";

    public static final int INVALID_DATA_CODE = 400;
    public static final String INVALID_DATA_MESSAGE = "Invalid data provided";

    public static final int NOT_FOUND_CODE = 404;
    public static final String NOT_FOUND_MESSAGE = "Resource not found";

    public static final int INTERNAL_SERVER_ERROR_CODE = 500;
    public static final String INTERNAL_SERVER_ERROR_MESSAGE = "Internal server error. Please try again later.";
}