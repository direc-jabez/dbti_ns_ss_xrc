/**
*@NApiVersion 2.1
*@NScriptType Restlet
*/
define(['N/record', 'N/redirect', 'N/runtime', 'N/format'],

    function (record, redirect, runtime, format) {

        const SUBMIT_FOR_APPROVAL_ACTION_ID = 'submitforapproval';
        const APPROVE_ACTION_ID = 'approve';
        const REJECT_ACTION_ID = 'reject';
        const LEASE_BILLING_NOTICE_RECORD_TYPE = 'customrecord_xrc_lease_billing_notice';
        const FOR_APPROVAL_FIELD_ID = 'custrecord_xrc_lbn_for_approval';
        const STATUS_FIELD_ID = 'custrecord_xrc_lbn_approval_status';
        const PENDING_APPROVAL_STATUS = '1';
        const APPROVED_STATUS = '2';
        const REJECTED_STATUS = '3';
        const APPROVAL_TWO_FIELD_ID = 'custrecord_xrc_lbn_approval_2';
        const REJECT_FIELD_ID = 'custrecord_xrc_lbn_rejected';


        function _get(context) {

            var action = context.action;

            var field = context.field;

            // Loading Tenant Asset Pullout
            var rec = record.load({
                type: LEASE_BILLING_NOTICE_RECORD_TYPE,
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

                if (field === APPROVAL_TWO_FIELD_ID) {

                    rec.setValue(STATUS_FIELD_ID, APPROVED_STATUS);

                }

            } else if (action === REJECT_ACTION_ID) {

                rec.setValue(STATUS_FIELD_ID, REJECTED_STATUS);

                rec.setValue(FOR_APPROVAL_FIELD_ID, false);

                rec.setValue(REJECT_FIELD_ID, true);

                var fields = ['custrecord_xrc_lbn_approval_1', 'custrecord_xrc_lbn_approval_2'];

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
                type: LEASE_BILLING_NOTICE_RECORD_TYPE,
                id: context.id,
            });

        }

        function getApproverFieldId(field) {

            var approvers = {
                'custrecord_xrc_lbn_approval_1': 'custrecord_xrc_lbn_approver_1',
                'custrecord_xrc_lbn_approval_2': 'custrecord_xrc_lbn_approver_2',
            };

            return approvers[field];

        }

        return {
            get: _get,
        };

    }
);