import 'dotenv/config'

import { Consumer } from 'sqs-consumer';
import AWS from 'aws-sdk';
import { executarProcessarMensagem } from './functions/processarMensagem.js';

AWS.config.update({ region: process.env.AWS_REGION });

export function executarConsumer () {

    const app = Consumer.create({
        queueUrl: process.env.AWS_QUEUE_URL,
        shouldDeleteMessages: false,
        handleMessage: async (message) => {
            await executarProcessarMensagem(message)
        },
        sqs: new AWS.SQS({ apiVersion: '2012-11-05' })
    });

    app.on('error', (err) => {
        console.error(err.message);
        // TODO Enviar error.
    });

    app.on('processing_error', (err) => {
        console.error(err.message);
        // TODO Enviar error.
    });

    app.start();

}