const { trusted } = require("mongoose");
const { getMaxTRM } = require("../middleware/globalExternals");
const companyDiscount = require("../models/companyDiscount");


let ServiceT = '';


// Esta funcion Alimenta Quotation y Shipment dCDR.
async function SurchargePakkiFDX(ServiceType,ProvicerDiscount,exchangeRate,shippingValue,Domestic,Weight) { 

    const Provider = 'FDX';
    if (Domestic) {
        ServiceT = 'DOC';        
    } else {
        ServiceT = 'PKG';
    }    
    const CompanyDiscountDB = await companyDiscount.findOne(
        {
            Provider: Provider,
            ServiceName: ServiceType,
            ServiceType: ServiceT,
            "Data.Weight": Weight.toString()
        },
        { "Data.$": 1, _id: 0 } 
    ); 

    const surchargeFDX = CompanyDiscountDB.Data[0].RateIncrease;
    const PakkiIncrease = CompanyDiscountDB.Data[0].PakkiIncrease;
    const PakkiDiscount = CompanyDiscountDB.Data[0].PakkiDiscount;
    const shipValue = parseInt(shippingValue.Amount[0]);

    // const FinalUserAmount = Math.round(shipValue * surchargeFDX)
    const FinalUserAmount = Math.ceil(shipValue * surchargeFDX / 1000) * 1000;
    const PublicAmount = Math.round( shipValue * PakkiIncrease / PakkiDiscount + shipValue );

    return SurchargePakki = {
        Provider: Provider,
        ServiceType: ServiceType,
        exchangeRate: surchargeFDX,
        ProviderDiscount: ProvicerDiscount,
        shipValueNeto: shipValue.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }),
        shippingValue: FinalUserAmount.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }),
        PublicAmount: PublicAmount.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })
    };
}

async function SurchargePakkiDHL(ServiceType,shippingValue,Domestic,Weight) { 

    
    const Provider = 'DHL';
    if (Domestic) {
        ServiceT = 'DOC';        
    } else {
        ServiceT = 'PKG';
    }
    
    const CompanyDiscountDB = await companyDiscount.findOne(
        {
            Provider: Provider,
            ServiceName: ServiceType,
            ServiceType: ServiceT,
            "Data.Weight": Weight.toString()
        },
        { "Data.$": 1, _id: 0 } 
    );

    const trmHistory = await getMaxTRM();
    const Trm15Dias = trmHistory.value;

    // console.log(shippingValue);

    const surchargeDHL = CompanyDiscountDB.Data[0].RateIncrease;
    const PakkiIncrease = CompanyDiscountDB.Data[0].PakkiIncrease;
    const PakkiDiscount = CompanyDiscountDB.Data[0].PakkiDiscount;
    const shipValue = parseInt(shippingValue);

    const shipValueXTRM = (shipValue * Trm15Dias);

    // const FinalUserAmount = Math.round(shipValueXTRM * surchargeFDX)
    const FinalUserAmount = Math.ceil(shipValueXTRM * surchargeDHL / 1000) * 1000;
    const PublicAmount = Math.round( shipValueXTRM * PakkiIncrease / PakkiDiscount + shipValueXTRM );

    // const dato = {
    //     Provider: Provider,
    //     ServiceType: ServiceType,
    //     ProvicerDiscount: 0,
    //     exchangeRate: Trm15Dias,
    //     shippingValue: FinalUserAmount,
    //     PublicAmount: PublicAmount
    // };

    // console.log(dato);
    return SurchargePakki = {
        Provider: Provider,
        ServiceType: ServiceType,
        ProvicerDiscount: 0,
        exchangeRate: Trm15Dias.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }),
        shipValueNeto: shipValue.toLocaleString('en-US', { style: 'currency', currency: 'UDS' }),
        valueNetoTrm: shipValueXTRM.toFixed(2),
        shippingValue: FinalUserAmount.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }),
        PublicAmount: PublicAmount.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })
    };
}

async function SurchargePakkiShipmentDHL(ServiceType,shippingValue,Domestic,Weight) { 

    const Provider = 'DHL';
    if (Domestic) {
        ServiceT = 'DOC';        
    } else {
        ServiceT = 'PKG';
    }
    const CompanyDiscountDB = await companyDiscount.findOne(
        {
            Provider: Provider,
            ServiceName: ServiceType,
            ServiceType: ServiceT,
            "Data.Weight": Weight.toString()
        },
        { "Data.$": 1, _id: 0 } 
    );
    
    const trmHistory = await getMaxTRM();
    const Trm15Dias = trmHistory.value;    

    const surchargeDHL = CompanyDiscountDB.Data.RateIncrease;
    const PakkiIncrease = CompanyDiscountDB.Data.PakkiIncrease;
    const PakkiDiscount = CompanyDiscountDB.Data.PakkiDiscount;
    const shipValue = parseFloat(shippingValue).toFixed(2);

    const shipValueXTRM = (shipValue * Trm15Dias);

    // const FinalUserAmount = Math.round(shipValueXTRM * surchargeDHL)
    const FinalUserAmount = Math.ceil(shipValueXTRM * surchargeDHL / 1000) * 1000;
    const PublicAmount = Math.round( shipValueXTRM * PakkiIncrease / PakkiDiscount + shipValueXTRM );

    // TODO: VALIDAR SI EL UN TIPO DE ALIADO PARA 


    return SurchargePakki = {
        Provider: Provider,
        ServiceType: ServiceType,
        ProvicerDiscount: 0,
        exchangeRate: Trm15Dias.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }),
        shipValueNeto: shipValue.toLocaleString('en-US', { style: 'currency', currency: 'UDS' }),
        valueNetoTrm: shipValueXTRM.toFixed(2),
        shippingValue: FinalUserAmount.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }),
        PublicAmount: PublicAmount.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })
    };
}

async function SurchargePakkiQuotationUPS(ServiceType, shippingValue,ProvicerDiscount,Domestic,Weight) { 
    
    // console.log(Domestic)
    const Provider = 'UPS';
    
    if (Domestic) {
        ServiceT = 'DOC';        
    } else {
        ServiceT = 'PKG';
    }

    const CompanyDiscountDB = await companyDiscount.findOne(
        {
            Provider: Provider,
            ServiceCode: parseInt(ServiceType),
            ServiceType: ServiceT,
            "Data.Weight": Weight.toString()
        },
        { "Data.$": 1, _id: 0 } // Esto proyecta solo el elemento correspondiente de Data
    )
    

    // Consultamos a la Coleccion TRM y traemos el valor mas alto de los ultimos 15 dias
    const trmHistory = await getMaxTRM();
    const Trm15Dias = trmHistory.value;
    

    const surchargeUPS = CompanyDiscountDB.Data[0].RateIncrease;
    const PakkiIncrease = CompanyDiscountDB.Data[0].PakkiIncrease;
    const PakkiDiscount = CompanyDiscountDB.Data[0].PakkiDiscount;
    const shipValue = shippingValue.MonetaryValue[0];
    // console.log(shippingValue.MonetaryValue[0]);

    const shipValueXTRM = (shipValue * Trm15Dias);

    const FinalUserAmount = Math.ceil(shipValueXTRM * surchargeUPS / 1000) * 1000;
    const PublicAmount = Math.round( shipValueXTRM * PakkiIncrease / PakkiDiscount + shipValueXTRM );

    return SurchargePakki = {
        Provider: Provider,
        ServiceType: ServiceType,
        ProvicerDiscount: 0,
        exchangeRate: Trm15Dias.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }),
        shipValueNeto: shipValue.toLocaleString('en-US', { style: 'currency', currency: 'UDS' }),
        valueNetoTrm: shipValueXTRM.toFixed(2),
        shippingValue: FinalUserAmount.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }),
        PublicAmount: PublicAmount.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })
    };
}
async function SurchargePakkiUPS(ServiceType, shippingValue,ProvicerDiscount,Domestic,Weight) { 
    
    // console.log(Domestic)
    const Provider = 'UPS';
    if (Domestic) {
        ServiceT = 'DOC';        
    } else {
        ServiceT = 'PKG';
    }

    
    const CompanyDiscountDB = await companyDiscount.find(
        {
            Provider: Provider, ServiceName: ServiceType,
            ServiceType: ServiceT, "Data.Weight": Weight
        }, { Data: 1, _id: 0 }
    ).where("Domestic").equals(false);

    

    // Consultamos a la Coleccion TRM y traemos el valor mas alto de los ultimos 15 dias
    const trmHistory = await getMaxTRM();
    const Trm15Dias = trmHistory.value;
    

    const surchargeUPS = CompanyDiscountDB[0].Data[0].RateIncrease;
    const PakkiIncrease = CompanyDiscountDB[0].Data[0].PakkiIncrease;
    const PakkiDiscount = CompanyDiscountDB[0].Data[0].PakkiDiscount;
    const shipValue = shippingValue.MonetaryValue[0];
    // console.log(shippingValue.MonetaryValue[0]);

    const shipValueXTRM = (shipValue * Trm15Dias);

    // const FinalUserAmount = Math.round(shipValueXTRM * surchargeUPS);
    const FinalUserAmount = Math.ceil(shipValueXTRM * surchargeUPS / 1000) * 1000;
    const PublicAmount = Math.round( shipValueXTRM * PakkiIncrease / PakkiDiscount + shipValueXTRM );

    return SurchargePakki = {
        Provider: Provider,
        ServiceType: ServiceType,
        ProvicerDiscount: 0,
        exchangeRate: Trm15Dias.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }),
        shipValueNeto: shipValue.toLocaleString('en-US', { style: 'currency', currency: 'UDS' }),
        valueNetoTrm: shipValueXTRM.toFixed(2),
        shippingValue: FinalUserAmount.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }),
        PublicAmount: PublicAmount.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })
    };
}

async function SurchargePakkiShipmentUPS(ServiceType, shippingValue, ProvicerDiscount, Domestic,Weight) { 

    const Provider = 'UPS';

    if (Domestic) {
        ServiceT = 'DOC';        
    } else {
        ServiceT = 'PKG';
    }

    const CompanyDiscountDB = await companyDiscount.findOne(
    {
        Provider: Provider,
        ServiceName: ServiceType,
        ServiceType: ServiceT,
        "Data.Weight": Weight.toString()
    },
    { Data: { $elemMatch: { Weight: Weight.toString() } }, _id: 0 }
    ).where("Domestic").equals(false)
    
    // Consultamos a la Coleccion TRM y traemos el valor mas alto de los ultimos 15 dias
    const trmHistory = await getMaxTRM();
    const Trm15Dias = trmHistory.value;

    const surchargeUPS = CompanyDiscountDB.Data[0].RateIncrease;
    const PakkiIncrease = CompanyDiscountDB.Data[0].PakkiIncrease;
    const PakkiDiscount = CompanyDiscountDB.Data[0].PakkiDiscount;
    const shipValue = shippingValue;
    // console.log(shippingValue.MonetaryValue[0]);

    const shipValueXTRM = (shipValue * Trm15Dias);

    // const FinalUserAmount = Math.round(shipValueXTRM * surchargeUPS);
    const FinalUserAmount = Math.ceil(shipValueXTRM * surchargeUPS / 1000) * 1000;
    const PublicAmount = Math.round( shipValueXTRM * PakkiIncrease / PakkiDiscount + shipValueXTRM );
        
    return SurchargePakki = {
        Provider: Provider,
        ServiceType: 'UPS Express Saver',
        MonetaryValue: surchargeUPS,
        ProvicerDiscount: 0,
        exchangeRate: Trm15Dias,
        shipValueNeto: shipValue.toLocaleString('en-US', { style: 'currency', currency: 'UDS' }),
        valueNetoTrm: shipValueXTRM.toFixed(2),
        shippingValue: FinalUserAmount.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }),
        PublicAmount:  PublicAmount.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })
    };
}

async function SurchargePakkiDomesticFDX(ServiceType,ProvicerDiscount,exchangeRate,shippingValue,Domestic,Weight) { 
    
    const Provider = 'FDX';
    
    if (Domestic) {
        ServiceT = 'DOC';        
    } else {
        ServiceT = 'PKG';
    }

    const CompanyDiscountDB = await companyDiscount.find(
        {
            Provider: Provider, ServiceName: ServiceType,
            ServiceType: ServiceT, "Data.Weight": Weight
        }, { Data: 1, _id: 0 }
    ).where("Domestic").equals(true);
    
    
    const surchargeFDX = CompanyDiscountDB[0].Data[0].RateIncrease;
    const PakkiIncrease = CompanyDiscountDB[0].Data[0].PakkiIncrease;
    const PakkiDiscount = CompanyDiscountDB[0].Data[0].PakkiDiscount;
    const shipValue = parseInt(shippingValue.Amount[0]);

    // const FinalUserAmount = Math.round(shipValue * surchargeFDX)
    const FinalUserAmount = Math.ceil(shipValue * surchargeFDX / 1000) * 1000;
    const PublicAmount = Math.round( shipValue * PakkiIncrease / PakkiDiscount + shipValue );

    return SurchargePakki = {
        Provider: Provider,
        ServiceType: ServiceType,
        ProviderDiscount: ProvicerDiscount.Amount[0],
        exchangeRate: 0,
        shipValueNeto: shipValue,
        shippingValue: FinalUserAmount.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }),
        PublicAmount: PublicAmount.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })
    };
}

async function SurchargePakkiDomesticCDR(shippingValue,Weight) { 

    const Provider = 'CDR';
    
    const CompanyDiscountDB = await companyDiscount.find(
        {
            Provider: Provider,"Data.Weight": Weight.toString()
        }, { Data: 1, _id: 0 }
    ).where("Domestic").equals(true);

    const surchargeCDR = CompanyDiscountDB[0].Data[0].RateIncrease;
    const PakkiIncrease = CompanyDiscountDB[0].Data[0].PakkiIncrease;
    const PakkiDiscount = CompanyDiscountDB[0].Data[0].PakkiDiscount;
    const shipValue = parseInt(shippingValue);

    // const FinalUserAmount = Math.round(shipValue * surchargeCDR)
    const FinalUserAmount = Math.ceil(shipValue + (shipValue * surchargeCDR));
    const PublicAmount = Math.round(FinalUserAmount + (FinalUserAmount * 0.1));

    return SurchargePakki = {
        Provider: Provider,
        ServiceType: "NACIONAL",
        ProviderDiscount: 0,
        exchangeRate: 0,
        shipValueNeto: shipValue.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP'
        }),
        shippingValue: FinalUserAmount.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }),
        PublicAmount: PublicAmount.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })
    };
}




module.exports = {
    SurchargePakkiFDX,
    SurchargePakkiDomesticFDX,
    SurchargePakkiDHL,
    SurchargePakkiShipmentDHL,
    SurchargePakkiUPS,
    SurchargePakkiQuotationUPS,
    SurchargePakkiShipmentUPS,
    SurchargePakkiDomesticCDR,
};