/**
*@NApiVersion 2.1
*@NScriptType Restlet
*/
define(['N/record', 'N/redirect', 'N/runtime'],

    function (record, redirect, runtime) {

        const ATD_RECORD_TYPE_ID = 'customrecord_xrc_auth_to_deduct';
        const SUBMIT_FOR_APPROVAL_ACTION_ID = 'submitforapproval';
        const APPROVE_ACTION_ID = 'approve';
        const REJECT_ACTION_ID = 'reject';
        const ATD_ACTION_RECEIVE = 'receive';
        const ATD_ACTION_CANCEL = 'cancel';
        const ATD_ACTION_APPROVE_CANCEL = 'approvecancel';
        const FOR_APPROVAL_FIELD_ID = 'custrecord_xrc_atd_for_approval';
        const REJECT_FIELD_ID = 'custrecord_xrc_atd_rejected';
        const ATD_STATUS_FIELD_ID = 'custrecord_xrc_atd_status';
        const ATD_STATUS_PENDING_APPROVAL_ID = '1';
        const ATD_STATUS_APPROVED_ID = '2';
        const ATD_STATUS_RECEIVED_ID = '3';
        const ATD_STATUS_REQUEST_FOR_CANCELLATION_ID = '4';
        const ATD_STATUS_CANCELLED_ID = '5';
        const REJECTED_STATUS = '6';
        const APPROVAL_ONE_FIELD_ID = 'custrecord_xrc_atd_approval1';


        function _get(context) {

            var action = context.action;

            var field = context.field;

            var rec = record.load({
                type: ATD_RECORD_TYPE_ID,
                id: context.id,
                isDynamic: true,
            });

            var approval_status = rec.getValue(ATD_STATUS_FIELD_ID);

            if (action === SUBMIT_FOR_APPROVAL_ACTION_ID) {

                rec.setValue(FOR_APPROVAL_FIELD_ID, true);

                rec.setValue(REJECT_FIELD_ID, false);

                if (approval_status === REJECTED_STATUS) {

                    rec.setValue(ATD_STATUS_FIELD_ID, ATD_STATUS_PENDING_APPROVAL_ID);

                }

            } else if (action === APPROVE_ACTION_ID) {

                rec.setValue(field, true);

                rec.setValue(getApproverFieldId(field), runtime.getCurrentUser().id);

                if (field === APPROVAL_ONE_FIELD_ID) {

                    rec.setValue(ATD_STATUS_FIELD_ID, ATD_STATUS_APPROVED_ID);

                }

            } else if (action === REJECT_ACTION_ID) {

                rec.setValue(ATD_STATUS_FIELD_ID, REJECTED_STATUS);

                rec.setValue(FOR_APPROVAL_FIELD_ID, false);

                rec.setValue(REJECT_FIELD_ID, true);

                var fields = ['custrecord_xrc_atd_approval1'];

                for (var i = 0; i < fields.length; i++) {

                    var isChecked = rec.getValue(fields[i]);

                    if (!isChecked) {

                        break;

                    }

                    rec.setValue(fields[i], false);

                }

            } else if (action === ATD_ACTION_RECEIVE) {

                rec.setValue(ATD_STATUS_FIELD_ID, ATD_STATUS_RECEIVED_ID);

            } else if (action === ATD_ACTION_CANCEL) {

                rec.setValue(ATD_STATUS_FIELD_ID, ATD_STATUS_REQUEST_FOR_CANCELLATION_ID);

            } else if (action === ATD_ACTION_APPROVE_CANCEL) {

                rec.setValue(ATD_STATUS_FIELD_ID, ATD_STATUS_CANCELLED_ID);

            }

            rec.save({
                ignoreMandatoryFields: true,
            });

            redirect.toRecord({
                type: ATD_RECORD_TYPE_ID,
                id: context.id,
            });

        }

        function getApproverFieldId(field) {

            var approvers = {
                'custrecord_xrc_atd_approval1': 'custrecord_xrc_approved_by3',
            };

            return approvers[field];

        }


        return {
            get: _get,
        };

    }
);