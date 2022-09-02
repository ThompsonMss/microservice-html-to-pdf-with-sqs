import 'dotenv/config'
import AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';

AWS.config.update({ region: process.env.AWS_REGION });
const S3 = new AWS.S3({ apiVersion: '2006-03-01' });

async function uploadS3(arquivo) {

  const key = `financeiro/relatorio/${uuid()}.pdf`;
  
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Body: arquivo,
    ContentType: 'application/pdf',
    ACL: 'public-read'
  };

  const data = await S3.upload(params).promise();
  return data.Location;
}

export async function executarUploadS3(arquivo) {
  const data = await uploadS3(arquivo);
  return data;
}