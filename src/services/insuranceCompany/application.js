const { v4: uuidv4 } = require('uuid');
import { BlobServiceClient, logger } from "@azure/storage-blob";
import jsRender from 'jsrender';
import moment from 'moment';
import pdfToBase64 from 'pdf-to-base64';
import puppeteer from 'puppeteer';
import request from 'request';
import axios from 'axios';
import { API_LOG_MESSAGES, PARENT_LOG_TYPE, CHILD_LOG_TYPE, DEFAULT_ENUM, INSURANCE_TYPE_ID, PREMIUM_CALCULATION_TYPE, PRODUCT_ID, QUOTE_STATUS } from '../../../config/constants';
import { convertToBrazilCurrency, get2Decimal, getUUID, saveApilogs, updateApilogs, uploadFileToServer } from "../../helpers/commonFunction";

const PDFDocument = require('pdf-lib').PDFDocument;
const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING
);
const containerClient = blobServiceClient.getContainerClient(
    process.env.AZURE_STORAGE_CONTAINER_NAME
);

// import { getDB } from '../../src/helpers/db';
import DB from '../../helpers/db';
// const dbInstance = new DB();

const db = new DB();



/* api for add policy to insurance company for flow 1*/
export const addApplicationToInsuranceCompany = async (detail, token, models) => {
    let addApiLogResponse;
    const body = await getApplicationPayload(detail);
    //console.log('body111', body);
    try {
        const options = {
            method: 'POST',
            //url: 'https://busservicioscert.segurosdelpichincha.com:5370/rest/jwt/emite',
            url: `${process.env.INSURANCE_COMPANY_BASE_URL}emite`,
            data: body,
            headers: {
                authorization: token,
                'Content-Type': 'application/json', // Set content type
                'Cookie': 'cookiesession1=678A8C43D76AD9103A796BED912A7E68'
            },
        };
        /* generate uuid for api logs */
        const apilog_uuid = await getUUID();
        /* create api log payload  */
        const addApilogPayload = {
            request_id: detail.proposal_no,
            type: PARENT_LOG_TYPE.APPLICATION,
            log_type: `${CHILD_LOG_TYPE.ADD_APPLICATION_TO_INSURANCE_COMPANY}-${detail.application_no}`,
            ip_address: detail.ip_address,
            uuid: apilog_uuid,
            request_payload: JSON.stringify(options),
        };
        addApiLogResponse = await saveApilogs(addApilogPayload, models);
        const response = await axios.request(options);
        const updateApiLogPayload = {
            query: { id: addApiLogResponse.id },
            payload: { response: JSON.stringify(response.data), message: API_LOG_MESSAGES.SUCCESS }
        };
        await updateApilogs(updateApiLogPayload, models.ApiLogs);
        return response.data;
    } catch (error) {
        const updateApiLogPayload = {
            query: { id: addApiLogResponse.id },
            payload: { response: JSON.stringify(error), message: API_LOG_MESSAGES.FAILED }
        };
        await updateApilogs(updateApiLogPayload, models.ApiLogs);
        console.error('Error in addApplicationToInsuranceCompany:', error);
        return error;
    }
}

const getApplicationPayload = async (detail) => {
    try {
        const payload = {
            "astr_id_proveedor": detail.application_no,
            "cotizacion": {
                "coberturas": [
                    {
                        "aint_grupo": 999,
                        "astr_codigo_cob": "00000",
                        "astr_cob_bd_inc_sa": "S",
                        "adbl_vm_sa": detail.shipment_limit, // application Limit
                        "astr_obtener_prima": null,
                        "adbl_vm_pri": detail.gross_written_premium, //* gross written premium for the application
                        "adbl_qt_tasa": detail.insurance_rate,
                        "astr_cob_descrip_print": null,
                        "astr_descripcion": null,
                        "astr_seleccion": null,
                        "astr_bloqueado": null,
                        "adbl_vm_prima_riesgo": 0,
                        "adbl_qt_tasa_riesgo": 0
                    }
                ],
                "adbl_vm_prima_neta_anual": detail.gross_written_premium, /* gross written premium from the application */
                "adbl_vm_prima_total_anual": detail.total_premium, /* total premium after calculating taxes */
                "adbl_vm_sa": detail.shipment_limit, // Application Limit
                "adbl_vm_de": detail.tax_emission,
                "adbl_vm_sc": detail.tax_ssc,
                "adbl_vm_scvs": detail.tax_scvs,
                "adbl_vm_iva": detail.tax_iva,
                "adbl_valor_ahorro": 0,
                "adbl_valor_cargo_admin": 0,
                "astr_frec_pago": "A",
                "astr_codigo_producto": "00009",                        //"00001" passed this value as static
                "astr_tipo_producto": "A", // "A" for applications
                "astr_ramo": "06",
                "astr_id_plan": "00009",
                "astr_desc_plan": null,
                "adt_fecha_ini_vig": detail.start_date, // application start date 
                "adt_fecha_fin_vig": detail.end_date, // application end date 
                "adbl_vm_prima_anual": 0,
                "astr_tipo_facturacion": "A", // "A" for all aplications
                "astr_tipo_transportacion": detail.product_name, // “IMP” for Import or “EXP” for Export
                "astr_poliza_abierta": detail.policy_id // policy number 
            },
            "cliente": {
                "astr_tipo_persona": "J",
                "astr_tipo_identificacion": "02",
                "astr_identificacion": detail.company_ruc,
                "astr_nombre1": detail.company_name,
                "astr_nombre2": "",
                "astr_apellido1": "",
                "astr_apellido2": "",
                "astr_genero": "2",
                "astr_estado_civil": null,
                "adt_fecha_nacimiento": null,
                "astr_estado_migratorio": null,
                "adt_fecha_exp_pasaporte": null,
                "adt_fecha_ing_pais": null,
                "adt_fecha_cad_pasaporte": null,
                "astr_dec_salud_tit": null,
                "astr_dec_salud_ben": null,
                "astr_per_politicamente_expuesta": "NO",
                "astr_pais_residencia_fiscal": null,
                "astr_cliente_fumador": null,
                "astr_razon_social": detail.company_name,
                "contacto": {
                    "astr_pais_ori": " 327",
                    "astr_nacionalidad": "ECU",
                    "astr_nom_familiar": null,
                    "astr_tel_familiar": null,
                    "astr_email": detail.company_email,
                    "astr_envio_corrrespondencia": "D",
                    "astr_prov_dom": null,
                    "astr_ciudad_dom": null,
                    "astr_calle_prin_dom": detail.company_address,
                    "astr_num_dom": detail.company_address_no,
                    "astr_tras_dom": null,
                    "astr_ref_dom": detail.city,
                    "astr_casa_depart_dom": null,
                    "astr_piso_dom": null,
                    "astr_barrio_dom": null,
                    "astr_tel_dom": detail.company_phone,
                    "astr_celular": "0968184002",
                    "astr_hora_desde_dom": "0000",
                    "astr_hora_hasta_dom": "0000",
                    "astr_prov_trab": null,
                    "astr_ciudad_trab": null,
                    "astr_calle_prin_trab": null,
                    "astr_num_trab": null,
                    "astr_tras_trab": null,
                    "astr_barrio_trab": null,
                    "astr_ref_trab": null,
                    "astr_local_trab": null,
                    "astr_piso_trab": null,
                    "astr_tel_trab": null,
                    "astr_ext_trab": "",
                    "astr_nom_empresa": null,
                    "astr_hora_desde_trab": "0000",
                    "astr_hora_hasta_trab": "0000"
                }
            },
            "financiero": {
                "astr_tit_cuenta": "S",
                "astr_tipo_id_tit": "",
                "astr_id_tit": "",
                "astr_nomb_tit": "",
                "astr_paren_tit": "",
                "astr_ran_ingreso": detail.income_range_astrId,       //"2" we passed this value as static,
                "adbl_med_ingreso": detail.income_range_value,       //1000 we passed this value as static
                "astr_ran_patrimonio": detail.heritage_rank_astrId,    //"9" we passed this value as static
                "adbl_med_patrimonio": detail.heritage_rank_value,     //10000 we passed this value as static
                "astr_ocupacion": detail.occupation_astrId,              // "800045" we passed this value as static
                "astr_act_economica": detail.economic_activity_astrId     //"002001004" we passed this value as static
            },
            "formaPago": {
                "astr_tip_forma_pago": "15",
                "astr_banco": null,
                "astr_numero_cuenta": null,
                "astr_tipo_tarjeta": "",
                "astr_pais_emisor": null,
                "aint_ano_caducidad": null,
                "aint_mes_caducidad": null,
                "astr_cvv": null,
                "astr_tip_cuenta_reembolso": null,
                "astr_banco_reembolso": null,
                "astr_num_reembolso": null
            },
            "factura": {
                "astr_tipo_ident_fact": "01", // sttatic
                "astr_ident_fact": detail.company_ruc,
                "astr_nombre_fact": detail.company_name,
                "astr_email_fact": detail.company_email,
                "astr_tel_fact": detail.company_phone,
                "astr_dir_fact": detail.company_address
            },
            "ubicaInmueble": {
                "astr_prov": "", // null
                "astr_ciudad": "", // null
                "astr_calle_prin": "",
                "astr_tras": "",
                "astr_numeracion": "",
                "astr_ref": "",
                "astr_barrio": "",
                "astr_tel": null,
                "astr_piso": null,
                "astr_detalle": detail.astr_detalle   //"NUEVO/100125/FACTURA/FRANCISCO LOPEZ/1716217581001 => good name / shipment document namber / document name / quote number"
            },
            "aplicacion": {
                "astr_medio": "04",
                "astr_tipo_fecha": "E",
                "adt_fecha_embarque": detail.start_date, // application start sate
                "astr_incoterm": "F",
                "astr_embalaje": "01",
                "astr_pais_desde": detail.source, // Application origen
                "astr_region_desde": "",
                "astr_provincia_desde": "",
                "astr_ciudad_desde": "",
                "astr_comentario_desde": "",
                "astr_puerto_desde": "S",
                "astr_pais_hasta": detail.destiny, // Application destination
                "astr_region_hasta": "",
                "astr_provincia_hasta": "",
                "astr_ciudad_hasta": "",
                "astr_comentario_hasta": "",
                "astr_puerto_hasta": "N",
                "astr_consignatario": null,
                "astr_embarcador": null,
                "astr_comisario": "",
                "sobreseguro": null,
                "astr_moneda_org": "USD",
                "astr_item": "01",
                "rubro": [
                    {
                        "aint_no_item": 1, //// static
                        "astr_descripcion": null, // static
                        "astr_marca": null, // static
                        "astr_nos": null, // static
                        "aflo_peso": null, // static
                        "astr_med_peso": null, // static
                        "aflo_cantidad": 1, // static
                        "astr_med_cantidad": null, // static
                        "adbl_valor_sa_orig": 0, // st tic
                        "adbl_valor_flete_orig": 0, // static
                        "adbl_valor_seguro_orig": 0, // static
                        "adbl_subtotal_orig": 0, // st tic
                        "adbl_sobreseguro_orig": 0, // static
                        "adbl_total_orig": 0, // static
                        "adbl_valor_sa_cot": detail.shipment_limit, // Application Limit
                        "adbl_valor_flete_cot": 0, // static
                        "adbl_valor_seguro_cot": 0, // static
                        "adbl_subtotal_cot": detail.shipment_limit, // Application Limit
                        "adbl_sobreseguro_cot": 0, // static
                        "adbl_total_cot": detail.shipment_limit, // Application Limit
                    }
                ]
            },
            "beneficiario": [],
            "colapago": [],
            "usuario": {
                "astr_tipo_usuario": "B",
                "astr_userId": null,
                "astr_agencia": detail.agency_astrId,          //"00001" passed statically,
                "astr_subage_id": "1",
                "astr_punto_id": null,
                "astr_tipo_identificacion": "02",
                "astr_identificacion": "1791268458001",
                "astr_nombre_usuario": "elow",
                "astr_apellido_usuario": "musk",
                "astr_correo_usuario": "user@aon.com"
            },
            "datos_adicionales": []
        }
        return payload;
    } catch (error) {
        console.log(error);
    }
}



