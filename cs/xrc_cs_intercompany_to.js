/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 12, 2024
 * 
 */
define(['N/currentRecord'],

    function (m_currentRecord) {

        const ITEM_SUBLSIT_ID = 'item';
        const INTERCO_TO_RECORD_TYPE = 'intercompanytransferorder';
        const TRANSFER_PRICE_FIELD_ID = 'rate';
        const AVERAGE_COST_FIELD_ID = 'averagecost';


        var g_isSubmitForApprovalBtnClick = false;


        function pageInit(context) { }

        function onSubmitForApprovalBtnClick(role_to_email) {

            var currentRecord = m_currentRecord.get();

            // Check if the button is already clicked
            // This is to prevent calling the link multiple times
            if (!g_isSubmitForApprovalBtnClick) {

                g_isSubmitForApprovalBtnClick = true;

                // Redirect to the approval link
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1648&deploy=1&action=submitforapproval&id=" + currentRecord.id + "&role_to_email=" + role_to_email;

            } else {

                alert('You have already submitted the form.');

            }

        }

        function validateLine(context) {

            var currentRecord = context.currentRecord;

            console.log(currentRecord.type);

            var sublistId = context.sublistId;

            if (sublistId === ITEM_SUBLSIT_ID && currentRecord.type === INTERCO_TO_RECORD_TYPE) {

                var average_cost = currentRecord.getCurrentSublistValue({
                    sublistId: sublistId,
                    fieldId: AVERAGE_COST_FIELD_ID,
                });

                var transfer_price = currentRecord.getCurrentSublistValue({
                    sublistId: sublistId,
                    fieldId: TRANSFER_PRICE_FIELD_ID,
                });

                if (transfer_price !== average_cost) {

                    alert('Average Cost and Transfer price must be equal on Intercompany Transfer Orders.');

                    return false;

                }
            }

            return true;
        }

        return {
            pageInit: pageInit,
            validateLine: validateLine,
            onSubmitForApprovalBtnClick: onSubmitForApprovalBtnClick,
        };
    }
);