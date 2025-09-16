/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 06, 2024
 * 
 */
define(['N/currentRecord', 'N/url', 'N/search'],

    function (currRec, url, search) {

        const MODE_CREATE = 'create';
        const PURCHASE_ORDER_FIELD_ID = 'purchaseorder';
        const AMOUNT_FIELD_ID = 'payment';
        const LOCATION_FIELD_ID = 'location';

        var g_isSubmitForApprovalBtnClick = false;
        var g_isApproveBtnClick = false;
        var g_isRejectBtnClick = false;


        function pageInit(context) {

            var currentRecord = context.currentRecord;

            if (context.mode === MODE_CREATE) {

                var po_id = currentRecord.getValue(PURCHASE_ORDER_FIELD_ID);

                var po_fieldLookUp = search.lookupFields({
                    type: search.Type.PURCHASE_ORDER,
                    id: po_id,
                    columns: ['custbody_xrc_net_total', 'custbody_xrc_prepayment_percentage', 'location']
                });

                var net_amount = parseFloat(po_fieldLookUp['custbody_xrc_net_total']);

                var prepayment_percentage = parseFloat(po_fieldLookUp['custbody_xrc_prepayment_percentage']);

                var location = po_fieldLookUp['location'][0]?.value;

                if (prepayment_percentage) {

                    var payment = net_amount * (prepayment_percentage / 100);

                    currentRecord.setValue(AMOUNT_FIELD_ID, payment);

                } else {

                    currentRecord.setValue(AMOUNT_FIELD_ID, net_amount);

                }

                currentRecord.setValue(LOCATION_FIELD_ID, location);


            }

        }


        function onSubmitForApprovalBtnClick() {

            var currentRecord = currRec.get();

            // Check if the button is already clicked
            // This is to prevent calling the link multiple times
            if (!g_isSubmitForApprovalBtnClick) {

                g_isSubmitForApprovalBtnClick = true;

                // Redirect to the approval link
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1534&deploy=1&action=submitforapproval&id=" + currentRecord.id;

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
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1534&deploy=1&action=approve&id=" + currentRecord.id + "&field=" + approve_field;


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
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1534&deploy=1&action=reject&id=" + currentRecord.id;

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
            onSubmitForApprovalBtnClick: onSubmitForApprovalBtnClick,
            onApproveBtnClick: onApproveBtnClick,
            onRejectBtnClick: onRejectBtnClick,
            onPrintCheckClick: onPrintCheckClick,
        };
    }
);