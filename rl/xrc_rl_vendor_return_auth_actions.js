/**
 * 
*@NApiVersion 2.1
*@NScriptType Restlet
*/
define(['N/record', 'N/redirect', 'N/runtime'],

    function (record, redirect, runtime) {

        const FOR_APPROVAL_FIELD_ID = 'custbody_xrc_for_approval';
        const SUBMIT_FOR_APPROVAL_ACTION_ID = 'submitforapproval';
        const APPROVE_ACTION_ID = 'approve';
        const REJECT_ACTION_ID = 'reject';
        const STATUS_FIELD_ID = 'approvalstatus';
        const PENDING_APPROVAL_STATUS = '1';
        const APPROVED_STATUS = '2';
        const REJECT_STATUS = '3';
        const APPROVAL_ONE_FIELD_ID = 'custbody_xrc_approval1';
        const REJECT_FIELD_ID = 'custbody1';


        function _get(context) {

            var action = context.action;

            var field = context.field;

            // Loading Tenant Asset Pullout
            var rec = record.load({
                type: record.Type.VENDOR_RETURN_AUTHORIZATION,
                id: context.id,
                isDynamic: true,
            });

            if (action === SUBMIT_FOR_APPROVAL_ACTION_ID) {

                rec.setValue(FOR_APPROVAL_FIELD_ID, true);

                var rejected = rec.getValue(REJECT_FIELD_ID);

                if (rejected) {

                    rec.setValue(REJECT_FIELD_ID, false);

                }

            } else if (action === APPROVE_ACTION_ID) {

                rec.setValue(field, true);

                rec.setValue(getApproverFieldId(field), runtime.getCurrentUser().id);


            } else if (action === REJECT_ACTION_ID) {

                rec.setValue(FOR_APPROVAL_FIELD_ID, false);

                rec.setValue(REJECT_FIELD_ID, true);

                var fields = ['custbody_xrc_approval1'];

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
                type: record.Type.VENDOR_RETURN_AUTHORIZATION,
                id: context.id,
            });

        }

        function getApproverFieldId(field) {

            var approvers = {
                'custbody_xrc_approval1': 'custbody_xrc_approver1',
            };

            return approvers[field];

        }

        return {
            get: _get,
        };
    }
);
