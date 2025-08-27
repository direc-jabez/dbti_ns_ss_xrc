/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 *
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 07, 2024
 *
 * Updated by: DBTI - Charles Maverick Herrera
 * Date: Oct 24, 2024
 *
 */
define(["N/record", "N/currentRecord", "N/runtime", "N/search"], function (
    record,
    m_currentRecord,
    runtime,
    search
) {
    const PARAM_ORIGIN_ID = "origin_id";
    const FUND_REQUEST_TYPE_ID = "customrecord_xrc_fund_request";
    const FR_REQUESTOR_FIELD_ID = "custrecord_xrc_requestor";
    const FUND_CUSTODIAN_FIELD_ID = "custrecord_xrc_fund_custodian";
    const FUND_REQUEST_NUMBER_FIELD_ID = "custrecord_xrc_fund_req2";
    const FR_BALANCE_FIELD_ID = 'custrecord_xrc_balance';
    const AMOUNT_FIELD_ID = 'custrecord_xrc_amount1';

    const MODE_COPY = "copy";
    const PREPARED_BY_FLD_ID = "custrecord_dbti_prepared_by1";
    const APPROVED_BY_FLD_ID = "custrecord_xrc_fundret_approvedby";
    const APPROVAL_1_FLD_ID = "custrecord_xrc_fundret_approval1";
    const FOR_APPROVAL_FLD_ID = "custrecord_xrc_fundret_for_approval";
    const REJECTED_FLD_ID = "custrecord_xrc_fundret_rejected";

    var g_isSubmitForApprovalBtnClick = false;
    var g_isApproveBtnClick = false;
    var g_isRejectBtnClick = false;

    function pageInit(context) {
        var currentRecord = context.currentRecord;

        // Get the origin id of the transaction if there's any
        var origin_id = getParameterWithId(PARAM_ORIGIN_ID);

        // Null check
        if (origin_id) {
            initiateFundReturn(origin_id, currentRecord);
        }

        if (context.mode === MODE_COPY) {
            var currentRecord = context.currentRecord;
            var currentUser = runtime.getCurrentUser();
            currentRecord.setValue(PREPARED_BY_FLD_ID, currentUser.id);
            currentRecord.setValue(APPROVED_BY_FLD_ID, "");
            currentRecord.setValue(APPROVAL_1_FLD_ID, false);
            currentRecord.setValue(FOR_APPROVAL_FLD_ID, false);
            currentRecord.setValue(REJECTED_FLD_ID, false);
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

    function saveRecord(context) {

        var currentRecord = context.currentRecord;

        var fr_id = currentRecord.getValue(FUND_REQUEST_NUMBER_FIELD_ID);

        var fr_fieldLookUp = search.lookupFields({
            type: FUND_REQUEST_TYPE_ID,
            id: fr_id,
            columns: [FR_BALANCE_FIELD_ID],
        });

        var amount = currentRecord.getValue(AMOUNT_FIELD_ID);

        var fr_balance = parseFloat(fr_fieldLookUp[FR_BALANCE_FIELD_ID]);

        if (amount > fr_balance) {

            alert("Amount to return cannot be greater than the Fund Request's balance.");

            return false;

        }

        return true;

    }

    function initiateFundReturn(origin_id, currentRecord) {
        // Load Fund Request record
        var fr_rec = record.load({
            type: FUND_REQUEST_TYPE_ID,
            id: origin_id,
        });

        console.log(fr_rec.id);

        // Setting values

        currentRecord.setValue(
            FUND_CUSTODIAN_FIELD_ID,
            fr_rec.getValue(FR_REQUESTOR_FIELD_ID)
        );

        currentRecord.setValue(FUND_REQUEST_NUMBER_FIELD_ID, fr_rec.id);
    }

    function getParameterWithId(param_id) {
        var url = new URL(window.location.href);

        var value = url.searchParams.get(param_id);

        return value;
    }

    function onSubmitForApprovalBtnClick() {
        var currentRecord = m_currentRecord.get();

        // Check if the button is already clicked
        // This is to prevent calling the link multiple times
        if (!g_isSubmitForApprovalBtnClick) {
            g_isSubmitForApprovalBtnClick = true;

            // Redirect to the approval link
            window.location.href =
                "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1639&deploy=1&action=submitforapproval&id=" +
                currentRecord.id;
        } else {
            alert("You have already submitted the form.");
        }
    }

    function onApproveBtnClick(approve_field) {
        var currentRecord = m_currentRecord.get();

        // Check if the button is already clicked
        // This is to prevent calling the link multiple times
        if (!g_isApproveBtnClick) {
            g_isApproveBtnClick = true;

            // Redirect to the approval link
            window.location.href =
                "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1639&deploy=1&action=approve&id=" +
                currentRecord.id +
                "&field=" +
                approve_field;
        } else {
            alert("You have already submitted the form.");
        }
    }

    function onRejectBtnClick() {
        var currentRecord = m_currentRecord.get();

        // Check if the button is already clicked
        // This is to prevent calling the link multiple times
        if (!g_isRejectBtnClick) {
            g_isRejectBtnClick = true;

            // Redirect to the approval link
            window.location.href =
                "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1639&deploy=1&action=reject&id=" +
                currentRecord.id;
        } else {
            alert("You have already submitted the form.");
        }
    }

    return {
        pageInit: pageInit,
        postSourcing: postSourcing,
        saveRecord: saveRecord,
        onSubmitForApprovalBtnClick: onSubmitForApprovalBtnClick,
        onApproveBtnClick: onApproveBtnClick,
        onRejectBtnClick: onRejectBtnClick,
    };
});
