/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * 
 */
define(['N/record', 'N/search', 'N/currentRecord', 'N/runtime'],

    function (record, search, currRec, runtime) {

        const PRINT_ON_CHECK_AS_FIELD_ID = 'custbody_xrc_print_on_check_as';
        const TRADE_NAME_ID = '1';
        const LEGAL_NAME_ID = '2';
        const VENDOR_FIELD_ID = 'entity';
        const COMPANY_NAME_FIELD_ID = 'companyname';
        const LEGAL_NAME_FIELD_ID = 'legalname';
        const PREFERRED_NAME_ON_CHECKS_FIELD_ID = 'printoncheckas';
        const NAME_ON_CHECK_FIELD_ID = 'custbody_xrc_name_on_check';
        const ITEMS_SUBLIST_ID = 'item';
        const ITEM_SUBLIST_FIELD_ID = 'item';
        const TAXCODE_SUBLIST_FIELD_ID = 'taxcode';
        const ADVANCES_FROM_TENANT_ITEM_ID = '5264';
        const CUSTOMER_SUBLIST_FIELD_ID = 'customer';
        const SPACE_NO_SUBLIST_FIELD_ID = 'custcol_xrc_space_num';
        const BILL_TOTAL_FIELD_ID = 'usertotal';
        const CHARGE_AMOUNT_FIELD_ID = 'custbody_xrc_charge_amt';
        const CHARGE_RATE_FIELD_ID = 'custbody_xrc_charge_percentage';
        const UNDEF_PH_ID = '5';
        const MODE_COPY = "copy";
        const MODE_CREATE = "create";
        const PREPARED_BY_FLD_ID = "custbody_xrc_prepared_by";
        const AP_SENIOR_ACCOUNTING_OFFICER_FIELD_ID = 'custbody_xrc_approver1';
        const APPROVER_2_FIELD_ID = 'custbody_xrc_approver2';
        const APPROVAL_1_FLD_ID = "custbody_xrc_approval1";
        const APPROVAL_2_FLD_ID = "custbody_xrc_approval2";
        const APPROVAL_3_FLD_ID = "custbody_xrc_approval3";
        const APPROVAL_4_FLD_ID = "custbody_xrc_approval4";
        const APPROVAL_5_FLD_ID = "custbody_xrc_approval5";
        const APPROVAL_6_FLD_ID = "custbody_xrc_approval6";
        const APPROVAL_7_FLD_ID = "custbody_xrc_approval7";
        const FOR_APPROVAL_FLD_ID = "custbody_xrc_for_approval";
        const REJECTED_FLD_ID = "custbody1";
        const APPLY_RETENTION_FIELD_ID = 'custbody_xrc_apply_retention';


        var g_isSubmitForApprovalBtnClick = false;
        var g_isApproveBtnClick = false;
        var g_isRejectBtnClick = false;

        function pageInit(context) {

            var currentRecord = context.currentRecord;

            if (context.mode === MODE_COPY) {

                var currentUser = runtime.getCurrentUser();

                currentRecord.setValue(PREPARED_BY_FLD_ID, currentUser.id);

                currentRecord.setValue(AP_SENIOR_ACCOUNTING_OFFICER_FIELD_ID, null);
                currentRecord.setValue(APPROVER_2_FIELD_ID, null);
                currentRecord.setValue(APPROVAL_1_FLD_ID, false);
                currentRecord.setValue(APPROVAL_2_FLD_ID, false);
                currentRecord.setValue(APPROVAL_3_FLD_ID, false);
                currentRecord.setValue(APPROVAL_4_FLD_ID, false);
                currentRecord.setValue(APPROVAL_5_FLD_ID, false);
                currentRecord.setValue(APPROVAL_6_FLD_ID, false);
                currentRecord.setValue(APPROVAL_7_FLD_ID, false);
                currentRecord.setValue(FOR_APPROVAL_FLD_ID, false);
                currentRecord.setValue(REJECTED_FLD_ID, false);

                var url = new URL(window.location.href);

                var value = url.searchParams.get('itemrcpt');

                if (value) {

                    var ir_fieldLookUp = search.lookupFields({
                        type: record.Type.ITEM_RECEIPT,
                        id: value,
                        columns: ['custbody_xrc_apply_retention']
                    });

                    currentRecord.setValue(APPLY_RETENTION_FIELD_ID, ir_fieldLookUp['custbody_xrc_apply_retention'][0]?.value);

                }
            }

        }

        function fieldChanged(context) {

            var currentRecord = context.currentRecord;

            var fieldId = context.fieldId;

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

                // Get the key
                var key = Object.keys(fieldLookUp)[0];

                var name_on_check = fieldLookUp[key];

                // Set the acquired value on name on check field
                currentRecord.setValue(NAME_ON_CHECK_FIELD_ID, name_on_check);

            } else if (fieldId === BILL_TOTAL_FIELD_ID || fieldId === CHARGE_RATE_FIELD_ID) {

                var bill_total = currentRecord.getValue(BILL_TOTAL_FIELD_ID);

                // Calculating for Charge Amount field
                currentRecord.setValue({
                    fieldId: CHARGE_AMOUNT_FIELD_ID,
                    value: (Math.round((bill_total * ((currentRecord.getValue(CHARGE_RATE_FIELD_ID) / 100))) * 100) / 100),
                    ignoreFieldChange: true
                });


            } else if (fieldId === CHARGE_AMOUNT_FIELD_ID) {

                // calculating for Charge Rate
                currentRecord.setValue({
                    fieldId: CHARGE_RATE_FIELD_ID,
                    value: (Math.round(currentRecord.getValue(CHARGE_AMOUNT_FIELD_ID) / currentRecord.getValue(BILL_TOTAL_FIELD_ID) * 100) / 100),
                    ignoreFieldChange: true
                });

            }

        }

        function validateLine(context) {

            var currentRecord = context.currentRecord;

            var sublistId = context.sublistId;

            if (sublistId === ITEMS_SUBLIST_ID) {

                var item = currentRecord.getCurrentSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: ITEM_SUBLIST_FIELD_ID,
                });

                // Check if Item is Advances From Tenant
                if (item === ADVANCES_FROM_TENANT_ITEM_ID) {

                    var tax_code = currentRecord.getCurrentSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: TAXCODE_SUBLIST_FIELD_ID,
                    });

                    console.log(tax_code);

                    if (tax_code !== UNDEF_PH_ID) {

                        alert('Tax Code should be UNDEF-PH on Advances from Tenant item.');

                        return false;

                    }

                    var customer = currentRecord.getCurrentSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: CUSTOMER_SUBLIST_FIELD_ID,
                    });

                    var space_no = currentRecord.getCurrentSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: SPACE_NO_SUBLIST_FIELD_ID,
                    });


                    // Make the Customer and Space No. columns mandatory if the
                    // tagged item is Advances From Tenant
                    if (!customer) {

                        alert('Customer is required on Advances from Tenant items.');

                        return false;

                    }

                    if (!space_no) {

                        alert('Space No. is required on Advances from Tenant items.');

                        return false;

                    }

                }

            }

            return true;

        }

        function onSubmitForApprovalBtnClick() {

            var currentRecord = currRec.get();

            // Check if the button is already clicked
            // This is to prevent calling the link multiple times
            if (!g_isSubmitForApprovalBtnClick) {

                g_isSubmitForApprovalBtnClick = true;

                // Redirect to the approval link
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1531&deploy=1&action=submitforapproval&id=" + currentRecord.id;

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
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1531&deploy=1&action=approve&id=" + currentRecord.id + "&field=" + approve_field;


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
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1531&deploy=1&action=reject&id=" + currentRecord.id;

            } else {

                alert('You have already submitted the form.');

            }

        }

        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            validateLine: validateLine,
            onSubmitForApprovalBtnClick: onSubmitForApprovalBtnClick,
            onApproveBtnClick: onApproveBtnClick,
            onRejectBtnClick: onRejectBtnClick,
        };
    }
);