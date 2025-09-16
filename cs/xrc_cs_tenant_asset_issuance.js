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

        const ITEMS_SUBLIST_ID = 'recmachcustrecord_xrc_ta_issuance_num11';
        const QTY_SUBLIST_FIELD_ID = 'custrecord_xrc_qty11';
        const QTY_AVAILABLE_SUBLIST_FIELD_ID = 'custrecord_xrc_ita_qty_available';
        const RATE_SUBLIST_FIELD_ID = 'custrecord_xrc_rate11';
        const AMOUNT_SUBLIST_FIELD_ID = 'custrecord_xrc_amount11';

        var g_isSubmitForApprovalBtnClick = false;
        var g_isApproveBtnClick = false;
        var g_isRejectBtnClick = false;


        function pageInit(context) { }

        function fieldChanged(context) {

            var currentRecord = context.currentRecord;

            var fieldId = context.fieldId;

            var sublistId = context.sublistId;

            if (sublistId === ITEMS_SUBLIST_ID) {

                if (fieldId === QTY_SUBLIST_FIELD_ID || fieldId === RATE_SUBLIST_FIELD_ID) {

                    var qty = currentRecord.getCurrentSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: QTY_SUBLIST_FIELD_ID,
                    }) || 0;

                    var rate = currentRecord.getCurrentSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: RATE_SUBLIST_FIELD_ID,
                    }) || 0;

                    // Auto compute for amount column 
                    currentRecord.setCurrentSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: AMOUNT_SUBLIST_FIELD_ID,
                        value: (qty * rate),
                    });


                }

            }

        }

        function validateLine(context) {

            var currentRecord = context.currentRecord;

            var sublistId = context.sublistId;

            if (sublistId === ITEMS_SUBLIST_ID) {

                var qty_available = currentRecord.getCurrentSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: QTY_AVAILABLE_SUBLIST_FIELD_ID,
                });

                var qty = currentRecord.getCurrentSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: QTY_SUBLIST_FIELD_ID,
                });

                // Show insufficient message if qty is greter than the qty available
                if (qty > qty_available) {

                    alert('Insufficient available quantities.');

                    return false;

                }

            }

            return true;

        }

        function onSubmitForApprovalBtnClick() {

            var currentRecord = m_currentRecord.get();

            // Check if the button is already clicked
            // This is to prevent calling the link multiple times
            if (!g_isSubmitForApprovalBtnClick) {

                g_isSubmitForApprovalBtnClick = true;

                // Redirect to the approval link
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1754&deploy=1&action=submitforapproval&id=" + currentRecord.id;

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
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1754&deploy=1&action=approve&id=" + currentRecord.id + "&field=" + approve_field;


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
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1754&deploy=1&action=reject&id=" + currentRecord.id;

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