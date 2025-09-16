/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 05, 2024
 * 
 */
define(['N/record', 'N/search', 'N/currentRecord'],

    function (record, search, m_currentRecord) {

        const MODE_CREATE = 'create';
        const ASSETS_SUBLIST_ID = 'recmachcustrecord_xrc_issuance_link';
        const ASSET_SUBLIST_FIELD_ID = 'custrecord_xrc_asset';
        const FAM_RECORD_TYPE_ID = 'customrecord_ncfar_asset';
        const CUSTOM_FORM_FIELD_ID = 'customform';
        const IT_FORM_FIELD_ID = '406';
        const FOR_IT_FIELD_ID = 'custrecord_xrc_asset_rcp_for_it';

        var g_isSubmitForApprovalBtnClick = false;
        var g_isApproveBtnClick = false;
        var g_isRejectBtnClick = false;
        var g_isReturnBtnClick = false;


        function pageInit(context) {

            var currentRecord = context.currentRecord;

            if (context.mode === MODE_CREATE) {

                var custom_form = currentRecord.getValue(CUSTOM_FORM_FIELD_ID);

                if (custom_form === IT_FORM_FIELD_ID) {

                    currentRecord.setValue(FOR_IT_FIELD_ID, true);

                }
            }


        }

        function validateLine(context) {

            var currentRecord = context.currentRecord;

            var sublistId = context.sublistId;

            if (sublistId === ASSETS_SUBLIST_ID) {

                var asset = currentRecord.getCurrentSublistValue({
                    sublistId: ASSETS_SUBLIST_ID,
                    fieldId: ASSET_SUBLIST_FIELD_ID,
                });

                var fam_fieldLookUp = search.lookupFields({
                    type: FAM_RECORD_TYPE_ID,
                    id: asset,
                    columns: ['custrecord_xrc_fam_returned'],
                });

                var returned = fam_fieldLookUp['custrecord_xrc_fam_returned'];

                if (!returned) {

                    alert('Asset has not yet been returned. Please contact your administrator.');

                    return false;

                }


                // Fields reference from FAM Asset record
                var columns = ['custrecord_xrc_fa_itqpmnt_brand', 'custrecord_xrc_fam_hw_model', 'custrecord_xrc_fam_hw_type', 'custrecord_xrc_fam_hw_sn', 'custrecord_xrc_fam_hw_casing', 'custrecord_xrc_fam_hw_hard_disk', 'custrecord_xrc_fam_hw_processor', 'custrecord_xrc_fam_hw_memory', 'custrecord_xrc_fam_hw_optical_drive', 'custrecord_xrc_fam_hw_keyboard', 'custrecord_xrc_fam_hw_touch_pad', 'custrecord_xrc_fam_hw_monitor', 'custrecord_xrc_fam_hw_charger', 'custrecord_xrc_fam_hw_web_cam', 'custrecord_xrc_fa_itqpmnt_win_os', 'custrecord_xrc_fam_sw_ms_office', 'custrecord_xrc_fam_hw_pdf_reader', 'custrecord_xrc_fam_sw_browser', 'custrecord_xrc_fam_sw_player', 'custrecord_xrc_fam_sw_rem_acc_viewer', 'custrecord_xrc_fam_sw_anti_virus', 'custrecord_xrc_fam_sw_applications', 'custrecord_xrc_fa_itqpmnt_charger', 'custrecord_xrc_fam_acc_laptop_bag'];

                // Getting the values of the fields from columns
                search.lookupFields.promise({
                    type: FAM_RECORD_TYPE_ID,
                    id: asset,
                    columns: columns,
                }).then(function (result) {

                    // Fields from current record
                    var fields = ['custrecord_xrc_rcpt_brand', 'custrecord_xrc_rcpt_model', 'custrecord_xrc_rcpt_type', 'custrecord_xrc_rcpt_sn', 'custrecord_xrc_rcpt_casing', 'custrecord_xrc_rcpt_processor', 'custrecord_xrc_rcpt_hard_disk', 'custrecord_xrc_rcpt_memory', 'custrecord_xrc_rcpt_optical_drive', 'custrecord_xrc_rcpt_keyboard', 'custrecord_xrc_rcpt_touch_pad', 'custrecord_xrc_rcpt_monitor', 'custrecord_xrc_rcpt_hw_charger', 'custrecord_xrc_rcpt_web_cam', 'custrecord_xrc_rcpt_os', 'custrecord_xrc_rcpt_ms_office', 'custrecord_xrc_rcpt_pdf_reader', 'custrecord_xrc_rcpt_browser', 'custrecord_xrc_rcpt_player', 'custrecord_xrc_rcpt_rem_acc_viewer', 'custrecord_xrc_rcpt_anti_virus', 'custrecord_xrc_rcpt_applications', 'custrecord_xrc_rcpt_charger', 'custrecord_xrc_rcpt_laptop_bag'];

                    fields.forEach((field, index) => {

                        // Set the values
                        currentRecord.setValue(field, result[columns[index]]);

                    });

                });

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
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1651&deploy=1&action=submitforapproval&id=" + currentRecord.id;

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
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1651&deploy=1&action=approve&id=" + currentRecord.id + "&field=" + approve_field;


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
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1651&deploy=1&action=reject&id=" + currentRecord.id;

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