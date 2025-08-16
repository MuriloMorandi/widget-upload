import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const bucket_primeiro = new aws.s3.Bucket("widget-upload-iac-bucket", {
    bucket: 'primeiro-teste',
    tags: {
        IAC: 'true'
    }
});

const bucket_segundo = new aws.s3.Bucket("widget-upload-iac-bucket", {
    bucket: 'segundo-teste',
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


export const bucketPrimeiroName = bucket_primeiro.id;
export const bucketPrimeiroInfo = bucket_primeiro.bucket;
export const bucketPrimeiroArn = bucket_primeiro.arn;

export const bucketSegundoName = bucket_segundo.id;
export const bucketSegundoInfo = bucket_segundo.bucket;
export const bucketSegundoArn = bucket_segundo.arn;

export const ecrName = ecr.name;
export const ecrRepository = ecr.repositoryUrl;