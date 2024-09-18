const {
    response
} = require('express');
const axios = require('axios');
const { FDX_QUOTATION_URL, FDX_SHIPMENT_URL, FDX_SHIPMENT_VALIDATE_URL, FDX_SHIPMENT_CANCEL_URL, FDX_PICKUP_SHIPMENT_URL } = require('../utils/config');


// const url = 'https://apis.fedex.com/rate/v1/rates/quotes';
//'https://apis-sandbox.fedex.com/rate/v1/rates/quotes';


const getPickupFDX = async (req, res = response) => {

    try {    
        const {
            headers,
            data
        } = req.body;
        
        const CreatePickupShipment = await getCreatePickupShipment(headers, data)        
    
        if (CreatePickupShipment.ok === false) {
            // console.log('Respuesta de la Funcion CreatePickupShipment Error: ', CreatePickupShipment)
            res.status(200).json({
                ok: false,
                msg: CreatePickupShipment.msg[0].data.errors
            });
        } else {
            // console.log('CreatePickupShipment: ', CreatePickupShipment)
            res.status(200).json({
                ok: true,
                msg: CreatePickupShipment.msg[0].data.output
            })
        }        
    } catch (error) {
        console.error('Error al procesar las solicitudes a FDX:', error);
        res.status(500).json({
            ok: false,
            data: 'Error al procesar las solicitudes a FDX.' + error
        });
    }
};


const getCreatePickupShipment = async (headers, data) => {
    try {
        const url = FDX_PICKUP_SHIPMENT_URL;

        const requestData = Array.isArray(data) ? data : [data];

        const responses = await Promise.all(
            requestData.map(async data => {
                try {
                    const response = await axios.post(url, data, {
                        headers
                    });

                    if (response.data.output && response.data.output.pickupConfirmationCode && response.data.output.location) {
                        return {
                            status: response.status,
                            data: response.data
                        };
                    } else {
                        throw new Error('La respuesta de FedEx no contiene los campos requeridos.');
                    }
                } catch (error) {
                    console.error('Error en la solicitud:', error.response ? error.response.data : error.message);
                    return {
                        status: error.response ? error.response.status : 500,
                        data: error.response ? error.response.data : 'Error en la solicitud a FDX.' + error.message
                    };
                }
            })
        );

        if (responses.some(response => response.status !== 200)) {
            return {
                ok: false,
                msg: responses
            };
        } else {
            return {
                ok: true,
                msg: responses
            };
        }
    } catch (error) {
        return {
            ok: false,
            msg: 'Error al procesar la Creación del Envío a FDX: ' + error.message
        };
    }
}





const getCancelPickupShipment = async () => {
    const url = FDX_SHIPMENT_CANCEL_URL //'https://apis-sandbox.fedex.com /ship/v1/shipments/cancel';


}





module.exports = {
    getPickupFDX,
};