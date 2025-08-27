/**
*@NApiVersion 2.1
*@NScriptType Restlet
*/
define(['N/record', 'N/search', 'N/redirect', 'N/runtime'],

    function (record, search, redirect, runtime) {

        const SUBMIT_FOR_APPROVAL_ACTION_ID = 'submitforapproval';
        const APPROVE_ACTION_ID = 'approve';
        const REJECT_ACTION_ID = 'reject';
        const FUND_RETURN_RECORD_TYPE = 'customrecord_xrc_fund_return';
        const FOR_APPROVAL_FIELD_ID = 'custrecord_xrc_fundret_for_approval';
        const STATUS_FIELD_ID = 'custrecord_xrc_fund_ret_status';
        const PENDING_APPROVAL_STATUS = '1';
        const APPROVED_STATUS = '2';
        const REJECTED_STATUS = '3';
        const APPROVAL_ONE_FIELD_ID = 'custrecord_xrc_fundret_approval1';
        const REJECT_FIELD_ID = 'custrecord_xrc_fundret_rejected';


        function _get(context) {

            var action = context.action;

            var field = context.field;

            // Loading Tenant Asset Pullout
            var rec = record.load({
                type: FUND_RETURN_RECORD_TYPE,
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

                if (field === APPROVAL_ONE_FIELD_ID) {

                    rec.setValue(STATUS_FIELD_ID, APPROVED_STATUS);

                }

            } else if (action === REJECT_ACTION_ID) {

                rec.setValue(STATUS_FIELD_ID, REJECTED_STATUS);

                rec.setValue(FOR_APPROVAL_FIELD_ID, false);

                rec.setValue(REJECT_FIELD_ID, true);

                var fields = ['custrecord_xrc_fundret_approval1'];

                for (var i = 0; i < fields.length; i++) {

                    var isChecked = rec.getValue(fields[i]);

                    if (!isChecked) {

                        break;

                    }

                    rec.setValue(fields[i], false);

                }

            }

            rec.save({
                ignoreMandatoryFields: true,
            });

            redirect.toRecord({
                type: FUND_RETURN_RECORD_TYPE,
                id: context.id,
            });

        }

        function getApproverFieldId(field) {

            var approvers = {
                'custrecord_xrc_fundret_approval1': 'custrecord_xrc_fundret_approvedby',
            };

            return approvers[field];

        }

        return {
            get: _get,
        };

    }
);