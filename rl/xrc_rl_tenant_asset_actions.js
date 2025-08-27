/**
 * 
*@NApiVersion 2.1
*@NScriptType Restlet
*/
define(['N/record', 'N/redirect', 'N/runtime'],

    function (record, redirect, runtime) {

        const SUBMIT_FOR_APPROVAL_ACTION_ID = 'submitforapproval';
        const APPROVE_ACTION_ID = 'approve';
        const REJECT_ACTION_ID = 'reject';
        const CANCEL_ACTION_ID = 'cancel';
        const TENANT_ASSET_PULLOUT_RECORD_TYPE = 'customrecord_xrc_tenant_asset_pullout';
        const TAP_STATUS_FIELD_ID = 'custrecord_xrc_status8';
        const SATUS_CANCELLED_ID = '4';
        const TENANT_ASSET_RECORD_TYPE = 'customrecord_xrc_tenant_asset';
        const INACTIVE_FIELD_ID = 'isinactive';
        const ITEMS_SUBLIST_ID = 'recmachcustrecord_xrc_ten_asset_pull_num';
        const ID_SUBLIST_FIELD_ID = 'id';
        const FOR_APPROVAL_FIELD_ID = 'custrecord_xrc_tapo_for_approval';
        const PENDING_APPROVAL_STATUS = '1';
        const APPROVED_STATUS = '2';
        const REJECTED_STATUS = '3';
        const REJECT_FIELD_ID = 'custrecord_xrc_tapo_rejected';
        const APPROVAL_THREE_FIELD_ID = 'custrecord_xrc_tapo_approval3';


        function _get(context) {

            var action = context.action;

            var field = context.field;

            // Loading Tenant Asset Pullout
            var rec = record.load({
                type: TENANT_ASSET_PULLOUT_RECORD_TYPE,
                id: context.id,
            });

            var approval_status = rec.getValue(TAP_STATUS_FIELD_ID);

            if (action === SUBMIT_FOR_APPROVAL_ACTION_ID) {

                rec.setValue(FOR_APPROVAL_FIELD_ID, true);

                rec.setValue(REJECT_FIELD_ID, false);

                if (approval_status === REJECTED_STATUS) {

                    rec.setValue(TAP_STATUS_FIELD_ID, PENDING_APPROVAL_STATUS);

                }

            } else if (action === APPROVE_ACTION_ID) {

                rec.setValue(field, true);

                rec.setValue(getApproverFieldId(field), runtime.getCurrentUser().id);

                if (field === APPROVAL_THREE_FIELD_ID) {

                    rec.setValue(TAP_STATUS_FIELD_ID, APPROVED_STATUS);

                }

            } else if (action === REJECT_ACTION_ID) {

                rec.setValue(TAP_STATUS_FIELD_ID, REJECTED_STATUS);

                rec.setValue(FOR_APPROVAL_FIELD_ID, false);

                rec.setValue(REJECT_FIELD_ID, true);

                var fields = ['custrecord_xrc_tapo_approval1', 'custrecord_xrc_tapo_approval2', 'custrecord_xrc_tapo_approval3'];

                for (var i = 0; i < fields.length; i++) {

                    var isChecked = rec.getValue(fields[i]);

                    if (!isChecked) {

                        break;

                    }

                    rec.setValue(getApproverFieldId(fields[i]), null);

                    rec.setValue(fields[i], false);

                }

            } else if (action === CANCEL_ACTION_ID) {

                cancelPullout(rec);

            }


            rec.save({
                ignoreMandatoryFields: true,
            });

            redirect.toRecord({
                type: TENANT_ASSET_PULLOUT_RECORD_TYPE,
                id: context.id,
            });

        }

        function cancelPullout(tap_rec) {

            tap_rec.setValue(TAP_STATUS_FIELD_ID, SATUS_CANCELLED_ID);

            var items_lines = tap_rec.getLineCount({
                sublistId: ITEMS_SUBLIST_ID,
            });

            for (var line = 0; line < items_lines; line++) {

                var id = tap_rec.getSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: ID_SUBLIST_FIELD_ID,
                    line: line,
                });

                // Updating the inactive flag to true
                // This will make the child records of the record unlinked
                record.submitFields({
                    type: TENANT_ASSET_RECORD_TYPE,
                    id: id,
                    values: {
                        [INACTIVE_FIELD_ID]: true,
                    },
                    options: {
                        ignoreMandatoryFields: true
                    }
                });

            }

        }

        function getApproverFieldId(field) {

            var approvers = {
                'custrecord_xrc_tapo_approval1': 'custrecord_xrc_tapo_approver1',
                'custrecord_xrc_tapo_approval2': 'custrecord_xrc_tapo_approver2',
                'custrecord_xrc_tapo_approval3': 'custrecord_xrc_tapo_approver3',
            };

            return approvers[field];

        }

        return {
            get: _get,
        };
    }
);
