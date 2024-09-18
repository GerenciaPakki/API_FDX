/*
    path: '/qts' Control de quotation
*/

const {
    Router
} = require('express');
const {
    check
} = require('express-validator');
const { quota } = require('../controllers/quotation');
const {
    validateJWT,
    packagingType,
} = require('../middleware/globalValidations');
const { AuthFdxCo } = require('../middleware/globalPartner');



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
], quota);


module.exports = router;