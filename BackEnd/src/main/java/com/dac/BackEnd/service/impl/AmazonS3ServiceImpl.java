package com.dac.BackEnd.service.impl;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.PutObjectResult;
import com.amazonaws.services.s3.model.S3Object;
import com.dac.BackEnd.service.AmazonS3Service;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.InputStream;
import java.util.Map;
import java.util.Optional;
@Service
@Slf4j
public class AmazonS3ServiceImpl implements AmazonS3Service {

    @Autowired
    private AmazonS3 amazonS3;

    @Override
    public PutObjectResult upload(
            String path,
            String fileName,
            Optional<Map<String, String>> optionalMetaData,
            InputStream inputStream) {
        ObjectMetadata objectMetadata = new ObjectMetadata();

        // Thiết lập quyền truy cập là public-read
        objectMetadata.setSSEAlgorithm(ObjectMetadata.AES_256_SERVER_SIDE_ENCRYPTION);

        optionalMetaData.ifPresent(map -> {
            if (!map.isEmpty()) {
                map.forEach(objectMetadata::addUserMetadata);
            }
        });

        // Sử dụng PutObjectRequest để đặt canned ACL
        PutObjectRequest putObjectRequest = new PutObjectRequest(path, fileName, inputStream, objectMetadata)
                .withCannedAcl(CannedAccessControlList.PublicRead);

        log.debug("Path: " + path + ", FileName:" + fileName);
        
        // Thực hiện upload
        return amazonS3.putObject(putObjectRequest);
    }

    @Override
    public S3Object download(String path, String fileName) {
        return amazonS3.getObject(path, fileName);
    }
}