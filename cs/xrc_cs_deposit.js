/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 22, 2024
 * 
 */
define(['N/record'],

    function (record) {

        const PARAM_ORIGIN_ID = 'origin_id';
        const ESCALATION_SCHEDULE_RECORD_TYPE = 'customrecord_xrc_escalation_schedule';
        const BSCHED_TENANT_FIELD_ID = 'custrecord_xrc_tenant7';
        const BSCHED_LEASE_MEMORANDUM_FIELD_ID = 'custrecord_xrc_esc_sched_estimate';
        const BSCHED_SECURITY_DEPOSIT_ADJUSTMENT_FIELD_ID = 'custrecord_xrc_esc_sched_sec_dep_adj';
        const BSCHED_LOCATION_FIELD_ID = 'custrecord_xrc_loc7';
        const CUSTOMER_FIELD_ID = 'customer';
        const LEASE_MEMORANDUM_FIELD_ID = 'salesorder';
        const PAYMENT_AMOUNT_FIELD_ID = 'payment';
        const DEPOSIT_CATEGORY_FIELD_ID = 'custbody_xrc_deposit_category';
        const SUBSIDIARY_FIELD_ID = 'subsidiary';
        const LOCATION_FIELD_ID = 'location';

        var g_bsched_rec = null;

        function pageInit(context) {

            var currentRecord = context.currentRecord;

            // Get the origin id of the transaction if there's any
            var origin_id = getParameterWithId(PARAM_ORIGIN_ID);

            // Null check
            if (origin_id) {

                initiateCustomerDeposit(origin_id, currentRecord);

            }

        }

        function postSourcing(context) {

            var currentRecord = context.currentRecord;

            var fieldId = context.fieldId;

            // Get the origin id of the transaction if there's any
            var origin_id = getParameterWithId(PARAM_ORIGIN_ID);

            // Null check
            if (origin_id) {

                if (fieldId === CUSTOMER_FIELD_ID) {

                    currentRecord.setValue(LEASE_MEMORANDUM_FIELD_ID, g_bsched_rec.getValue(BSCHED_LEASE_MEMORANDUM_FIELD_ID));

                } else if (fieldId === LEASE_MEMORANDUM_FIELD_ID) {

                    currentRecord.setValue(PAYMENT_AMOUNT_FIELD_ID, g_bsched_rec.getValue(BSCHED_SECURITY_DEPOSIT_ADJUSTMENT_FIELD_ID));

                } else if (fieldId === SUBSIDIARY_FIELD_ID) {

                    currentRecord.setValue(LOCATION_FIELD_ID, g_bsched_rec.getValue(BSCHED_LOCATION_FIELD_ID));

                }

            }
        }

        function initiateCustomerDeposit(origin_id, currentRecord) {

            g_bsched_rec = record.load({
                type: ESCALATION_SCHEDULE_RECORD_TYPE,
                id: origin_id,
                isDynamic: true,
            });

            currentRecord.setValue({ fieldId: CUSTOMER_FIELD_ID, value: g_bsched_rec.getValue(BSCHED_TENANT_FIELD_ID) });

            currentRecord.setValue({ fieldId: DEPOSIT_CATEGORY_FIELD_ID, value: "SECURITY DEPOSIT" });

        }

        function getParameterWithId(param_id) {

            var url = new URL(window.location.href);

            var value = url.searchParams.get(param_id);

            return value;

        }

        return {
            pageInit: pageInit,
            postSourcing: postSourcing,
        };
    }
);