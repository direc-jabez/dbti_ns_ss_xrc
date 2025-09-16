/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 06, 2024
 * 
 */
define(['N/record', 'N/search', 'N/currentRecord', 'N/url'],

    function (record, search, currRec, url) {

        const APPLY_RETENTION_FIELD_ID = 'custbody_xrc_apply_retention';
        const RETENTION_PERCENTAGE_FIELD_ID = 'custbody_xrc_retention_percentage';
        const PRINT_ON_CHECK_AS_FIELD_ID = 'custbody_xrc_print_on_check_as';
        const TRADE_NAME_ID = '1';
        const LEGAL_NAME_ID = '2';
        const VENDOR_FIELD_ID = 'entity';
        const COMPANY_NAME_FIELD_ID = 'companyname';
        const LEGAL_NAME_FIELD_ID = 'legalname';
        const PREFERRED_NAME_ON_CHECKS_FIELD_ID = 'printoncheckas';
        const NAME_ON_CHECK_FIELD_ID = 'custbody_xrc_name_on_check';
        const ENTRY_FORM_QUERY_STRING_FIELD_ID = 'entryformquerystring';
        const APPLY_RETENTION_YES = '1';
        const APPLY_SUBLIST_ID = 'apply';
        const APPLY_SUBLIST_FIELD_ID = 'apply';
        const DOC_SUBLIST_FIELD_ID = 'doc';
        const DUE_SUBLIST_FIELD_ID = 'due';
        const ITEMS_SUBLIST_ID = 'item';
        const ITEMS_SUBLIST_FIELD_ID = 'item';
        const GROSS_AMOUNT_SUBLIST_FIELD_ID = 'grossamt';
        const EXP_WHT_ID = '14';
        const AMOUNT_SUBLIST_FIELD_ID = 'amount';
        const LOCATION_FIELD_ID = 'location';

        var g_isSubmitForApprovalBtnClick = false;
        var g_isApproveBtnClick = false;
        var g_isRejectBtnClick = false;

        var g_is_rentention_computed = false;
        var g_is_notified = false;


        function pageInit(context) {

            var currentRecord = context.currentRecord;

            try {

                var bill_id = getBillId(currentRecord);

                if (bill_id) {

                    // Get the value of Print on Check As field on linked Bill
                    var fieldLookUp = search.lookupFields({
                        type: record.Type.VENDOR_BILL,
                        id: bill_id,
                        columns: [PRINT_ON_CHECK_AS_FIELD_ID, APPLY_RETENTION_FIELD_ID, RETENTION_PERCENTAGE_FIELD_ID, LOCATION_FIELD_ID]
                    });

                    // Setting default values
                    fieldLookUp.custbody_xrc_print_on_check_as[0] && currentRecord.setValue(PRINT_ON_CHECK_AS_FIELD_ID, fieldLookUp.custbody_xrc_print_on_check_as[0]?.value);

                    fieldLookUp.custbody_xrc_apply_retention[0] && currentRecord.setValue(APPLY_RETENTION_FIELD_ID, fieldLookUp.custbody_xrc_apply_retention[0]?.value);

                    fieldLookUp.custbody_xrc_retention_percentage && currentRecord.setValue(RETENTION_PERCENTAGE_FIELD_ID, parseFloat(fieldLookUp.custbody_xrc_retention_percentage));

                    fieldLookUp.location[0] && currentRecord.setValue(LOCATION_FIELD_ID, fieldLookUp.location[0]?.value);

                    var apply_retention = currentRecord.getValue(APPLY_RETENTION_FIELD_ID);

                    if (apply_retention === APPLY_RETENTION_YES) {

                        alert('To show the payment amount net of retention amount, in the Apply subtab re-check the "Apply" checkbox next to the bill you want to pay.');

                    }

                }

            } catch (error) {

                console.log(error);

            }

        }

        function fieldChanged(context) {

            var currentRecord = context.currentRecord;

            var fieldId = context.fieldId;

            var sublistId = context.sublistId;

            var apply_retention = currentRecord.getValue(APPLY_RETENTION_FIELD_ID);

            if (fieldId === PRINT_ON_CHECK_AS_FIELD_ID) {

                var vendor_id = currentRecord.getValue(VENDOR_FIELD_ID);

                var print_on_check_as = currentRecord.getValue(PRINT_ON_CHECK_AS_FIELD_ID);

                // Getting the company name if selected on 
                // Print on Check As field is Trade Name
                var fieldLookUp = search.lookupFields({
                    type: record.Type.VENDOR,
                    id: vendor_id,
                    columns: [print_on_check_as === TRADE_NAME_ID ? COMPANY_NAME_FIELD_ID : print_on_check_as === LEGAL_NAME_ID ? LEGAL_NAME_FIELD_ID : PREFERRED_NAME_ON_CHECKS_FIELD_ID]
                });

                // Get the ke
                var key = Object.keys(fieldLookUp)[0];

                var name_on_check = fieldLookUp[key];

                // Set the acquired value on name on check field
                currentRecord.setValue(NAME_ON_CHECK_FIELD_ID, name_on_check);

            } else if (sublistId === APPLY_SUBLIST_ID && fieldId === APPLY_SUBLIST_FIELD_ID && apply_retention === APPLY_RETENTION_YES) {

                var line = context.line;

                var apply = currentRecord.getCurrentSublistValue({
                    sublistId: sublistId,
                    fieldId: fieldId,
                });

                if (apply) {

                    applyRetentionAmount(currentRecord, line);

                }

            } else if (sublistId === APPLY_SUBLIST_ID && fieldId === AMOUNT_SUBLIST_FIELD_ID && apply_retention === APPLY_RETENTION_YES) {

                if (!g_is_notified && g_is_rentention_computed) {

                    alert('Overriding the payment amount will remove the computation for the deduction of retention amount.');

                    g_is_notified = true;
                }

            }

        }

        function getBillId(currentRecord) {

            var entry_query_string = currentRecord.getValue(ENTRY_FORM_QUERY_STRING_FIELD_ID);

            // Extracting the bill_id
            return entry_query_string.split('&')[1].split('=')[1];

        }

        function applyRetentionAmount(currentRecord, line) {

            var doc = currentRecord.getSublistValue({
                sublistId: APPLY_SUBLIST_ID,
                fieldId: DOC_SUBLIST_FIELD_ID,
                line: line
            });

            var due = currentRecord.getSublistValue({
                sublistId: APPLY_SUBLIST_ID,
                fieldId: DUE_SUBLIST_FIELD_ID,
                line: line
            });

            var total_gross_amt = getBillTotalGrossAmount(doc);

            var retention = total_gross_amt * (currentRecord.getValue(RETENTION_PERCENTAGE_FIELD_ID) / 100);

            var payment = due - retention;

            currentRecord.selectLine({
                sublistId: APPLY_SUBLIST_ID,
                line: line
            });

            currentRecord.setCurrentSublistValue({
                sublistId: APPLY_SUBLIST_ID,
                fieldId: AMOUNT_SUBLIST_FIELD_ID,
                value: payment,
                ignoreFieldChanged: true,
            });

            g_is_rentention_computed = true;

            g_is_notified = false;

        }

        function getBillTotalGrossAmount(bill_id) {

            var total_gross_amt = 0;

            var bill_rec = record.load({
                type: record.Type.VENDOR_BILL,
                id: bill_id,
                isDynamic: true,
            });

            var items_lines = bill_rec.getLineCount({
                sublistId: ITEMS_SUBLIST_ID,
            });

            for (var line = 0; line < items_lines; line++) {

                var item_id = bill_rec.getSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: ITEMS_SUBLIST_FIELD_ID,
                    line: line,
                });

                if (item_id !== EXP_WHT_ID) {

                    var gross_amt = bill_rec.getSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: GROSS_AMOUNT_SUBLIST_FIELD_ID,
                        line: line,
                    });

                    total_gross_amt += gross_amt;

                }

            }

            return total_gross_amt;
        }

        function onSubmitForApprovalBtnClick() {

            var currentRecord = currRec.get();

            // Check if the button is already clicked
            // This is to prevent calling the link multiple times
            if (!g_isSubmitForApprovalBtnClick) {

                g_isSubmitForApprovalBtnClick = true;

                // Redirect to the approval link
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1528&deploy=1&action=submitforapproval&id=" + currentRecord.id;

            } else {

                alert('You have already submitted the form.');

            }

        }

        function onApproveBtnClick(approve_field) {

            var currentRecord = currRec.get();

            // Check if the button is already clicked
            // This is to prevent calling the link multiple times
            if (!g_isApproveBtnClick) {

                g_isApproveBtnClick = true;

                // Redirect to the approval link
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1528&deploy=1&action=approve&id=" + currentRecord.id + "&field=" + approve_field;


            } else {

                alert('You have already submitted the form.');

            }

        }

        function onRejectBtnClick() {

            var currentRecord = currRec.get();

            // Check if the button is already clicked
            // This is to prevent calling the link multiple times
            if (!g_isRejectBtnClick) {

                g_isRejectBtnClick = true;

                // Redirect to the approval link
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1528&deploy=1&action=reject&id=" + currentRecord.id;

            } else {

                alert('You have already submitted the form.');

            }

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

        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            onSubmitForApprovalBtnClick: onSubmitForApprovalBtnClick,
            onApproveBtnClick: onApproveBtnClick,
            onRejectBtnClick: onRejectBtnClick,
            onPrintCheckClick: onPrintCheckClick,
        };
    }
);