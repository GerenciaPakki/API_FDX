const { response } = require("express");
mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const { validationResult, Result } = require('express-validator');
const { JWT_SECRET } = require("../utils/config");
 
const { CompararFecha, sameDate, afterTwoInTheAfternoon, weekendDay, holiDay, itIsEaster } = require("../helpers/pakkiDateTime");
const weekend = require("../models/weekend");
const Holidays = require("../models/Holidays");

const { applogger } = require("../utils/logger");

const validateJWT = (req, res = response, next) => {
    
    const token = req.header('x-token');
    try {
        if (!token) {
            return res.status(418).json({
                ok: false,
                msg: 'No hay Token en la Peticion'
            });
        }
    
        // const { uid, bus } = jwt.verify(token, process.env.JWT_SECRET);
        const { uid, bus } = jwt.verify(token, JWT_SECRET);
        // pasamos el UID a la Request para que desde alli podamos validar el usuario.
        req.uid = uid;
        req.bus = bus;
        next();
    } catch (error) {
        // ERROR AL GENERAR EL CODIGO DE VALIDACION DE EMAIL AL REGISTRARSE
        applogger.error(`Error en MDGV > viewOneBus: Error al Validar el Token al usuario token: ${token} error: ${error}`);
        return res.status(401).json({
            ok: false,
            msg: 'MWGV-1.1: Error con El Registro TK: ' + error
        });
    }
};

const acceptTerms = (req, res = response, next) => {

    const terminosUsu = req.body.terms;
    // DEBE ACEPTAR LOS TERMINOS Y CONDICIONES DEL APLICATIVO
    if (terminosUsu === 'Acepto') {
        next();
    } else {
        return res.status(400).json({
            ok: false,
            msg: 'MWGV-2'
        });
    }
};

const isEmail = (req, res = response, next) => {

    const email = req.body.email;
    const emailValido = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{3,63}\.){1,125}[A-Z]{2,63}$/i;

    // EL EMAIL NO TIENE LA FORMA REQUERIDA
    if (emailValido.test(email)) {
        next();
    } else {
        return res.status(400).json({
            ok: false,
            msg: 'MWGV-3'
        });
    }
};
const validateFields = (req, res = response, next) => {

    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errores.mapped()
        });
    }
    next();
};


const validateFileName = (req, res, next) => {
    const archivo = req.file;
    if (!archivo) {
        return res.status(400).json({ message: 'Archivo no encontrado' });
    }
    next();
};

// VALIDA QUE LA FECHA DE RECOLECCION NO SEA SUPERIOR A 4 DIAS 
const validateDatePickup = async (req, res = response, next) => { 
    
    const datePickup1 = req.body.Pickup.DateTime;
    const datePickup2 = req.body.Pickup.DateTime1;

    const date1 = CompararFecha(datePickup1);
    const date2 = CompararFecha(datePickup2);

    // Valida que ambas fechas no superen el límite superior
    if ( date1 === true && date2 === true ) {
        next();
    } else {
        return res.status(418).json({
            ok: false,
            cod: 'MWGV-10',
            msg: 'La Fecha de Recoleccion Supera 4 Días'
        });
    }
};
// VALIDA QUE LA FECHA DE RECOLECCION NO SEA SUPERIOR A 4 DIAS 
const validateDatePickupQuotation = async (req, res = response, next) => { 
    const datePickup1 = req.body.Shipments.DateTime;
    const datePickup2 = req.body.Shipments.DateTimeDHL;

    const date1 = CompararFecha(datePickup1);
    const date2 = CompararFecha(datePickup2);

    // Valida que ambas fechas no superen el límite superior
    if ( date1 === true && date2 === true ) {
        next();
    } else {
        return res.status(418).json({
            ok: false,
            cod: 'MWGV-10',
            msg: 'La Fecha de Recoleccion Supera 4 Días'
        });
    }
};

// VALIDA QUE LA FECHA DE RECOLECCION NO SEA FIN DE SEMANA 
const validateDateWeekend = async (req, res = response, next) => { 
    const datePickup1 = req.body.Pickup.DateTime;
    const datePickup2 = req.body.Pickup.DateTime1;

    const date1 = sameDate(datePickup1);
    const date2 = sameDate(datePickup2);

    const hd1 = await isWeekend(date1);
    const hd2 = await isWeekend(date2);

    // Valida que ambas fechas no superen el límite superior
    if (hd1 || hd2) {
        return res.status(418).json({
            ok: false,
            cod: 'MWGV-11',
            msg: 'La fecha de Recoleccion No puede ser en Fin de Semana'
        });
    } else {
        next();        
    }
};

// VALIDA QUE LA FECHA DE RECOLECCION NO SEA FESTIVO 
const validateDateHolidays = async (req, res = response, next) => { 
    const datePickup1 = req.body.Pickup.DateTime;
    const datePickup2 = req.body.Pickup.DateTime1;

    const date1 = sameDate(datePickup1);
    const date2 = sameDate(datePickup2);

    const wk1 = await isHoliday(date1);
    const wk2 = await isHoliday(date2);
    // Valida que ambas fechas no superen el límite superior
    if (wk1 || wk2) {
        return res.status(418).json({
            ok: false,
            cod: 'MWGV-12',
            msg: 'La fecha de Recoleccion No puede ser un día Festivo'
        });
    } else {
        next();        
    }
};

// VAlida que el tipo de envio Documento NO supere 0.5 Kg
const packagingType = async (req, res = response, next) => { 
    const documentShipment = req.body.Shipments.documentShipment
    const Weight = req.body.Shipments.Shipment.Weight

    if (documentShipment === true && Weight > 2 ) {
        return res.status(418).json({
            ok: false,
            cod: 'MWGV-13',
            msg: 'El Peso Supera para el Tipo Documento'
        });
    }    
    next();
};
// Calida que el dia de creacion No sea Fin de Semana y de ser asi lo pasa al siguiente dia habil
const validateDay = async (req, res = response, next) => { 
    const date = req.body.Shipments.DateTime
    const fechaHora = DateTime.fromISO(date);

    // Verificar si la hora es mayor a las 14:00
    if (fechaHora.hour >= 14) {

        // Si es mas de las 14:00 pasa al siguiente dia
        const dateHour = await afterTwoInTheAfternoon(date)
        // Si la fecha anterior es fin de semana la pasa al siguiente dia habil
        const dateWeekend = await weekendDay(dateHour)
        // Si la fecha anterior es Festivo lo pasa al siguiente dia habil
        const dateHoliDay = await holiDay(dateWeekend)
        // Valida que la fecha anterior No sea Semana Santa
        const dateIsEaster = await itIsEaster(dateHoliDay)

        req.dat.Shipments.DateTime = dateIsEaster.toFormat('yyyy-MM-dd\'T\'HH:mm:ss')
        req.dat.Shipments.DateTimeDHL = dateIsEaster.toFormat('yyyy-MM-dd')
      
       next();
    } else {
        // Si la fecha anterior es fin de semana la pasa al siguiente dia habil
        const dateWeekend = await weekendDay(dateHour)
        // Si la fecha anterior es Festivo lo pasa al siguiente dia habil
        const dateHoliDay = await holiDay(dateWeekend)
        // Valida que la fecha anterior No sea Semana Santa
        const dateIsEaster = await itIsEaster(dateHoliDay)
      
       next();
    }
};

// Función que valida si una fecha está en la colección de feriados
async function isHoliday(date) {    
    const hd = await Holidays.find({ Date: date });
  return hd === '';
}
async function isWeekend(date) { 
    // console.log(date);
    const wk = await weekend.find({ Date: date });
    return wk === '';
}

const ShowTokenInComponents = async (token) => {
    // LEER EL TOKEN
    const decodedToken = jwt.verify(token, JWT_SECRET);
    try {
        return {
            ok: true,
            msg: decodedToken,
        };
    } catch (error) {
        applogger.error(`Error en VALUSTKNDAO > ShowTokenInComponentsDAO: UserId: ${decodedToken.uid} error: ${error}`);
        return {
            ok: false,
            msg: 'CREUSD4O-07: ' + error.code
        }
    }
}

module.exports = {
    validateJWT,
    acceptTerms,
    isEmail,
    validateFields,
    validateFileName,
    validateDatePickup,
    validateDateWeekend,
    validateDateHolidays,
    packagingType,
    validateDatePickupQuotation,
    ShowTokenInComponents,
};

