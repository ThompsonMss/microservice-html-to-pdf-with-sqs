# Microsserviço para converter HTML em PDF

## Intro

Serviço para gerar PDF através de HTML, onde o mesmo consome uma fila no SQS ([sqs-consumer](https://www.npmjs.com/package/sqs-consumer)) e ao processar a mensagem dispara um chamada POST em um webhook configurado na mensagem com o link e outros dados referente ao PDF. Utilizando os recursos de Cluters para executar várias instâncias do aplicativo e distribuir as cargas entre as threads.

<br />

### Lib utilizada para realizar a conversão de HTML para PDF: [html-pdf-node](https://www.npmjs.com/package/html-pdf-node).

<br />

## Esquema da mensagem no SQS (Message.Body)

```typescript
{
  titulo: <string> "Título do PDF",
  link: <string> "seu_link_aqui.html", // link que contém o HTML.
  opcoes: <object> { // Opções para customizar o PDF
    landscape?: <boolean> false, // Orientação do PDF
    pageRanges?: <string> "", // Faixas de papel para imprimir, por exemplo, '1-5, 8, 11-13'
    format?: <string> "A4", // Formato PDF
    width?: <number> "", // Largura do PDF
    height?: <number> "", // Altura do PDF
    margin?: <object> { // margens do PDF
      top: <number> 20, // Margem superior
      right: <number> 20, // Margem direita
      bottom: <number> 20, // Margem inferior
      left: <number> 20 // Margem esquerda
    }
  },
  webhook: {
    endpoint: "https://dominio/metodo_post", // Seu endpoint POST que vai receber a chamada no final do processamento
    body: {} // Qualquer conteúdo. 
  }
}
```

<b>Importante!</b> No término do processamento da mensagem será atribuído três propriedades ao objeto "<i><b>webhook.body</b></i>", são eles:

- <b>sucesso:</b> (boolean) Caso true significa que o relatório foi gerado e se for false deu algum erro no processamento.
- <b>link_pdf?:</b> (string) Contém o link do PDF no Bucket (S3).
- <b>erro?:</b> (string) Contém a mensagem de erro.
<br />
<br />
<br />

## Fluxograma

![fluxo](https://user-images.githubusercontent.com/30129295/188169365-32fdcc6c-c628-4327-b6e6-cc03ab112ad8.png)

<br />

---------------------------------------------------

## Instalação

<br />

### Variáveis de ambiente

> Crie um arquivo **.env** na raiz do projeto, use o arquivo **.env.example** como exemplo.

<br />

### Uso

Siga os comandos abaixo para executar essa aplicação em sua máquina.

> **Atenção!** É necessário que o seu ambiente de desenvolvimento esteja configurado para trabalhar docker e docker-compose. Caso não tenha os mesmos configurados, você precisará instalar esse projeto manualmente.  [Veja os requisitos da aplicação aqui!](#requisitos-da-aplicação)

#

```bash
# Clonando o repositório da aplicação.

git clone https://github.com/ThompsonMss/ms-pdf-com-sqs
```

```bash
# Entrando na pasta da aplicação.

cd ms-pdf/
```

```bash
# Comando para iniciar o container da aplicação com docker-compose.

docker-compose up -d
```

<br />

### Pronto! Abra em seu navegador o link abaixo para ter certeza que o serviço está online.
[Link MS PDF - http://localhost:3005](http://localhost:3005/)

<br />

## Rotas

<br>
Rota de "health check"

> GET - http://localhost:3005/ 
 - Resposta: StatusCode 200 - Service is running! ;D.

<br>
Rota para debugar como está a conversão do HTML para PDF sem precisar inscrever em alguma fila.

> POST - http://localhost:3005/debug-pdf


```typescript
headers: // Cabeçalhos
  {
    key_authetication: "CHAVE_AUTENTICACAO_DO_MS" // Definida em .env
  }

body: // Corpo
  {
    link: "URL do HTML",
    opcoes: {} // Opções de estilização do PDF, as mesmas do Esquema da mensagem no SQS.
  }
```
 - Resposta: StatusCode 200 - Content-Type: application/pdf.

<br />

# Requisitos da aplicação

A estrutura do sistema tem alguns requisitos, são eles:

- NodeJS >= 16

<br>
 
## Links
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/thompson-silva)

<br>

## Licença

[MIT](https://choosealicense.com/licenses/mit/)