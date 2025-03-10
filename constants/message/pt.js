/* portuguese messages */
exports.pt = {

    /* common messages */
    commonMessages: {
        ERROR: "Ocorreu um erro. Tente depois.",
        UNAUTHORIZED_USER: "Usuário não autorizado.",
        EMAIL_EXIST: "Email já existe.",
        INVALID_USER: "Usuário Inválido",
        DATA_NOT_FOUND: "Dados não encontrados.",
        DATA_LOADED_SUCCESS: "Dados carregados com sucesso.",
        INVALID_ZIPCODE: "Relatório CEP válido.",
        DATA_UPLOADED_SUCCESS: "Dados enviados com sucesso.",
        COMPANY_IS_INACTIVE: "A empresa está inativa.",
        START_DATE_IS_REQUIRED: "A data de início é obrigatória.",
        COMPANY_CREATION_FAILED: "A criação da empresa falhou.",
        COMPANY_CREATION_SUCCESS: "Sucesso na criação da empresa."
    },
    /* end */

    /* auth messages */
    auth: {
        EMAIL_ALREADY_EXIST: 'E-mail já existe.',
        USER_EMAIL_ALREADY_EXIST: 'O e-mail do usuário já existe.',
        RUC_ALREADY_EXIST: 'RUC já existe.',
        RUC_ALREADY_EXIST: "RUC já existe.",
        USER_SIGNUP_SUCCESS: 'Cadastro de usuário realizado com sucesso.',
        USER_CREDIT_SCORE: 'Pontuação de crédito do usuário.',
        EMAIL_REQUIRED: "O e-mail é obrigatório.",
        PASSWORD_REQUIRED: "Senha requerida",
        INVALID_TOKEN: "Token inválido.",
        USER_NOT_FOUND: "Usuário não encontrado.",
        WRONG_PASSWORD: "Senha incorreta.",
        ACCOUNT_DEACTIVATED: "Sua conta foi desativada, entre em contato com seu administrador.",
        ACCOUNT_DELETED: "Sua conta foi excluída, entre em contato com seu administrador.",
        ACCOUNT_PENDING: "Su cuenta no ha sido aprobada. Comuníquese con el administrador.",
        USER_LOGIN_SUCCESS: "Login do usuário com sucesso.",
        EMAIL_SENT_SUCCESS: "O email foi enviado para o seu email",
        PASSWORD_UPDATE_SUCCESS: "Sua senha redefinida com sucesso",
        SEND_VALID_TOKEN: "Envie um token válido para redefinir a senha",
        USER_UPDATED_SUCCESS: "Usuário atualizado com sucesso.",
        EMAIL_ALREADY_REGISTERED: "Este e-mail já está cadastrado. Utilize outro e-mai",
        USER_DEACTIVATED: "Desativado com sucesso",
        USER_ACTIVATED: "Ativado com sucesso",
        USER_ADDED: "Usuários adicionados com sucesso",
        USER_DELETED: "Usuário excluído com sucesso.",
        RUC_ALREADY_REGISTERED: "RUC já cadastrado.",
        USER_REJECTED: "Rejeitado com sucesso",
        USER_APPROVED: "Aprovado com sucesso",
        RUC_FOUND_SUCCESSFULLY: "RUC encontrado com sucesso.",
        RUC_NOT_FOUND: "RUC não encontrado."

    },
    /* end */

    /*email messages*/
    email: {
        FORGOT_PASSWORD: "Esqueceu sua senha.",
        RESET_YOUR_PASSWORD: "Clique aqui para redefinir sua senha.",
        SET_YOUR_PASSWORD: "Clique aqui para definir sua senha.",
        SET_NEW_PASSWORD: "Defina uma nova senha.",
        WELCOME: "Bem-vindo.",
        LOGIN_DETAILS: "Seus detalhes de login",
        QUOTE_REJECTION: "Rejeição de citação",
        QUOTE_APPROVAL: "Aprovação de cotação",
        QUOTE_APPROVAL_REQUEST: "Solicitação de aprovação de cotação.",
        SPORADIC_BOARDING_APPROVAL: "Aprovação de embarque esporádico."
    },
    /* end */

    /* validaton messages*/
    schemaValidator: {
        /* login */
        EMAIL_IS_REQUIRED: "O e-mail é obrigatório com formato válido.",
        PASSWORD_IS_REQUIRED: "Senha requerida.",
        USERNAME_IS_REQUIRED: "Nome de usuário é requerido",
        /* end */
    },
    /* end */

    /* broker messages */
    broker: {
        INVALID_BROKER_ID: "ID do corretor inválido.",
        POLICY_NOT_POSSIBLE: "A Apólice não pode ser emitida.",
        BROKER_DELETED_SUCCESS: "Corretor excluído com sucesso",
    },
    /* end */

    /* sub broker messages */
    subbroker: {
    },
    /* end */

    /* subadmin messages */
    subadmin: {
        SUBADMIN_DELETE: "Subadministrador excluído com sucesso",
    },
    /* end */

    /* claims messages */
    claims: {
        CLAIMS_PARTNER_ADDED: "Parceiro de reivindicações adicionado com sucesso",
        USERNAME_ALREADY_EXIST: 'O nome de usuário já existe',
        SECRET_KEY_UNMATCHED: "A chave secreta não corresponde.",
        USERNAME_NOT_EXIST: 'Usuário não existe.',
        PROVIDE_SECRET_KEY: "Forneça a chave secreta.",
        AUTHORIZATION_TOKEN_REQUIRED: "O token de autorização é obrigatório",
        AUTHORIZATION_TOKEN_INVALID: "O token de autorização é inválido.",
        CLAIMS_ADDED: "Reivindicação adicionada com sucesso",
        PROPOSALS_NOT_FOUND: "Nenhuma proposta encontrada com o número da apólice",
        CLAIM_ALREADY_EXIST: "A reivindicação já existe."
    },
    /* end */

    /* quote messages */
    quote: {
        QUOTE_ADDED_SUCCESS: "Cotação adicionada com sucesso.",
        QUOTE_NOT_FOUND: "Cotação não encontrada.",
        ADD_VALID_RUC: "Por favor adicione Ruc válido.",
        TAX_ID_NOT_REGISTERED: "RUC não registrado na Receita Federal.",
        USER_CREDIT_SCORE: "Pontuação de crédito do usuário.",
        CUSTOMER_DETAIL_ADDED_SUCCESS: "Detalhes do cliente adicionados com sucesso.",
        EMAIL_ALREADY_ASSOCIATED: "Email já associado a outro usuário.",
        RUC_ALREADY_ASSOCIATED: "Ruc já associado a outro usuário.",
        EMAIL_AND_RUC_ALREADY_ASSOCIATED: "E-mail e ruc já cadastrados.",
        QUOTE_TARGETED_TO_MODERATION: "Sua cotação foi direcionada para moderação e será analisada por um subscritor de risco. No prazo máximo de 24 horas úteis você receberá a resposta quanto esta solicitação.",
        TRANSPORT_GOODS_ADDED_SUCCESS: "Mercadorias de transporte adicionadas com sucesso.",
        TRANSPORT_GOOD_NOT_FOUND: "Bom transporte não encontrado.",
        RUC_ALREADY_EXIST: "RUC já existe",
        SHIPMENT_DETAIL_ADDED_SUCCESS: "Detalhes da remessa adicionados com sucesso.",
        DOCUMENT_TYPE_NOT_FOUND: "Tipo de documento não encontrado.",
        DOCUMENT_NOT_FOUND: "Documento não encontrado.",
        DOCUMENT_DELETED_SUCCESS: "Documento excluído com sucesso.",
        COVERAGES_ADDED_SUCCESS: "Coberturas adicionadas com sucesso.",
        TRANSPORT_GOOD_DETAIL_NOT_FOUND: "Detalhe bom do transporte não encontrado.",
        TRANSPORT_GOOD_DETAIL_DELETED_SUCCESS: "Detalhe bom de transporte excluído com sucesso.",
        CALCULATION_LOADED_SUCCESS: "Cálculo carregado com sucesso.",
        CALCULATION_ADDED_SUCCESS: "Cálculo adicionado com sucesso.",
        ABOVE_UNDERWRITER_AUTONOMY: "Acima da autonomia do Corretor / Subscritor.",
        QUOTE_ALREADY_DECLINED: "Cotaçao já Declinada.",
        QUOTE_ALREADY_EMITIDO: "Cotação já apresentada a outro corretor ou risco vigente.",
        QUOTE_NOT_ACTIVE: "Citação não está ativa.",
        QUOTE_RISKS_ADDED_SUCCESS: "Riscos de cotação adicionados com sucesso.",
        QUOTE_CLAIMS_ADDED_SUCCESS: "Reivindicações de cotação adicionadas com sucesso.",
        INVALID_DATA_FORMAT: "Formato de dados/retorno inválido.",
        SELECT_VALID_CURRENCY: "Selecione uma moeda válida.",
        QUOTE_MESSAGE_ADDED_SUCCESS: "Mensagem de cotação adicionada com sucesso.",
        QUOTE_DETAILS_SENT_SUCCESSFULLY: "Detalhes da cotação enviados com sucesso.",
        QUOTE_APPROVED_SUCCESSFULLY: "Orçamento aprovado com sucesso.",
        QUOTE_HAS_BEEN_REJECTED: "Citação rejeitada.",
        PROPOSAL_IS_IN_PROGRESS: "A proposta está em andamento.",
        QUOTE_DISABLED_SUCCESSFULLY: "Citaçõe desativada com sucesso.",
        QUOTE_ACTIVATED_SUCCESSFULLY: "Cotação ativada com sucesso.",
        QUOTE_STATUS_UPDATED_SUCCESSFULLY: "Status das cotações atualizado com sucesso",
        QUOTE_CANNOT_BE_DUPLICATE: "A cotação não pode ser duplicada.",
        QUOTE_SENT_FOR_REVIEW_SUCCESSFULLY: "Cotação enviada para revisão com sucesso.",
        QUOTE_IS_DECLINED_BECAUSE_INSURANCE_COMPANY_IS_EVALUATING_THIS_CLIENT_PROFILE: "A cotação foi recusada porque a seguradora está avaliando o perfil deste cliente.",
        QUOTE_IS_DECLINED: "A cotação foi recusada.",
        LMG_NOTES_ADDED_SUCCESS: "LMG observa maior sucesso."
    },
    /* end */

    /*proposal messages*/
    proposal: {
        PROPOSAL_CREATED_SUCCESS: "Proposta criada com sucesso.",
        PROPOSAL_NOT_FOUND: "Proposta não encontrada.",
        THE_PROPOSAL_IS_NOT_ISSUED: "A proposta não é emidito.",
        PROPOSAL_SUCCESSFULLY_CANCELLED: "proposta cancelada com sucesso",
        PROPOSAL_SUCCESSFULLY_CONVEYED: "proposta veiculada com sucesso",
        POLICY_HAS_ALREADY_BEEN_RENEWED: "política já foi renovada.",
        OLD_PROPOSAL_NOT_FOUND: "Proposta antiga não encontrada.",
        NEW_PROPOSAL_NOT_FOUND: "Nova proposta não encontrada.",
        PROPOSAL_APPROVED_SUCCESS: "Proposta aprovada com sucesso.",
        PROPOSAL_IS_ALREADY_ISSUED: "A proposta já foi emitida.",
        PROPOSAL_CREATED_FAILED: "A proposta não foi criada. Por favor, tente depois de algum tempo.",
    },
    /* end */

    /* company messages */
    company: {
        COMPANY_NOT_FOUND: "Empresa não encontrada.",
        COMPANY_ACTIVATED: "Empresa ativada.",
        COMPANY_DEACTIVATED: "Empresa desativada.",
        COMPANY_UPDATED_SUCCESS: "Empresa atualizada com sucesso.",
        COMPANY_DELETED: "Empresa excluída."
    },
    /* end */

    /* endorsement message */
    endorsement: {
        ENDORSEMENT_NOT_FOUND: "Endosso não encontrado.",
        ENDORSEMENT_IS_ALREADY_ISSUED: "O endosso já foi emitido.",
        ENDORSEMENT_CREATED_SUCCESS: "Endosso criado com sucesso.",
        ENDORSEMENT_APPROVED_SUCCESS: "Endosso aprovado com sucesso.",
    },
    /* end */

    /* sporadic message */
    sporadicBoarding: {
        SPORADIC_BOARDING_CREATED_SUCCESS: "Embarque esporádico criado com sucesso.",
        SPORADIC_BOARDING_UPDATED_SUCCESS: "Embarque esporádico atualizado com sucesso.",
        SPORADIC_BOARDING_NOT_FOUND: "Embarque esporádico não encontrado.",
        SPORADIC_BOARDING_APPROVE_SUCCESS: "Embarque esporádico aprovado com sucesso.",
        SPORADIC_BOARDING_PENDING_SUCCESS: "Embarque esporádico aguardando sucesso."
    },
    /* end  */

    /* appliction module */
    application: {
        APPLICATION_CREATED_SUCCESS: "Aplicativo criado com sucesso.",
        APPLICATION_NOT_FOUND: "Aplicativo não encontrado.",
        APPLICATION_STATUS_UPDATED_SUCCESS: "Status do aplicativo atualizado com sucesso.",
        APPLICATION_CREATED_FAILED: "Falha no aplicativo criado."
    }
    /* end */
};
