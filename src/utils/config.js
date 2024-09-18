const path = require('path');
const dotenv = require('dotenv');

const result = dotenv.config({
    path: path.resolve(__dirname, `../../environments/.env.${process.env.NODE_ENV}`)
});


// if (result.error) {
//     throw result.error; // Manejar errores al cargar el archivo .env
// }


const config = {
    PORT: process.env.PORT,
    PATH_GUIA: process.env.PATH_GUIA,
    URL_GUIA: process.env.URL_GUIA,
    API: process.env.ROOT_API,
    ENVIROMENT: process.env.ENVIROMENT,
    ROOT_API: process.env.ROOT_API,
    MONGO_URL: process.env.MONGO_URL,
    USERDB: process.env.USERDB,
    PWDDB: process.env.PWDDB,
    JWT_SECRET: process.env.JWT_SECRET,
    FDX_URL: process.env.FDX_URL,
    FDX_QUOTATION_URL: process.env.FDX_QUOTATION_URL,
    FDX_SHIPMENT_URL: process.env.FDX_SHIPMENT_URL,
    FDX_SHIPMENT_VALIDATE_URL: process.env.FDX_SHIPMENT_VALIDATE_URL,
    FDX_SHIPMENT_CANCEL_URL: process.env.FDX_SHIPMENT_CANCEL_URL,
    FDX_PICKUP_SHIPMENT_URL: process.env.FDX_PICKUP_SHIPMENT_URL,
    FDX_URL_TOKEN: process.env.FDX_URL_TOKEN,
    FDX_USER: process.env.FDX_USER,
    FDX_PASSWORD: process.env.FDX_PASSWORD,
    FDX_ACCOUNT_NUMBER: process.env.FDX_ACCOUNT_NUMBER,
    FDX_ACCOUNT_MATER_NUMBER: process.env.FDX_ACCOUNT_MATER_NUMBER,
    FDX_CLIENT_ID_CO: process.env.FDX_CLIENT_ID_CO,
    FDX_CLIENT_SECRET_CO: process.env.FDX_CLIENT_SECRET_CO,
    FDX_ACCOUNT_CO: process.env.FDX_ACCOUNT_CO,
    
};

module.exports = config;
