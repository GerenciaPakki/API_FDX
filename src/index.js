const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const env = require('./utils/config');
const {
    dbConn
} = require('./database/config');

const app = express();
const port = env.PORT;


// Coneccion a Base de Datos
dbConn();
const corsOptions = {
    origin: ['*.pakki.click/*', 'https://admin.pakki.click', 'https://devfront.pakki.click', 'https://devback.pakki.click', 'https://pakki.click', 'http://localhost:4200', '*/localhost:*', 'http://localhost:4200/api/v1'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['x-token', 'Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

// Usamos para el Ambiente de dev
app.use(morgan('dev'));
app.use(express.json());

// Rutas
app.use(`/qts`, require('./routes/quotation'));
app.use(`/sps`, require('./routes/shipment'));
app.use(`/pkp`, require('./routes/pickup'));

// configuramos el Servidor de express
app.listen(port, () => {
    console.log(`${env.ENVIROMENT} ${env.PORT}`);
});