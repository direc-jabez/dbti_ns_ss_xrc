/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Sept. 25, 2024
 * 
 */
define(['N/currentRecord'],

    function (m_currentRecord) {

        const LINE_SUBLIST_ID = 'line';
        const ACCOUNT_TYPE_FIELD_ID = 'custcol_xrc_account_type';
        const AR_TYPE_ID = '2';
        const ENTITY_NAME_SUBLIST_FIELD_ID = 'entity';
        const LOCATION_SUBLIST_FIELD_ID = 'location';
        const CLASS_SUBLIST_FIELD_ID = 'class';
        const DEPARTMENT_SUBLIST_FIELD_ID = 'department';

        var g_isSubmitForApprovalBtnClick = false;
        var g_isApproveBtnClick = false;
        var g_isRejectBtnClick = false;


        function pageInit(context) {

        }

        function validateLine(context) {

            var currentRecord = context.currentRecord;

            var sublistName = context.sublistId;

            if (sublistName === LINE_SUBLIST_ID) {

                var location = currentRecord.getCurrentSublistValue({
                    sublistId: LINE_SUBLIST_ID,
                    fieldId: LOCATION_SUBLIST_FIELD_ID,
                });

                var department = currentRecord.getCurrentSublistValue({
                    sublistId: LINE_SUBLIST_ID,
                    fieldId: DEPARTMENT_SUBLIST_FIELD_ID,
                });

                var line_class = currentRecord.getCurrentSublistValue({
                    sublistId: LINE_SUBLIST_ID,
                    fieldId: CLASS_SUBLIST_FIELD_ID,
                });

                if (!location) {
                    alert("Location is required.");
                    return false;
                }

                if (!department) {
                    alert("Department is required.");
                    return false;
                }

                if (!line_class) {
                    alert("Class is required.");
                    return false;
                }

                var account_type = currentRecord.getCurrentSublistValue({
                    sublistId: LINE_SUBLIST_ID,
                    fieldId: ACCOUNT_TYPE_FIELD_ID,
                });

                var entity = currentRecord.getCurrentSublistValue({
                    sublistId: LINE_SUBLIST_ID,
                    fieldId: ENTITY_NAME_SUBLIST_FIELD_ID,
                });

                if (account_type === AR_TYPE_ID && !entity) {

                    alert('Entity Name is required on Accounts Receivable accounts.');

                    return false;

                }

            }

            return true;

        }

        function onSubmitForApprovalBtnClick(role_to_email) {

            var currentRecord = m_currentRecord.get();

            // Check if the button is already clicked
            // This is to prevent calling the link multiple times
            if (!g_isSubmitForApprovalBtnClick) {

                g_isSubmitForApprovalBtnClick = true;

                // Redirect to the approval link
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1653&deploy=1&action=submitforapproval&id=" + currentRecord.id + "&role_to_email=" + role_to_email;

            } else {

                alert('You have already submitted the form.');

            }


        }

        function onApproveBtnClick(approve_field, role_to_email) {

            var currentRecord = m_currentRecord.get();

            // Check if the button is already clicked
            // This is to prevent calling the link multiple times
            if (!g_isApproveBtnClick) {

                g_isApproveBtnClick = true;

                // Redirect to the approval link
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1653&deploy=1&action=approve&id=" + currentRecord.id + "&field=" + approve_field + "&role_to_email=" + role_to_email;

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
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1653&deploy=1&action=reject&id=" + currentRecord.id;

            } else {

                alert('You have already submitted the form.');

            }

        }

        return {
            pageInit: pageInit,
            validateLine: validateLine,
            onSubmitForApprovalBtnClick: onSubmitForApprovalBtnClick,
            onApproveBtnClick: onApproveBtnClick,
            onRejectBtnClick: onRejectBtnClick,
        };
    }
);