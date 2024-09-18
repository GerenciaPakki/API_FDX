/*
    path: '/sps' Control de quotation
*/

const {
    Router
} = require('express');
const {
    check
} = require('express-validator');
const { shipment } = require('../controllers/shipment');



const router = Router();

router.post('/', [
    //AuthFdxCo //,AuthUpsUs,AuthUpsCo,
    // check('shippercity','Se Requiere la ciudad que remite de caracter obligatorio').not().isEmpty(),
    // check('shipperstateorprovincecode','Se Requiere codigo de ciudad de caracter obligatorio').not().isEmpty(),
    // check('shipperpostalcode','Se Requiere codigo postal de caracter obligatorio').not().isEmpty(),
    // check('shippercountrycode','Se Requiere el codigo del pais de caracter obligatorio').not().isEmpty(),
    // check('recipientcity','Se Requiere la ciudad de destino de caracter obligatorio').not().isEmpty(),
    // check('recipientstateorprovincecode','Se Requiere codigo de ciudad de caracter obligatorio').not().isEmpty(),
    // check('recipientpostalcode','Se Requiere el codigo postal de caracter obligatorio').not().isEmpty(),
    // check('recipientcountrycode','Se Requiere el codigo del pais de caracter obligatorio').not().isEmpty(),
], shipment);


module.exports = router;