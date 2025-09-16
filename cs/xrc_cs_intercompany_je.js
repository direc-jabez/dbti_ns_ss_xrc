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

        const LINE_SUBLIST_ID = 'line';
        const LOCATION_SUBLIST_FIELD_ID = 'location';
        const DEPARTMENT_SUBLIST_FIELD_ID = 'department';
        var g_isSubmitForApprovalBtnClick = false;
        var g_isApproveBtnClick = false;
        var g_isRejectBtnClick = false;


        function pageInit(context) { }

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

                if (!location) {
                    alert("Location is required.");
                    return false;
                }

                if (!department) {
                    alert("Department is required.");
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
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1644&deploy=1&action=submitforapproval&id=" + currentRecord.id;

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
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1644&deploy=1&action=approve&id=" + currentRecord.id + "&field=" + approve_field;


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
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1644&deploy=1&action=reject&id=" + currentRecord.id;

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