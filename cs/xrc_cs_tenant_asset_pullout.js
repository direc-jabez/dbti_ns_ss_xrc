/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 05, 2024
 * 
 */
define(['N/currentRecord'],

    function (m_currentRecord) {

        const ITEMS_SUBLIST_ID = 'recmachcustrecord_xrc_ten_asset_pull_num';
        const ID_SUBLIST_FIELD_ID = 'id';
        const QTY_SUBLIST_FIELD_ID = 'custrecord_xrc_ten_asset_qty';
        const QTY_AVAILABLE_SUBLIST_FIELD_ID = 'custrecord_xrc_qty_avail';
        const TENNANT_FIELD_ID = 'custrecord_xrc_tenant8';
        const TENANT_SUBLIST_FIELD_ID = 'custrecord_xrc_tenant9';
        const SUBSIDIARY_FIELD_ID = 'custrecord_xrc_subsidiary8';
        const SUBSIDIARY_SUBLIST_FIELD_ID = 'custrecord_xrc_subsidiary13';
        const LOCATION_FIELD_ID = 'custrecord_xrc_location8';
        const LOCATION_SUBLIST_FIELD_ID = 'custrecord_xrc_location5';

        var g_isSubmitForApprovalBtnClick = false;
        var g_isApproveBtnClick = false;
        var g_isRejectBtnClick = false;


        function pageInit(context) {

        }

        function fieldChanged(context) {

            var currentRecord = context.currentRecord;

            var fieldId = context.fieldId;

            var sublistId = context.sublistId;

            if (sublistId === ITEMS_SUBLIST_ID) {

                if (fieldId === QTY_SUBLIST_FIELD_ID) {

                    var qty = currentRecord.getCurrentSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: QTY_SUBLIST_FIELD_ID,
                    });

                    // Defaulting quantity available based on the entered quantity 
                    currentRecord.setCurrentSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: QTY_AVAILABLE_SUBLIST_FIELD_ID,
                        value: qty,
                    });

                }

            } else if (fieldId === TENNANT_FIELD_ID || fieldId === SUBSIDIARY_FIELD_ID || fieldId === LOCATION_FIELD_ID) {

                onSpecificFieldChanged(currentRecord, fieldId);

            }

        }

        function validateLine(context) {

            var currentRecord = context.currentRecord;

            var sublistId = context.sublistId;

            if (sublistId === ITEMS_SUBLIST_ID) {

                var tenant = currentRecord.getValue(TENNANT_FIELD_ID);

                var subsidiary = currentRecord.getValue(SUBSIDIARY_FIELD_ID);

                var location = currentRecord.getValue(LOCATION_FIELD_ID);

                // Setting line tenant, subsidiary, and location based on
                // body fields
                currentRecord.setCurrentSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: TENANT_SUBLIST_FIELD_ID,
                    value: tenant,
                });

                currentRecord.setCurrentSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: SUBSIDIARY_SUBLIST_FIELD_ID,
                    value: subsidiary,
                });

                currentRecord.setCurrentSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: LOCATION_SUBLIST_FIELD_ID,
                    value: location,
                });
            }

            return true;

        }

        // This function will be triggered when fields
        // tenant, location, and subsidiary
        function onSpecificFieldChanged(currentRecord, field_id) {

            var value = currentRecord.getValue(field_id);

            var items_lines = currentRecord.getLineCount({
                sublistId: ITEMS_SUBLIST_ID,
            });

            for (var line = 0; line < items_lines; line++) {

                currentRecord.selectLine({
                    sublistId: ITEMS_SUBLIST_ID,
                    line: line,
                });

                currentRecord.setCurrentSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: field_id,
                    value: value,
                });

                currentRecord.commitLine({
                    sublistId: ITEMS_SUBLIST_ID,
                });
            }

        }

        function onSubmitForApprovalBtnClick() {

            var currentRecord = m_currentRecord.get();

            // Check if the button is already clicked
            // This is to prevent calling the link multiple times
            if (!g_isSubmitForApprovalBtnClick) {

                g_isSubmitForApprovalBtnClick = true;

                // Redirect to the approval link
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1507&deploy=1&action=submitforapproval&id=" + currentRecord.id;

            } else {

                alert('You have already submitted the form.');

            }


        }

        function onApproveBtnClick(approve_field) {

            var currentRecord = m_currentRecord.get();

            // Check if the button is already clicked
            // This is to prevent calling the link multiple times
            if (!g_isApproveBtnClick) {

                g_isApproveBtnClick = true;

                // Redirect to the approval link
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1507&deploy=1&action=approve&id=" + currentRecord.id + "&field=" + approve_field;


            } else {

                alert('You have already submitted the form.');

            }

        }

        function onRejectBtnClick() {

            var currentRecord = m_currentRecord.get();

            // Check if the button is already clicked
            // This is to prevent calling the link multiple times
            if (!g_isRejectBtnClick) {

                g_isRejectBtnClick = true;

                // Redirect to the approval link
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1507&deploy=1&action=reject&id=" + currentRecord.id;

            } else {

                alert('You have already submitted the form.');

            }

        }

        function onCancelBtnClick() {

            var currentRecord = m_currentRecord.get();

            // Redirecting to Reslet
            window.location.href = 'https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1507&deploy=1&action=cancel&id=' + currentRecord.id;

        }


        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            validateLine: validateLine,
            onSubmitForApprovalBtnClick: onSubmitForApprovalBtnClick,
            onApproveBtnClick: onApproveBtnClick,
            onRejectBtnClick: onRejectBtnClick,
            onCancelBtnClick: onCancelBtnClick,
        };
    }
);