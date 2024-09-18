const {
    response,
    json
} = require('express');
const axios = require('axios');
const { FDX_QUOTATION_URL, FDX_SHIPMENT_URL, FDX_SHIPMENT_VALIDATE_URL, FDX_SHIPMENT_CANCEL_URL } = require('../utils/config');


// const url = 'https://apis.fedex.com/rate/v1/rates/quotes';
//'https://apis-sandbox.fedex.com/rate/v1/rates/quotes';


const shipment = async (req, res = response) => {

    try {    
        const {
            headers,
            data
        } = req.body;
        
        /*
        res.status(201).json({
            ok: false,
            msg: data
        });
        return res;
*/
    
        // const ValidationShipment = await getValidateShipment(headers, data)

        const CreateShipment = await getCreateShipment(headers, data)        

        if (CreateShipment.ok === false) {
            res.status(400).json({
                ok: false,
                msg: CreateShipment.msg
            });            
        } else {
            res.status(200).json({
                ok: true,
                msg: CreateShipment.msg
            })
        }
        
        //return res;
        
    } catch (error) {
        console.error('Error al procesar las solicitudes a FDX:', error);
        res.status(500).json({
            ok: false,
            data: 'Error al procesar las solicitudes a FDX.'
        });

        //return res;
    }
};

const getValidateShipment = async (headers, data) => {

    try {
        const url = FDX_SHIPMENT_VALIDATE_URL //'https://apis-sandbox.fedex.com/ship/v1/shipments/packages/validate';
    
        // Verificar si data es un arreglo o un solo objeto
        const requestData = Array.isArray(data) ? data : [data];
    
        const responses = await Promise.all(
            requestData.map(async data => {
                try {
                    const response = await axios.post(url, data, {
                        headers
                    });
                    // console.log('response Validacion: ', response)
                    return {
                        status: response.status,
                        data: response.data
                    };
                } catch (error) {
                    console.error('Error en la solicitud:', error.response ? error.response.data : error.message);
                    return {
                        status: error.response ? error.response.status : 500,
                        // data: 'Error en la solicitud a FDX.' + (error.response ? error.response.data : error.message)
                    };
                }
            })
        );
    
        if (responses[0].status !== 200) {
            return {
                ok: false,
                msg: responses.output
            };
        } else {
            return {
                ok: true,
                msg: responses
            };
        } 

    } catch (error) {
        console.error('Error al procesar las solicitudes a FDX:', error);
        // En caso de error, retornar un objeto con el error
        return {
            ok: false,
            msg: 'Error al Validar el Envío a FDX: ' + error
        };
    }
}

const getCreateShipment = async (headers, data) => {

    try {
        const url = FDX_SHIPMENT_URL //'https://apis.fedex.com/rate/v1/rates/quotes';
    
        // Verificar si data es un arreglo o un solo objeto
        const requestData = Array.isArray(data) ? data : [data];
    
        const responses = await Promise.all(
            requestData.map(async data => {
                try {
                    // console.log('Payload: ', data.requestedShipment);
                    const response = await axios.post(url, data, {
                        headers
                    });
                    // console.log('response: ', response.data);
                    return {
                        status: response.status,
                        data: response.data
                    };
                } catch (error) {
                    //console.error('Error en la solicitud getCreateShipment:', error.response.data.errors[0].parameterList);
                    return {
                        status: error.response ? error.response.status : 500,
                        data: 'Error en la solicitud a FDX.' + (error.response ? JSON.stringify(error.response.data) : error.message)
                    };
                }
            })
        );

        if (responses[0].status !== 200) {
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
        console.error('Error al procesar las solicitudes a FDX:', error);
        res.status(500).json({
            ok: false,
            data: 'Error al procesar la Creacion del Envio a FDX: ' + error
        });
    }

}
const getCancelShipment = async () => {
     const url = FDX_SHIPMENT_CANCEL_URL //'https://apis-sandbox.fedex.com /ship/v1/shipments/cancel';


}





module.exports = {
    shipment,
};