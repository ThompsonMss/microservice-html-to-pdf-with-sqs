import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import cluster from 'cluster';
import os from 'os';
import { executarConsumer } from './consumer.js';
import { executarGerarPDF } from './functions/gerarPDF.js';

const PORT = process.env.PORT || 3005;

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {

    console.log('Processo primário rodando.');

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

} else {

    const app = express();

    // Middleware de autenticação.
    const middlewareAutenticacao = function (req, res, next) {

        const { key_authetication } = req.headers;

        if (!key_authetication) {
            res.status(401).send({ error: 'Chave de autenticação não informada.' });
            return;
        }

        if (key_authetication !== process.env.CHAVE_AUTENTICACAO_DO_MS) {
            res.status(401).send({ error: 'Chave de autenticação inválida.' });
            return;
        }

        next();
    };

    app.use(cors());
    app.use(express.json());

    app.use(middlewareAutenticacao);

    app.get('/', (_, res) => res.send('Service is running! ;D'));

    app.post('/debug-pdf', async (req, res) => {

        const linkHTML = req.body.link;
        const opcoes = req.body.opcoes;

        const pdf = await executarGerarPDF(linkHTML, opcoes);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'form-data; name="arquivo.pdf";     filename="arquivo.pdf"');
        res.status(200).send(pdf)

    });

    executarConsumer();

    app.listen(PORT, () => console.log(`Server on (Port ${PORT})`));
}
