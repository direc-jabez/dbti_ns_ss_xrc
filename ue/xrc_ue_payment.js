/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Sept. 24, 2024
 * 
 */
define(['N/record', 'N/search'],

    function (record, search) {

        const APPLY_SUBLIST_ID = 'apply';
        const APPLY_SUBLIST_FIELD_ID = 'apply';
        const INTERNAL_ID_SUBLIST_FIELD_ID = 'internalid';
        const ORIG_AMT_SUBLIST_FIELD_ID = 'total';
        const PAYMENT_SUBLIST_FIELD_ID = 'amount';
        const BILLING_SCHEDULE_RECORD_TYPE_FIELD_ID = 'customrecord_xrc_escalation_schedule';
        const BSCHED_SOA_PAYMENT_FIELD_ID = 'custrecordxrc_bes_soa_pay';
        const BSCHED_SOA_UNPAID_BALANCE_FIELD_ID = 'custrecord_xrc_bes_unpaid_bal';


        function afterSubmit(context) {

            var newRecord = context.newRecord;

            try {

                // Check if the context is on CREATE
                if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.EDIT) {

                    var apply_lines = newRecord.getLineCount({
                        sublistId: APPLY_SUBLIST_ID,
                    });

                    for (var line = 0; line < apply_lines; line++) {

                        var apply = newRecord.getSublistValue({
                            sublistId: APPLY_SUBLIST_ID,
                            fieldId: APPLY_SUBLIST_FIELD_ID,
                            line: line,
                        });

                        // Check if Apply is ticked
                        if (apply) {

                            var inv_id = newRecord.getSublistValue({
                                sublistId: APPLY_SUBLIST_ID,
                                fieldId: INTERNAL_ID_SUBLIST_FIELD_ID,
                                line: line,
                            });

                            var orig_amount = newRecord.getSublistValue({
                                sublistId: APPLY_SUBLIST_ID,
                                fieldId: ORIG_AMT_SUBLIST_FIELD_ID,
                                line: line,
                            });

                            var payment = newRecord.getSublistValue({
                                sublistId: APPLY_SUBLIST_ID,
                                fieldId: PAYMENT_SUBLIST_FIELD_ID,
                                line: line,
                            });

                            var inv_fieldLookUp = search.lookupFields({
                                type: record.Type.INVOICE,
                                id: inv_id, // Invoice id
                                columns: [
                                    'custbody_xrc_bill_sched_link',
                                    'custbody_xrc_bill_sched_link.custrecord_xrc_esc_sched_estimate',
                                    'custbody_xrc_bill_sched_link.custrecord_xrc_esc_sched_lease_period',
                                    'custbody_xrc_bill_sched_link.custrecord_xrc_bes_interestrate',
                                    'custbody_xrc_bill_sched_link.custrecordxrc_bes_soa_pay',
                                ],
                            });

                            // From field lookup, historical payment in Billing Schedule record
                            var bsched_soa_payment = parseFloat(inv_fieldLookUp['custbody_xrc_bill_sched_link.custrecordxrc_bes_soa_pay']) || 0;

                            var new_soa_payment = bsched_soa_payment + payment;

                            // Updating SOA Payment and SOA Unpaid Balance
                            record.submitFields({
                                type: BILLING_SCHEDULE_RECORD_TYPE_FIELD_ID,
                                id: inv_fieldLookUp['custbody_xrc_bill_sched_link'][0].value,
                                values: {
                                    [BSCHED_SOA_PAYMENT_FIELD_ID]: new_soa_payment,
                                    [BSCHED_SOA_UNPAID_BALANCE_FIELD_ID]: orig_amount - new_soa_payment,
                                },
                                options: {
                                    enableSourcing: true,
                                    ignoreMandatoryFields: true
                                }
                            });

                        }

                    }

                }

            } catch (error) {

                log.debug('error', error);

            }

        }

        return {
            afterSubmit: afterSubmit,
        };
    }
);