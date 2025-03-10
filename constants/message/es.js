/* spanish */
exports.es = {

    /* common messages */
    commonMessages: {
        ERROR: "Se ha producido un error. Intenta más tarde.",
        UNAUTHORIZED_USER: "Usuario no autorizado.",
        EMAIL_EXIST: "El Email ya existe.",
        INVALID_USER: "Usuario invalido.",
        DATA_NOT_FOUND: "Datos no encontrados.",
        DATA_LOADED_SUCCESS: "Datos cargados exitosamente.",
        INVALID_ZIPCODE: "Informe CEP válido.",
        DATA_UPLOADED_SUCCESS: "Datos cargados exitosamente.",
        COMPANY_IS_INACTIVE: "La empresa está inactiva.",
        START_DATE_IS_REQUIRED: "Se requiere fecha de inicio.",
        COMPANY_CREATION_FAILED: "La creación de la empresa fracasó.",
        COMPANY_CREATION_SUCCESS: "Éxito en la creación de empresas."
    },
    /* end */

    /* auth messages */
    auth: {
        EMAIL_ALREADY_EXIST: 'El Email ya existe.',
        USER_EMAIL_ALREADY_EXIST: 'El correo electrónico del usuario ya existe.',
        RUC_ALREADY_EXIST: 'El RUC ya existe.',
        RUC_ALREADY_EXIST: "El RUC ya existe.",
        USER_SIGNUP_SUCCESS: 'El registro de usuario se completó con éxito.',
        USER_CREDIT_SCORE: 'Puntaje de crédito del usuario.',
        EMAIL_REQUIRED: "El correo electrónico es obligatorio.",
        PASSWORD_REQUIRED: "Se requiere contraseña",
        INVALID_TOKEN: "Simbolo no valido.",
        USER_NOT_FOUND: "Usuario no encontrado.",
        WRONG_PASSWORD: "Contraseña incorrecta.",
        ACCOUNT_DEACTIVATED: "Su cuenta ha sido desactivada, por favor contacte a su administrador.",
        ACCOUNT_DELETED: "Su cuenta ha sido eliminada, comuníquese con su administrador.",
        ACCOUNT_PENDING: "Su cuenta no ha sido aprobada. Comuníquese con el administrador.",
        USER_LOGIN_SUCCESS: "El usuario inicia sesión exitosamente.",
        EMAIL_SENT_SUCCESS: "El correo electrónico ha sido enviado a tu correo electrónico.",
        PASSWORD_UPDATE_SUCCESS: "Tu contraseña se restableció exitosamente.",
        SEND_VALID_TOKEN: "Envíe un token válido para restablecer la contraseña.",
        USER_UPDATED_SUCCESS: "Usuario actualizado con éxito.",
        EMAIL_ALREADY_REGISTERED: "Este correo electrónico ya está registrado. Usa otro correo electrónico",
        USER_DEACTIVATED: "Desactivado exitosamente",
        USER_ACTIVATED: "Activada exitosamente",
        USER_ADDED: "Usuarios agregadas con éxito",
        USER_DELETED: "Usuario eliminado exitosamente.",
        RUC_ALREADY_REGISTERED: " RUC ya registrado.",
        USER_REJECTED: "Rechazado con éxito",
        USER_APPROVED: "Aprobado exitosamente",
        RUC_FOUND_SUCCESSFULLY: "RUC encontrada con éxito.",
        RUC_NOT_FOUND: "RUC no encontrado."
    },
    /* end */

    /* email messages*/
    email: {
        FORGOT_PASSWORD: "Has olvidado tu contraseña.",
        RESET_YOUR_PASSWORD: "Haga clic aquí para restablecer la contraseña.",
        SET_YOUR_PASSWORD: "Haga clic aquí para configurar su contraseña.",
        SET_NEW_PASSWORD: "Establecer nueva contraseña.",
        WELCOME: "Bienvenido.",
        LOGIN_DETAILS: "Tus datos de inicio de sesión",
        QUOTE_REJECTION: "Rechazo de cotización",
        QUOTE_APPROVAL: "Aprobación de cotización",
        QUOTE_APPROVAL_REQUEST: "Solicitud de aprobación de cotización."
    },
    /* end */

    /* validatons messages*/
    schemaValidator: {
        /* login */
        EMAIL_IS_REQUIRED: "Se requiere correo electrónico con formato válido.",
        PASSWORD_IS_REQUIRED: "se requiere contraseña.",
        USERNAME_IS_REQUIRED: "Se requiere nombre de usuario",
        /* end */
    },
    /* end */

    /* broker messages */
    broker: {
        INVALID_BROKER_ID: "ID de corredor no válido.",
        POLICY_NOT_POSSIBLE: "A Apólice não pode ser emitida.",
        BROKER_DELETED_SUCCESS: "Corredor eliminado exitosamente."
    },
    /* end */

    /* sub broker messages */
    subbroker: {
    },
    /* end */

    /* subadmin messages */
    subadmin: {
        SUBADMIN_DELETE: "Subadministrador eliminado exitosamente",
    },
    /* end */
    /* claims messages */
    claims: {
        CLAIMS_PARTNER_ADDED: "Socio de reclamos agregado exitosamente",
        USERNAME_ALREADY_EXIST: 'El nombre de usuario ya existe.',
        SECRET_KEY_UNMATCHED: "La clave secreta no coincide.",
        USERNAME_NOT_EXIST: 'El usuario no existe.',
        PROVIDE_SECRET_KEY: "Proporcione la clave secreta.",
        AUTHORIZATION_TOKEN_REQUIRED: "Se requiere token de autorización",
        AUTHORIZATION_TOKEN_INVALID: "El token de autorización no es válido.",
        CLAIMS_ADDED: "Reclamo agregado exitosamente",
        PROPOSALS_NOT_FOUND: "No se encontraron propuestas con número de póliza",
        CLAIM_ALREADY_EXIST: "El reclamo ya existe."
    },
    /* end */

    /* quote messages */
    quote: {
        QUOTE_ADDED_SUCCESS: "Cotización agregada exitosamente.",
        QUOTE_NOT_FOUND: "Cita no encontrada.",
        ADD_VALID_RUC: "Por favor agregue Ruc válido.",
        TAX_ID_NOT_REGISTERED: "Identificación fiscal no registrada en el servicio de ingresos.",
        USER_CREDIT_SCORE: "Puntaje de crédito del usuario.",
        CUSTOMER_DETAIL_ADDED_SUCCESS: "Los detalles del cliente se agregaron correctamente.",
        EMAIL_ALREADY_ASSOCIATED: "Correo electrónico ya asociado con otro usuario.",
        RUC_ALREADY_ASSOCIATED: "RUC ya asociado con otro usuario.",
        EMAIL_AND_RUC_ALREADY_ASSOCIATED: "Correo electrónico y RUC ya registrados.",
        QUOTE_TARGETED_TO_MODERATION: "Su cotización ha sido objeto de moderación y será revisada por un asegurador de riesgos. Recibirá respuesta a esta solicitud en un plazo máximo de 24 horas hábiles.",
        TRANSPORT_GOODS_ADDED_SUCCESS: "Transporte de mercancías agregado exitosamente.",
        TRANSPORT_GOOD_NOT_FOUND: "Bom transporte não encontrado.",
        RUC_ALREADY_EXIST: " RUC ya existe",
        SHIPMENT_DETAIL_ADDED_SUCCESS: "Detalles de envío agregados exitosamente.",
        DOCUMENT_TYPE_NOT_FOUND: "Tipo de documento no encontrado.",
        DOCUMENT_NOT_FOUND: "Documento no encontrado.",
        DOCUMENT_DELETED_SUCCESS: "Documento eliminado exitosamente.",
        COVERAGES_ADDED_SUCCESS: "Coberturas agregadas exitosamente.",
        TRANSPORT_GOOD_DETAIL_NOT_FOUND: "Transporte buen detalle no encontrado.",
        TRANSPORT_GOOD_DETAIL_DELETED_SUCCESS: "El buen detalle del transporte se eliminó correctamente.",
        CALCULATION_LOADED_SUCCESS: "Cálculo cargado exitosamente.",
        CALCULATION_ADDED_SUCCESS: "El cálculo se agregó correctamente.",
        ABOVE_UNDERWRITER_AUTONOMY: "Por encima de la autonomía del corredor/suscriptor.",
        QUOTE_ALREADY_DECLINED: "Cotización ya rechazada.",
        QUOTE_ALREADY_EMITIDO: "Cotización ya presentada a otro broker o riesgo actual.",
        QUOTE_NOT_ACTIVE: "La cotización no está activa.",
        QUOTE_RISKS_ADDED_SUCCESS: "Riesgos de cotización agregados con éxito.",
        QUOTE_CLAIMS_ADDED_SUCCESS: "Las reclamaciones de cotización se agregaron correctamente.",
        INVALID_DATA_FORMAT: "Formato de dados/retorno inválido.",
        SELECT_VALID_CURRENCY: "Seleccione moneda válida.",
        QUOTE_MESSAGE_ADDED_SUCCESS: "Mensaje de cotización agregado exitosamente.",
        QUOTE_DETAILS_SENT_SUCCESSFULLY: "Los detalles de la cotización se enviaron correctamente.",
        QUOTE_APPROVED_SUCCESSFULLY: "Presupuesto aprobado exitosamente.",
        QUOTE_HAS_BEEN_REJECTED: "cita rechazada.",
        PROPOSAL_IS_IN_PROGRESS: "La propuesta está en progreso.",
        QUOTE_DISABLED_SUCCESSFULLY: "Cita deshabilitada exitosamente",
        QUOTE_ACTIVATED_SUCCESSFULLY: "Cotizacion activadas exitosamente",
        QUOTE_STATUS_UPDATED_SUCCESSFULLY: "Estado de la cotización actualizado exitosamente",
        QUOTE_CANNOT_BE_DUPLICATE: "La cotización no puede duplicarse",
        QUOTE_SENT_FOR_REVIEW_SUCCESSFULLY: "Cotización enviada para revisión exitosamente.",
        QUOTE_IS_DECLINED_BECAUSE_INSURANCE_COMPANY_IS_EVALUATING_THIS_CLIENT_PROFILE: "La cotización se rechaza porque la compañía de seguros está evaluando el perfil de este cliente.",
        QUOTE_IS_DECLINED: "Se rechaza la cotización.",
        LMG_NOTES_ADDED_SUCCESS: "LMG observa un mayor éxito."

    },
    /* end */

    /* proposal messages */
    proposal: {
        PROPOSAL_CREATED_SUCCESS: "Propuesta creada exitosamente.",
        PROPOSAL_NOT_FOUND: "Propuesta no encontrada.",
        PROPOSAL_STATUS_UPDATED_SUCCESSFULLY: "El estado de la propuesta se actualizó correctamente.",
        THE_PROPOSAL_IS_NOT_ISSUED: "A proposta não é emidito.",
        PROPOSAL_SUCCESSFULLY_CANCELLED: "Propuesta cancelada exitosamente",
        PROPOSAL_SUCCESSFULLY_CONVEYED: "Propuesta transmitida con éxito",
        POLICY_HAS_ALREADY_BEEN_RENEWED: "La póliza ya ha sido renovada.",
        NEW_PROPOSAL_NOT_FOUND: "Nueva propuesta no encontrada.",
        OLD_PROPOSAL_NOT_FOUND: "Propuesta antigua no encontrada.",
        PROPOSAL_APPROVED_SUCCESS: "Propuesta aprobada con éxito.",
        PROPOSAL_IS_ALREADY_ISSUED: "La propuesta ya está emitida.",
        PROPOSAL_CREATED_FAILED: "La propuesta no se crea. Por favor inténtelo después de un tiempo.",
    },
    /* end */

    /* company messages */
    company: {
        COMPANY_NOT_FOUND: "Empresa no encontrada.",
        COMPANY_ACTIVATED: "Empresa activada.",
        COMPANY_DEACTIVATED: "Empresa desactivada.",
        COMPANY_UPDATED_SUCCESS: "Empresa actualizada Éxito.",
        COMPANY_DELETED: "Empresa eliminada."
    },
    /* end */

    /* endorsement message */
    endorsement: {
        ENDORSEMENT_CREATED_SUCCESS: "Endoso creado exitosamente.",
        ENDORSEMENT_NOT_FOUND: "Respaldo no encontrado.",
        ENDORSEMENT_IS_ALREADY_ISSUED: "El aval ya está emitido.",
        ENDORSEMENT_APPROVED_SUCCESS: "Endoso aprobado con éxito.",
    },
    /* end */

    /* sporadic message */
    sporadicBoarding: {
        SPORADIC_BOARDING_CREATED_SUCCESS: "Embarque esporádico criado com sucesso.",
        SPORADIC_BOARDING_UPDATED_SUCCESS: "Embarque esporádico atualizado com sucesso.",
        SPORADIC_BOARDING_NOT_FOUND: "Embarque esporádico não encontrado.",
        SPORADIC_BOARDING_APPROVE_SUCCESS: "Embarque esporádico aprovado com sucesso.",
        SPORADIC_BOARDING_PENDING_SUCCESS: "Abordajes esporádicos pendientes de éxito.",
        SPORADIC_BOARDING_APPROVAL: "Aprobación de embarque esporádica."
    },
    /* end  */

    /* application module */
    application: {
        APPLICATION_CREATED_SUCCESS: "La aplicación tuvo éxito.",
        APPLICATION_NOT_FOUND: "Aplicación no encontrada.",
        APPLICATION_STATUS_UPDATED_SUCCESS: "Estado de la solicitud actualizado con éxito.",
        APPLICATION_CREATED_FAILED: "La aplicación creada falló."
    }
    /* end */
}
