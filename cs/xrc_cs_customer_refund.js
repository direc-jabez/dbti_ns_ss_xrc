/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 *
 * Created by: Charles Maverick Herrera
 * Date: Oct 24, 2024
 * 
 * Modified by: Ricky Eredillas Jr.
 * Date: Feb 10, 2025
 *
 */
define(['N/currentRecord', 'N/url', 'N/search'], function (currRec, url, search) {

    const MODE_COPY = "copy";
    const MODE_CREATE = "create";
    const MODE_EDIT = "edit";
    const APPROVAL_1_FLD_ID = "custbody_xrc_approval1";
    const APPROVAL_2_FLD_ID = "custbody_xrc_approval2";
    const APPROVAL_3_FLD_ID = "custbody_xrc_approval3";
    const APPROVAL_4_FLD_ID = "custbody_xrc_approval4";
    const APPROVAL_5_FLD_ID = "custbody_xrc_approval5";
    const APPROVAL_6_FLD_ID = "custbody_xrc_approval6";
    const APPROVAL_7_FLD_ID = "custbody_xrc_approval7";
    const FOR_APPROVAL_FLD_ID = "custbody_xrc_for_approval";
    const REJECTED_FLD_ID = "custbody1";
    const LBN_PARAM_ID = 'lbn';
    const CUSTOMER_PARAM_ID = 'customer';
    const LEASE_BILLING_NOTICE_RECORD_TYPE = 'customrecord_xrc_lease_billing_notice';
    const CUSTOMER_FIELD_ID = 'customer';
    const MEMO_FIELD_ID = 'memo';
    const LOCATION_FIELD_ID = 'location';
    const LBN_NO_FIELD_ID = 'custbody_xrc_lbn_no';
    const LBN_BALANCE_FIELD_ID = 'custbody_xrc_lbn_balance';
    const TOTAL_FIELD_ID = 'total';

    var g_mode = '';

    function pageInit(context) {

        g_mode = context.mode;

        var currentRecord = context.currentRecord;

        if (context.mode === MODE_CREATE) {

            var customer = getParameterWithId(CUSTOMER_PARAM_ID);

            if (customer) {

                currentRecord.setValue(CUSTOMER_FIELD_ID, customer);

            }

        } else if (context.mode === MODE_COPY) {

            currentRecord.setValue(APPROVAL_1_FLD_ID, false);
            currentRecord.setValue(APPROVAL_2_FLD_ID, false);
            currentRecord.setValue(APPROVAL_3_FLD_ID, false);
            currentRecord.setValue(APPROVAL_4_FLD_ID, false);
            currentRecord.setValue(APPROVAL_5_FLD_ID, false);
            currentRecord.setValue(APPROVAL_6_FLD_ID, false);
            currentRecord.setValue(APPROVAL_7_FLD_ID, false);
            currentRecord.setValue(FOR_APPROVAL_FLD_ID, false);
            currentRecord.setValue(REJECTED_FLD_ID, false);

        }
    }

    function fieldChanged(context) {

        var currentRecord = context.currentRecord;

        var fieldId = context.fieldId;

        if (fieldId === LBN_NO_FIELD_ID) {

            var lbn_id = currentRecord.getValue(fieldId);

            if (lbn_id) {

                const { balance, remarks, location } = getLBNDetails(lbn_id);

                currentRecord.setValue(MEMO_FIELD_ID, remarks);

                currentRecord.setValue(LOCATION_FIELD_ID, location);

                currentRecord.setValue(LBN_BALANCE_FIELD_ID, balance);

            }

        }

    }

    function postSourcing(context) {

        var currentRecord = context.currentRecord;

        var fieldId = context.fieldId;

        if (g_mode === MODE_CREATE) {

            if (fieldId === CUSTOMER_FIELD_ID) {

                var lbn_id = getParameterWithId(LBN_PARAM_ID);

                if (lbn_id) {

                    const { balance, remarks, location } = getLBNDetails(lbn_id);

                    currentRecord.setValue(MEMO_FIELD_ID, remarks);

                    currentRecord.setValue(LOCATION_FIELD_ID, location);

                    currentRecord.setValue(LBN_NO_FIELD_ID, lbn_id);

                    currentRecord.setValue(LBN_BALANCE_FIELD_ID, balance);

                }

            }

        }

    }

    function saveRecord(context) {

        var currentRecord = context.currentRecord;

        var total = currentRecord.getValue(TOTAL_FIELD_ID);

        var lbn_balance = currentRecord.getValue(LBN_BALANCE_FIELD_ID);

        if (lbn_balance < total) {

            alert('Insufficient LBN Balance.');

            return false;

        }

        return true;
    }

    function onPrintCheckClick() {

        var currentRecord = currRec.get();

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

        var currentRecord = currRec.get();

        var suiteletUrl = url.resolveScript({
            scriptId: 'customscript_xrc_sl_print_check_voucher',
            deploymentId: 'customdeploy_xrc_sl_print_check_voucher',
            returnExternalUrl: false,
            params: {
                rec_id: currentRecord.id,
                rec_type: "custrfnd",
            },
        });

        window.open(suiteletUrl);

    }

    function getLBNDetails(lbn_id) {

        var fieldLookUp_lbn = search.lookupFields({
            type: LEASE_BILLING_NOTICE_RECORD_TYPE,
            id: lbn_id,
            columns: ['custrecord_xrc_lbn_balance', 'custrecord_xrc_lbn_remarks', 'custrecord_xrc_lbn_location']
        });

        return {
            balance: fieldLookUp_lbn['custrecord_xrc_lbn_balance'],
            remarks: fieldLookUp_lbn['custrecord_xrc_lbn_remarks'],
            location: fieldLookUp_lbn['custrecord_xrc_lbn_location'][0].value,
        };


    }

    function getParameterWithId(param_id) {

        var url = new URL(window.location.href);

        var value = url.searchParams.get(param_id);

        return value;

    }

    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged,
        postSourcing: postSourcing,
        saveRecord: saveRecord,
        onPrintCheckClick: onPrintCheckClick,
        onPrintVoucherClick: onPrintVoucherClick,
    };
});
