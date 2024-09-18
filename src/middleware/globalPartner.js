const axios = require('axios');
const cron = require('node-cron');
const dotenv = require('dotenv');
const tokensAuth = require('../models/tokensAuth');

const { DateTime } = require('luxon');
const querystring = require('querystring');
const { FDX_CLIENT_ID_CO, FDX_CLIENT_SECRET_CO, FDX_URL_TOKEN } = require('../utils/config');
const { MarcaDeTiempoCol } = require('../helpers/pakkiDateTime');
dotenv.config();

// cron.schedule('59 6 * * *', async () => {
//   const tknfdxCO = await AuthFdxCo();
//   console.log("Ya pasamos Cron en GlobalPartner en Pruebas hoy 13-03-2024 ...");
// });

// cron.schedule('*/1 * 7-22 *  1-7', async () => {
cron.schedule('*/58 * * * *', async () => {
  const tknfdxCO = await AuthFdxCo();
});

const AuthService = async (url, envPrefix, data) => {
  // console.log('url, envPrefix, data: ', url, envPrefix, data);
  //  await tokensAuth.drop();
  let dat = await MarcaDeTiempoCol()
  // console.log('Manejo de Fecha: ', dat);
  try {
    const headers = { 'content-type': 'application/x-www-form-urlencoded' };
    const response = await axios.post(url, querystring.stringify(data), { headers: headers });
    // console.log('response: ', response)
    if (response && response.data) {
      if (envPrefix === "FDX_CO" ) {
        const tokenDataCo = await new tokensAuth({
          "provider.envPrefix": envPrefix,
          "provider.access_token": response.data.access_token,
          "provider.token_type": response.data.token_type,
          "provider.expires_in": response.data.expires_in,
          "provider.scope": response.data.scope
        });
        // console.log('tokenDataCo: ', tokenDataCo);
        await tokenDataCo.save(); 
      } else {
        console.error(`No se recibieron Credenciales de respuesta desde ${envPrefix}`);
      }
      
    } else {
      console.error(`No se recibieron Credenciales de respuesta desde ${envPrefix}`);
    }
    
  } catch (error) {
    console.error(error);
    console.error(`Error al procesar el Token de: ${envPrefix}`);
  }
};

const AuthFdxCo = () => AuthService(
    FDX_URL_TOKEN,
    'FDX_CO',
    {
      grant_type: 'client_credentials',
      client_id: FDX_CLIENT_ID_CO,
      client_secret: FDX_CLIENT_SECRET_CO
    }
);


module.exports = {
    AuthFdxCo,
};


