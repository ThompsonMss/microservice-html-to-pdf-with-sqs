import 'dotenv/config'
import axios from 'axios';
import { executarGerarPDF } from './gerarPDF.js';
import { executarUploadS3 } from './uploadS3.js';
import { executarApagarMensagem } from './apagarMensagem.js';

export async function executarProcessarMensagem(mensagem) {

    const ReceiptHandle = mensagem.ReceiptHandle;
    let webhookPost = undefined;

    try {

        const { titulo, link, opcoes, webhook } = JSON.parse(mensagem.Body);

        webhookPost = webhook;

        // Gerando buffer do PDF
        const PDF = await executarGerarPDF(link, opcoes ?? {});

        // Salvando o PDF no S3
        const linkPDF = await executarUploadS3(PDF);

        // Disparando uma ação para o webhook
        await axios.post(webhook.endpoint, { ...webhook.body, link_pdf: linkPDF, sucesso: true });

        // Removendo mensagem da fila.
        await executarApagarMensagem(ReceiptHandle);

    } catch (error) {
        console.log('Error', error.message);

        if (webhookPost !== undefined) {
            await axios.post(webhookPost.endpoint, { ...webhookPost.body, sucesso: false, erro: error.message });
        }
    }
}