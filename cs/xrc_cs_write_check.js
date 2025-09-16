/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 07, 2024
 * 
 */
define(['N/record', 'N/currentRecord', 'N/url', 'N/search'],

    function (record, m_currentRecord, url, search) {

        const PARAM_ORIGIN_ID = 'origin_id';
        const FUND_REQUEST_TYPE_ID = 'customrecord_xrc_fund_request';
        const FR_FUND_CATEGORY_FIELD_ID = 'custrecord_xrc_fund_category';
        const FUND_REQUEST_NUMBER_FIELD_ID = 'custbody_xrc_fund_request_num';
        const FR_REQUESTOR_FIELD_ID = 'custrecord_xrc_requestor';
        const FR_EMPLOYEE_NAME_FIELD_ID = 'custrecord_xrc_fundreq_employee_name';
        const FR_IC_PAYEE_FIELD_ID = 'custrecord_xrc_fundreq_interco_payee';
        const FR_PURPOSE_FIELD_ID = 'custrecord_xrc_purpose';
        const FR_TRANSFER_FROM_ACCOUNT_FIELD_ID = 'custrecord_xrc_fundreq_transfer_from';
        const FR_TRANSFER_POSTING_ACCOUNT_FIELD_ID = 'custrecord_xrc_transfer_account';
        const FR_TRANSFER_TO_ACCOUNT_FIELD_ID = 'custrecord_xrc_fundreq_transfer_to';
        const FR_AMOUNT_FIELD_ID = 'custrecord_xrc_amount';
        const FR_LOCATION_FIELD_ID = 'custrecord_xrc_location';
        const FR_DEPARTMENT_FIELD_ID = 'custrecord_xrc_dept';
        const FR_SUBSIDIARY_FIELD_ID = 'custrecord_xrc_subsidiary';
        const FR_CLASS_FIELD_ID = 'custrecord_xrc_class';
        const FR_CATEGORY_FUND_TRANSFER_ID = '10';
        const FR_CATEGORY_OTHER_FUNDS_ID = '11';
        const FR_CATEGORY_IC_FUND_TRANSFER_ID = '12';
        const FR_IS_IC_FIELD_ID = 'custrecord_xrc_fundreq_interco';
        const PAYEE_FIELD_ID = 'entity';
        const CUSTOMER_SUBLIST_FIELD_ID = 'customer';
        const PURPOSE_FIELD_ID = 'memo';
        const ACCOUNT_FIELD_ID = 'account';
        const SUBSIDIARY_FIELD_ID = 'subsidiary';
        const DEPARTMENT_FIELD_ID = 'department';
        const CLASS_FIELD_ID = 'class';
        const LOCATION_FIELD_ID = 'location';
        const EXPENSE_SUBLIST_ID = 'expense';
        const ACCOUNT_SUBLIST_FIELD_ID = 'account';
        const AMOUNT_SUBLIST_FIELD_ID = 'amount';
        const TAX_CODE_SUBLIST_FIELD_ID = 'taxcode';
        const VAT_UNDEF_ID = '5';
        const CHECK_TOTAL_FIELD_ID = 'usertotal';
        const PAYEE_ON_CHECK_FIELD_ID = 'custbody_xrc_check_payee_name';
        const CLASS_HO_ID = '2';
        const ACCOUNT_INTERCOMPANY_CLEARING_ACCOUNT_ID = '1048';
        const IS_IC_FUND_TRANSFER_FIELD_ID = 'custbody_xrc_is_ic_fund_transfer';
        const PRINT_ON_CHECK_AS_FIELD_ID = 'custbody_xrc_print_on_check_as';
        const TRADE_NAME_ID = '1';
        const LEGAL_NAME_ID = '2';
        const TRADE_NAME_FIELD_ID = 'custentity_xrc_trade_name';
        const BUSINESS_NAME_FIELD_ID = 'custentity_xrc_legal_name';
        const NAME_ON_CHECK_FIELD_ID = 'custbody_xrc_name_on_check';
        const PREFERRED_NAME_ON_CHECKS_FIELD_ID = 'companyname';


        function pageInit(context) {

            var currentRecord = context.currentRecord;

            // Get the origin id of the transaction if there's any
            var origin_id = getParameterWithId(PARAM_ORIGIN_ID);

            // Null check
            if (origin_id) {

                initiateWriteCheck(origin_id, currentRecord);

            }

        }

        function fieldChanged(context) {

            var currentRecord = context.currentRecord;

            var fieldId = context.fieldId;

            if (fieldId === PRINT_ON_CHECK_AS_FIELD_ID) {

                var payee_id = currentRecord.getValue(PAYEE_FIELD_ID);

                var print_on_check_as = currentRecord.getValue(PRINT_ON_CHECK_AS_FIELD_ID);

                // Getting the company name if selected on 
                // Print on Check As field is Trade Name
                var fieldLookUp = search.lookupFields({
                    type: record.Type.CUSTOMER,
                    id: payee_id,
                    columns: [print_on_check_as === TRADE_NAME_ID ? TRADE_NAME_FIELD_ID : print_on_check_as === LEGAL_NAME_ID ? BUSINESS_NAME_FIELD_ID : PREFERRED_NAME_ON_CHECKS_FIELD_ID]
                });

                // Get the ke
                var key = Object.keys(fieldLookUp)[0];

                var name_on_check = fieldLookUp[key];

                // Set the acquired value on name on check field
                currentRecord.setValue(NAME_ON_CHECK_FIELD_ID, name_on_check);

            }

        }

        function initiateWriteCheck(fr_id, currentRecord) {

            // Load Fund Request record
            var fr_rec = record.load({
                type: FUND_REQUEST_TYPE_ID,
                id: fr_id,
            });

            var fund_category = fr_rec.getValue(FR_FUND_CATEGORY_FIELD_ID);

            var is_ic = fr_rec.getValue(FR_IS_IC_FIELD_ID);
            // Setting values

            // if (fund_category !== FR_CATEGORY_FUND_TRANSFER_ID && fund_category !== FR_CATEGORY_IC_FUND_TRANSFER_ID && fund_category !== FR_CATEGORY_OTHER_FUNDS_ID) {

            //     currentRecord.setValue(PAYEE_ON_CHECK_FIELD_ID, fr_rec.getValue(FR_REQUESTOR_FIELD_ID));

            // }

            // if (!is_ic && fund_category === FR_CATEGORY_FUND_TRANSFER_ID) {

            //     currentRecord.setValue(PAYEE_ON_CHECK_FIELD_ID, fr_rec.getValue(FR_IC_PAYEE_FIELD_ID));

            // }

            currentRecord.setValue({ fieldId: SUBSIDIARY_FIELD_ID, value: fr_rec.getValue(FR_SUBSIDIARY_FIELD_ID), ignoreFieldChange: true });

            currentRecord.setValue(PURPOSE_FIELD_ID, fr_rec.getValue(FR_PURPOSE_FIELD_ID));

            currentRecord.setValue(ACCOUNT_FIELD_ID, fr_rec.getValue(FR_TRANSFER_FROM_ACCOUNT_FIELD_ID));

            currentRecord.setValue(FUND_REQUEST_NUMBER_FIELD_ID, fr_rec.id);

            currentRecord.setValue(LOCATION_FIELD_ID, fr_rec.getValue(FR_LOCATION_FIELD_ID));

            currentRecord.setValue(DEPARTMENT_FIELD_ID, fr_rec.getValue(FR_DEPARTMENT_FIELD_ID));

            currentRecord.setValue(CLASS_FIELD_ID, CLASS_HO_ID);

            currentRecord.setValue(CHECK_TOTAL_FIELD_ID, fr_rec.getValue(FR_AMOUNT_FIELD_ID));

            // If fund category is Intercompany Fund Transfer, then set
            // account as Intercompany Clearing Account. Otherwise,
            // set account as Transfer Posting Account
            fund_category === FR_CATEGORY_IC_FUND_TRANSFER_ID ?
                currentRecord.setCurrentSublistValue({
                    sublistId: EXPENSE_SUBLIST_ID,
                    fieldId: ACCOUNT_SUBLIST_FIELD_ID,
                    value: ACCOUNT_INTERCOMPANY_CLEARING_ACCOUNT_ID,
                    forceSyncSourcing: true,
                }) : fund_category === FR_CATEGORY_FUND_TRANSFER_ID ?
                    currentRecord.setCurrentSublistValue({
                        sublistId: EXPENSE_SUBLIST_ID,
                        fieldId: ACCOUNT_SUBLIST_FIELD_ID,
                        value: fr_rec.getValue(FR_TRANSFER_TO_ACCOUNT_FIELD_ID),
                        forceSyncSourcing: true,
                    }) : currentRecord.setCurrentSublistValue({
                        sublistId: EXPENSE_SUBLIST_ID,
                        fieldId: ACCOUNT_SUBLIST_FIELD_ID,
                        value: fr_rec.getValue(FR_TRANSFER_POSTING_ACCOUNT_FIELD_ID),
                        forceSyncSourcing: true,
                    });

            if (fund_category === FR_CATEGORY_IC_FUND_TRANSFER_ID) {

                currentRecord.setValue(IS_IC_FUND_TRANSFER_FIELD_ID, true);

                currentRecord.setCurrentSublistValue({
                    sublistId: EXPENSE_SUBLIST_ID,
                    fieldId: DEPARTMENT_FIELD_ID,
                    value: fr_rec.getValue(FR_DEPARTMENT_FIELD_ID),
                    forceSyncSourcing: true,
                });

                currentRecord.setCurrentSublistValue({
                    sublistId: EXPENSE_SUBLIST_ID,
                    fieldId: LOCATION_FIELD_ID,
                    value: fr_rec.getValue(FR_LOCATION_FIELD_ID),
                    forceSyncSourcing: true,
                });

            }
            currentRecord.setCurrentSublistValue({
                sublistId: EXPENSE_SUBLIST_ID,
                fieldId: PURPOSE_FIELD_ID,
                value: fr_rec.getValue(FR_PURPOSE_FIELD_ID),
                forceSyncSourcing: true,
            });

            currentRecord.setCurrentSublistValue({
                sublistId: EXPENSE_SUBLIST_ID,
                fieldId: AMOUNT_SUBLIST_FIELD_ID,
                value: fr_rec.getValue(FR_AMOUNT_FIELD_ID),
                forceSyncSourcing: true,
            });

            if (fund_category === FR_CATEGORY_FUND_TRANSFER_ID && is_ic) {

                currentRecord.setCurrentSublistValue({
                    sublistId: EXPENSE_SUBLIST_ID,
                    fieldId: CUSTOMER_SUBLIST_FIELD_ID,
                    value: currentRecord.getValue(PAYEE_FIELD_ID),
                    forceSyncSourcing: true,
                });

            }

            currentRecord.setCurrentSublistValue({
                sublistId: EXPENSE_SUBLIST_ID,
                fieldId: TAX_CODE_SUBLIST_FIELD_ID,
                value: VAT_UNDEF_ID,
                forceSyncSourcing: true,
            });

            currentRecord.commitLine({
                sublistId: EXPENSE_SUBLIST_ID,
            });

        }

        function getParameterWithId(param_id) {

            var url = new URL(window.location.href);

            var value = url.searchParams.get(param_id);

            return value;

        }

        function onPrintCheckClick() {

            var currentRecord = m_currentRecord.get();

            var suiteletUrl = url.resolveScript({
                scriptId: 'customscript_xrc_sl_print_check',
                deploymentId: 'customdeploy_xrc_sl_print_check',
                returnExternalUrl: false,
                params: {
                    rec_type: currentRecord.type,
                    rec_id: currentRecord.id,
                },
            });

            window.open(suiteletUrl);

        }

        function onPrintVoucherClick() {

            var currentRecord = m_currentRecord.get();

            var suiteletUrl = url.resolveScript({
                scriptId: 'customscript_xrc_sl_print_check_voucher',
                deploymentId: 'customdeploy_xrc_sl_print_check_voucher',
                returnExternalUrl: false,
                params: {
                    rec_id: currentRecord.id,
                },
            });

            window.open(suiteletUrl);

        }

        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            onPrintCheckClick: onPrintCheckClick,
            onPrintVoucherClick: onPrintVoucherClick,
        };
    }
);