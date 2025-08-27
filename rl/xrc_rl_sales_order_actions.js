/**
 * 
*@NApiVersion 2.1
*@NScriptType Restlet
*/
define(['N/record', 'N/redirect', 'N/runtime'],

    function (record, redirect, runtime) {

        const ITEM_SUBLIST_ID = 'item';
        const CLOSED_SUBLIST_FIELD_ID = 'isclosed';
        const SPACE_NO_FIELD_ID = 'custbody_xrc_space_num';
        const LEASABLE_SPACE_RECORD_TYPE = 'customrecord_xrc_leasable_spaces';
        const LS_LEASE_STATUS_FIELD_ID = 'custrecord_xrc_ls_lease_status';
        const LS_VACANT_STATUS_ID = '2';
        const ESCALATION_SCHEDULE_SUBLIST_ID = 'recmachcustrecord_xrc_esc_sched_estimate';
        const FINAL_SOA_FIELD_ID = 'custbody_xrc_final_soa';
        const TRANID_FIELD_ID = 'tranid';
        const SUBSIDIARY_FIELD_ID = 'subsidiary';
        const NOTIF_TYPE_REMINDER = 1;
        const NOTIF_TYPE_APPROVED = 2;
        const NOTIF_TYPE_REJECTED = 3;
        const PREPARED_BY_FIELD_ID = 'custbody_xrc_prepared_by';

        function _get(context) {

            // Loading Sales Order
            var rec = record.load({
                type: record.Type.SALES_ORDER,
                id: context.id,
            });

            var items_line_count = rec.getLineCount({
                sublistId: ITEM_SUBLIST_ID,
            });

            for (var line = 0; line < items_line_count; line++) {

                rec.setSublistValue({
                    sublistId: ITEM_SUBLIST_ID,
                    fieldId: CLOSED_SUBLIST_FIELD_ID,
                    line: line,
                    value: true,
                });

            }

            rec.setValue(FINAL_SOA_FIELD_ID, true);

            var space_no = rec.getValue(SPACE_NO_FIELD_ID);

            if (space_no) {

                // On Lease Memorandum close, update tagged FAM record
                record.submitFields({
                    type: LEASABLE_SPACE_RECORD_TYPE,
                    id: space_no,
                    values: {
                        [LS_LEASE_STATUS_FIELD_ID]: LS_VACANT_STATUS_ID,
                    },
                    options: {
                        ignoreMandatoryFields: true
                    }
                });

            }

            var bsched_line_count = rec.getLineCount({
                sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
            });

            // Loop backward to avoid index issues when removing lines
            for (var line = bsched_line_count - 1; line >= 0; line--) {
                rec.removeLine({
                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    line: line,
                    ignoreRecalc: true
                });
            }

            rec.save({
                ignoreMandatoryFields: true,
            });

            redirect.toRecord({
                type: record.Type.SALES_ORDER,
                id: context.id,
            });

        }

        return {
            get: _get,
        };
    }
);
