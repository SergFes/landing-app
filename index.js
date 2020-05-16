require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const app = express();

const port = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} body: `, req.body);
    next();
});
app.use(helmet());
app.use(compression());
app.use(express.static("build"));

app.post("/question", async (req, res) => {
    try {
        await sendMailManager(req.body);
        res.send(Response("Спасибо за заявку, наши юристы свяжутся с Вами в ближайшее время", "OK"));
    } catch (e) {
        res.send(Response("Не удалось отправить сообщение, попробуйте еще раз", "ERROR"));
        console.log(e);
    }
});

app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
});

async function sendMailManager(msg) {
    const html = renderHTMLBody(msg);
    const text = JSON.stringify(msg, 4);
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.API_LOGIN,
            pass: process.env.API_PASS,
        },
    });

    await transporter.sendMail({
        from: "fesservl@gmail.com", // sender address
        to: "fesservl@mail.ru", // list of receivers
        subject: "Заявка", // Subject line
        text, // plain text body
        html, // html body
    });
}

function renderHTMLBody({ name, tel, mail, question }) {
    return `
        <h1>Новая заявка</h1>
        <p>
            Имя клиента: ${name}
            <br/>
            Телефон клиента: ${tel}
            <br/>
            Email клиента: ${mail}
            <br/>
            Вопрос клиента: ${question}
        </p>
    `;
}

function Response(msg, status) {
    if (!(this instanceof Response)) return new Response(msg, status);
    this.msg = msg;
    this.status = status;
}
