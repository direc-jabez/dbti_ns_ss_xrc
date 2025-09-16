/**
*@NApiVersion 2.1
*@NScriptType Restlet
*/
define(['N/record', 'N/search', 'N/redirect', 'N/runtime'],

    function (record, search, redirect, runtime) {

        const SUBMIT_FOR_APPROVAL_ACTION_ID = 'submitforapproval';
        const APPROVE_ACTION_ID = 'approve';
        const REJECT_ACTION_ID = 'reject';
        const TENANT_ASSET_ISSUANCE_RECORD_TYPE = 'customrecord_xrc_tenant_asset_issuance';
        const FOR_APPROVAL_FIELD_ID = 'custrecord_xrc_tai_for_approval';
        const STATUS_FIELD_ID = 'custrecord_xrc_tenant_asst_iss_status';
        const PENDING_APPROVAL_STATUS = '1';
        const APPROVED_STATUS = '2';
        const REJECTED_STATUS = '3';
        const APPROVAL_FOUR_FIELD_ID = 'custrecord_xrc_tai_approval4';
        const REJECT_FIELD_ID = 'custrecord_xrc_tai_rejected';
        const FUND_CATEGORY_FIELD_ID = 'custrecord_xrc_fund_category';


        function _get(context) {

            var action = context.action;

            var field = context.field;

            // Loading Tenant Asset Pullout
            var rec = record.load({
                type: TENANT_ASSET_ISSUANCE_RECORD_TYPE,
                id: context.id,
                isDynamic: true,
            });

            var approval_status = rec.getValue(STATUS_FIELD_ID);

            if (action === SUBMIT_FOR_APPROVAL_ACTION_ID) {

                rec.setValue(FOR_APPROVAL_FIELD_ID, true);

                rec.setValue(REJECT_FIELD_ID, false);

                if (approval_status === REJECTED_STATUS) {

                    rec.setValue(STATUS_FIELD_ID, PENDING_APPROVAL_STATUS);

                }

            } else if (action === APPROVE_ACTION_ID) {

                rec.setValue(field, true);

                rec.setValue(getApproverFieldId(field), runtime.getCurrentUser().id);

                if (field === APPROVAL_FOUR_FIELD_ID) {

                    rec.setValue(STATUS_FIELD_ID, APPROVED_STATUS);

                }

            } else if (action === REJECT_ACTION_ID) {

                rec.setValue(STATUS_FIELD_ID, REJECTED_STATUS);

                rec.setValue(FOR_APPROVAL_FIELD_ID, false);

                rec.setValue(REJECT_FIELD_ID, true);

                var fields = ['custrecord_xrc_tai_approval1', 'custrecord_xrc_tai_approval2', 'custrecord_xrc_tai_approval3', 'custrecord_xrc_tai_approval4'];

                for (var i = 0; i < fields.length; i++) {

                    var isChecked = rec.getValue(fields[i]);

                    if (!isChecked) {

                        break;

                    }

                    rec.setValue(getApproverFieldId(fields[i]), null);

                    rec.setValue(fields[i], false);

                }

            }

            rec.save({
                ignoreMandatoryFields: true,
            });

            redirect.toRecord({
                type: TENANT_ASSET_ISSUANCE_RECORD_TYPE,
                id: context.id,
            });

        }

        function getApproverFieldId(field) {

            var approvers = {
                'custrecord_xrc_tai_approval1': 'custrecord_xrc_tai_approver1',
                'custrecord_xrc_tai_approval2': 'custrecord_xrc_tai_approver2',
                'custrecord_xrc_tai_approval3': 'custrecord_xrc_tai_noted_by',
                'custrecord_xrc_tai_approval4': 'custrecord_xrc_tai_approver3',
            };

            return approvers[field];

        }

        return {
            get: _get,
        };

    }
);