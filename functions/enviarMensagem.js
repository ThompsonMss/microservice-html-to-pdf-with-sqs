import AWS from 'aws-sdk';

AWS.config.update({ region: process.env.AWS_REGION });
const SQS = new AWS.SQS({ apiVersion: '2012-11-05' });

export function executarEnviarMensagem (message) {

    return SQS.sendMessage({
        MessageBody: JSON.stringify(message),
        QueueUrl: `${process.env.AWS_QUEUE_URL}`
    }).promise();
}