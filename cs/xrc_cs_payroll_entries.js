/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 07, 2024
 * 
 */
define([],

    function () {

        const LINES_SUBLIST_ID = 'line';
        const ACCOUNTS_PAYABLE_TYPE_ID = '6';
        const NAME_SUBLIST_FIELD_ID = 'entity';
        const ACCOUNT_TYPE_SUBLIST_FIELD_ID = 'custcol_xrc_account_type';


        function pageInit(context) {

        }

        function validateLine(context) {

            var currentRecord = context.currentRecord;

            var sublistId = context.sublistId;

            if (sublistId === LINES_SUBLIST_ID) {

                var acct_type = currentRecord.getCurrentSublistValue({
                    sublistId: LINES_SUBLIST_ID,
                    fieldId: ACCOUNT_TYPE_SUBLIST_FIELD_ID,
                });

                var name = currentRecord.getCurrentSublistValue({
                    sublistId: LINES_SUBLIST_ID,
                    fieldId: NAME_SUBLIST_FIELD_ID,
                });


                if (acct_type === ACCOUNTS_PAYABLE_TYPE_ID && !name) {

                    alert("Name is required on Accounts Payable accounts.");

                    return false;

                }

            }

            return true;

        }

        return {
            pageInit: pageInit,
            validateLine: validateLine,
        };
    }
);