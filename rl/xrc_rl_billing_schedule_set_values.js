/**
 * 
*@NApiVersion 2.1
*@NScriptType Restlet
*/
define(['N/record', 'N/redirect', 'N/runtime'],

    function (record, redirect, runtime) {

        const BILLING_SCHEDULE_RECORD_TYPE = 'customrecord_xrc_escalation_schedule';
        const FOR_APPROVAL_FIELD_ID = 'custrecord_xrc_bes_for_approval';
        const SUBMIT_FOR_APPROVAL_ACTION_ID = 'submitforapproval';
        const CHECKED_ACTION_ID = 'checked';
        const APPROVE_ACTION_ID = 'approve';
        const REJECT_ACTION_ID = 'reject';
        const STATUS_FIELD_ID = 'custrecord_xrc_status7';
        const PENDING_APPROVAL_STATUS = '1';
        const APPROVED_STATUS = '2';
        const REJECT_STATUS = '3';
        const APPROVAL_ONE_FIELD_ID = 'custrecord_xrc_bes_approval1';
        const APPROVAL_TWO_FIELD_ID = 'custrecord_xrc_bes_approval2';
        const REJECT_FIELD_ID = 'custrecord_xrc_bes_rejected';
        const CHECKED_FIELD_ID = 'custrecord_xrc_esc_sched_checked';


        function _get(context) {

            var action = context.action;

            var field = context.field;

            // Loading Initial SOA record
            var rec = record.load({
                type: BILLING_SCHEDULE_RECORD_TYPE,
                id: context.id,
                isDynamic: true,
            });

            var approval_status = rec.getValue(STATUS_FIELD_ID);

            if (action === SUBMIT_FOR_APPROVAL_ACTION_ID) {

                rec.setValue(FOR_APPROVAL_FIELD_ID, true);

                rec.setValue(STATUS_FIELD_ID, PENDING_APPROVAL_STATUS);

                if (approval_status === REJECT_STATUS) {

                    rec.setValue(REJECT_FIELD_ID, false);

                }

            } else if (action === CHECKED_ACTION_ID) {

                rec.setValue(CHECKED_FIELD_ID, true);

            } else if (action === APPROVE_ACTION_ID) {

                rec.setValue(field, true);

                rec.setValue(getApproverFieldId(field), runtime.getCurrentUser().id);

                if (field === APPROVAL_ONE_FIELD_ID) {

                    rec.setValue(STATUS_FIELD_ID, APPROVED_STATUS);

                }

            } else if (action === REJECT_ACTION_ID) {

                rec.setValue(STATUS_FIELD_ID, REJECT_STATUS);

                rec.setValue(FOR_APPROVAL_FIELD_ID, false);

                rec.setValue(REJECT_FIELD_ID, true);

                var fields = ['custrecord_xrc_bes_approval1'];

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
                type: BILLING_SCHEDULE_RECORD_TYPE,
                id: context.id,
            });

        }


        function getApproverFieldId(field) {

            var approvers = {
                'custrecord_xrc_bes_approval1': 'custrecord_xrc_bes_approver1',
            };

            return approvers[field];

        }

        return {
            get: _get,
        };
    }
);
