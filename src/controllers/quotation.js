const {
    response
} = require('express');
const axios = require('axios');
const { FDX_QUOTATION_URL } = require('../utils/config');


// const url = 'https://apis.fedex.com/rate/v1/rates/quotes';
//'https://apis-sandbox.fedex.com/rate/v1/rates/quotes';

const quota = async (req, res = response) => {
    try {
        const url = FDX_QUOTATION_URL //'https://apis.fedex.com/rate/v1/rates/quotes';
        const {
            headers,
            data
        } = req.body;
        // console.log('data Estructura de url: ' + url);
        // console.log(headers);
        // console.log(data);
    
        const responses = await Promise.all(
            data.map(async quotation => {
                try {
                    const response = await axios.post(url, quotation, {
                        headers
                    });
                    // console.log('response Interna: ', response.data.output);
                    return {
                        status: response.status,
                        data: response.data
                    };
                } catch (error) {
                    // console.error('Error en la solicitud:', error.response.data.error);
                    console.error('Error en la solicitud:', error.response ? error.response.data : error.message);
                    return {
                        status: error.response ? error.response.status : 500,
                        data: 'Error en la solicitud a FDX.' + error.response ? error.response.data : error.message
                    };
                }
            })
        );
        // console.log('responses Out: ', responses[0]);
        res.status(200).json({
            ok: true,
            msg: responses
        });
    } catch (error) {
        console.error('Error al procesar las solicitudes a FDX:', error);
        res.status(500).json({
            ok: false,
            data: 'Error al procesar las solicitudes a FDX.'
        });
    }
};






module.exports = {
    quota,
};