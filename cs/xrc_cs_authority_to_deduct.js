/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 07, 2024
 * 
 */
define(['N/record', 'N/currentRecord'],

    function (record, currRec) {

        const PARAM_ORIGIN_ID = 'origin_id';
        const FUND_REQUEST_TYPE_ID = 'customrecord_xrc_fund_request';
        const FR_REQUESTOR_FIELD_ID = 'custrecord_xrc_requestor';
        const FUND_CUSTODIAN_FIELD_ID = 'custrecord_xrc_fund_custodian3';
        const FUND_REQUEST_NUMBER_FIELD_ID = 'custrecord_xrc_fund_req3';

        var g_isSubmitForApprovalBtnClick = false;
        var g_isApproveBtnClick = false;
        var g_isRejectBtnClick = false;
        var g_isReceiveBtnClick = false;
        var g_isCancelBtnClick = false;
        var g_isApproveCancelBtnClick = false;


        function pageInit(context) {

            var currentRecord = context.currentRecord;

            // Get the origin id of the transaction if there's any
            var origin_id = getParameterWithId(PARAM_ORIGIN_ID);

            // Null check
            if (origin_id) {

                initiateAuthorityToDeduct(origin_id, currentRecord);

            }

        }

        function postSourcing(context) {

            var currentRecord = context.currentRecord;

            var fieldId = context.fieldId;

            if (fieldId === FUND_CUSTODIAN_FIELD_ID) {

                // Get the origin id of the transaction if there's any
                var origin_id = getParameterWithId(PARAM_ORIGIN_ID);

                if (origin_id) {

                    // Load Fund Request record
                    var fr_rec = record.load({
                        type: FUND_REQUEST_TYPE_ID,
                        id: getParameterWithId(PARAM_ORIGIN_ID),
                    });

                    currentRecord.setValue(FUND_REQUEST_NUMBER_FIELD_ID, fr_rec.id);

                }

            }

        }

        function initiateAuthorityToDeduct(origin_id, currentRecord) {

            // Load Fund Request record
            var fr_rec = record.load({
                type: FUND_REQUEST_TYPE_ID,
                id: origin_id,
            });

            console.log(fr_rec.id);

            // Setting values

            currentRecord.setValue(FUND_CUSTODIAN_FIELD_ID, fr_rec.getValue(FR_REQUESTOR_FIELD_ID));

            currentRecord.setValue(FUND_REQUEST_NUMBER_FIELD_ID, fr_rec.id);

        }

        function getParameterWithId(param_id) {

            var url = new URL(window.location.href);

            var value = url.searchParams.get(param_id);

            return value;

        }

        function onSubmitForApprovalBtnClick() {

            var currentRecord = currRec.get();

            // Check if the button is already clicked
            // This is to prevent calling the link multiple times
            if (!g_isSubmitForApprovalBtnClick) {

                g_isSubmitForApprovalBtnClick = true;

                // Redirect to the approval link
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1518&deploy=1&action=submitforapproval&id=" + currentRecord.id;

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
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1518&deploy=1&action=approve&id=" + currentRecord.id + "&field=" + approve_field;


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
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1518&deploy=1&action=reject&id=" + currentRecord.id;

            } else {

                alert('You have already submitted the form.');

            }

        }

        function onReceiveBtnClick() {

            var currentRecord = currRec.get();

            // Check if the button is already clicked
            // This is to prevent calling the link multiple times
            if (!g_isReceiveBtnClick) {

                g_isReceiveBtnClick = true;

                // Redirect to the approval link
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1518&deploy=1&action=receive&recType=" + currentRecord.type + "&id=" + currentRecord.id;

            } else {

                alert('You have already submitted the form.');

            }

        }

        function onCancelBtnClick() {

            var currentRecord = currRec.get();

            // Check if the button is already clicked
            // This is to prevent calling the link multiple times
            if (!g_isCancelBtnClick) {

                g_isCancelBtnClick = true;

                // Redirect to the approval link
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1518&deploy=1&action=cancel&recType=" + currentRecord.type + "&id=" + currentRecord.id;

            } else {

                alert('You have already submitted the form.');

            }

        }

        function onApproveCancelBtnClick() {

            var currentRecord = currRec.get();

            // Check if the button is already clicked
            // This is to prevent calling the link multiple times
            if (!g_isApproveCancelBtnClick) {

                g_isApproveCancelBtnClick = true;

                // Redirect to the approval link
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1518&deploy=1&action=approvecancel&recType=" + currentRecord.type + "&id=" + currentRecord.id;

            } else {

                alert('You have already submitted the form.');

            }

        }

        return {
            pageInit: pageInit,
            postSourcing: postSourcing,
            onSubmitForApprovalBtnClick: onSubmitForApprovalBtnClick,
            onApproveBtnClick: onApproveBtnClick,
            onRejectBtnClick: onRejectBtnClick,
            onReceiveBtnClick: onReceiveBtnClick,
            onCancelBtnClick: onCancelBtnClick,
            onApproveCancelBtnClick: onApproveCancelBtnClick,
        };
    }
);