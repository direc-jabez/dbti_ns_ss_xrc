/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 21, 2024
 * 
 */
define(['N/search', 'N/ui/serverWidget', 'N/record', 'N/runtime', 'N/format'],

    function (search, serverWidget, record, runtime, format) {

        const ID_FIELD_ID = 'name';
        const AMOUNT_FIELD_ID = 'custrecord_xrc_amount';
        const ISSUED_FIELD_ID = 'custrecord_xrc_fundreq_issued';
        const FUND_CATEGORY_FIELD_ID = 'custrecord_xrc_fund_category';
        const BALANCE_FIELD_ID = 'custrecord_xrc_balance';
        const FOR_ATD_FIELD_ID = 'custrecord_xrc_for_atd';
        const ATD_FIELD_ID = 'custrecord_xrc_atd';
        const PREPARED_BY_FIELD_ID = 'custrecord_xrc_prepared_by';
        const REQUESTOR_FIELD_ID = 'custrecord_xrc_requestor';
        const EMPLOYEE_NAME_FIELD_ID = 'custrecord_xrc_fundreq_employee_name';
        const STATUS_FIELD_ID = 'custrecord_xrc_status';
        const PENDING_APPROVAL_STATUS_ID = '1';
        const APPROVED_PENDING_ISSUANCE_ID = '2';
        const ISSUED_PENDING_LIQUIDATION = '3';
        const CANCEL_ID = '6';
        const CLOSED_STATUS_ID = '4';
        const REJECTED_STATUS_ID = '5';
        const FOR_APPROVAL_FIELD_ID = 'custrecord_xrc_fundreq_for_approval';
        const OTHER_FUNDS_CATEGORY_ID = '11';
        const REVOLVING_FUND_CATEGORY_ID = '2';
        const CASH_ADVANCE_CATEGORY_ID = '8';
        const CASH_FUND_ID = '7';
        const EMERGENCY_FUND_ID = '5';
        const FUND_TRANSFER_CATEGORY_ID = '10';
        const IC_FUND_TRANSFER_CATEGORY_ID = '12';
        const APPROVAL_ONE_FIELD_ID = 'custrecord_xrc_fundreq_approval1';
        const APPROVAL_TWO_FIELD_ID = 'custrecord_xrc_fundreq_approval2';
        const COO_ID = 1460;
        const FUND_REQ_ACC_PER_SUBSIDIARY_RECORD_TYPE = 'customrecord_xrc_fundreq_qcct_subs';
        const SUBSIDIARY_FIELD_ID = 'custrecord_xrc_subsidiary';
        const TRANSFER_POSTING_ACCOUNT_FIELD_ID = 'custrecord_xrc_transfer_account';
        const TREASURY_ASSISTANT_ROLE_ID = 1482;
        const TREASURY_HEAD_ROLE_ID = 1483;
        const A_P_CLERK_ROLE_ID = 1457;
        const FR_LAST_NUM_FIELD_ID = 'custscript_xrc_fund_req_last_num';
        const LOCATION_FIELD_ID = 'custrecord_xrc_location';
        const DATE_FIELD_ID = 'custrecord_xrc_fr_date';
        const TRANSFEREE_COMPANY_FIELD_ID = 'custrecord_xrc_fundreq_transferee';
        const INTERCOMPANY_FIELD_ID = 'custrecord_xrc_fundreq_interco';
        const IC_PAYEE_FIELD_ID = 'custrecord_xrc_fundreq_interco_payee';

        function beforeLoad(context) {


        }


        return {
            beforeLoad: beforeLoad,
        };
    }
);