import * as aws from "@pulumi/aws";

const bucket = new aws.s3.Bucket("widget-upload-iac-bucket", {
    bucket: 'widget-upload-iac-bucket',
    tags: {
        IAC: 'true'
    }
});

const ecr = new aws.ecr.Repository('widget-upload-iac-ecr', {
    name: 'widget-upload-iac-ecr',
    imageTagMutability: 'IMMUTABLE',
    tags: {
        IAC: 'true'
    }
});


export const bucketName = bucket.id;
export const bucketInfo = bucket.bucket;
export const bucketArn = bucket.arn;

export const ecrName = ecr.name;
export const ecrRepository = ecr.repositoryUrl;