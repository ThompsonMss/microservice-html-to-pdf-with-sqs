import AWS from 'aws-sdk';

AWS.config.update({ region: process.env.AWS_REGION });
const SQS = new AWS.SQS({ apiVersion: '2012-11-05' });

async function excluirMensagen(ReceiptHandle = '') {

  const deleteParams = {
    QueueUrl: process.env.AWS_QUEUE_URL,
    ReceiptHandle: ReceiptHandle
  };

  return SQS.deleteMessage(deleteParams, function (err, data) {
    if (err) {
      throw new Error(err);
    } else {
      return data;
    }
  }).promise();
}

export async function executarApagarMensagem(ReceiptHandle = '') {
  const data = await excluirMensagen(ReceiptHandle);
  return data;
}