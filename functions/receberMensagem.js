import AWS from 'aws-sdk';

AWS.config.update({ region: process.env.AWS_REGION });
const SQS = new AWS.SQS({ apiVersion: '2012-11-05' });

const params = {
  AttributeNames: [
    "SentTimestamp"
  ],
  MaxNumberOfMessages: 10,
  MessageAttributeNames: [
    "All"
  ],
  QueueUrl: process.env.AWS_QUEUE_URL,
  VisibilityTimeout: 20,
  WaitTimeSeconds: 0
};

async function getMensagens() {
  return SQS.receiveMessage(params, function (err, data) {
    if (err) {
      throw new Error(err);
    } else if (data.Messages) {
      return data.Messages;
    }
  }).promise();
}

export async function executarReceberMensagem() {

  let aux = [];
  const data = await getMensagens();

  if ('Messages' in data) {
    aux = data.Messages;
  }

  return aux;
}