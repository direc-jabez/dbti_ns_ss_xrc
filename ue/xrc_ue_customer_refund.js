/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Feb 10, 2025
 * 
 */
define(['N/record', 'N/search'],

    function (record, search) {

        const LEASE_BILLING_NOTICE_RECORD_TYPE = 'customrecord_xrc_lease_billing_notice';
        const TOTAL_FIELD_ID = 'total';
        const LBN_BALANCE_FIELD_ID = 'custbody_xrc_lbn_balance';
        const LBN_NO_FIELD_ID = 'custbody_xrc_lbn_no';
        const REFUNDED_LBN_FIELD_ID = 'custrecord_xrc_lbn_refunded';
        const BALANCE_LBN_FIELD_ID = 'custrecord_xrc_lbn_balance';
        const VOIDED_FIELD_ID = 'voided';
        const CUSTOMER_REFUND_LAST_NUMBER_FIELD_ID = 'custscript_xrc_cust_refund_last_num';
        const LOCATION_FIELD_ID = 'location';
        const ID_FIELD_ID = 'custbody_xrc_cv_num';

        function beforeLoad(context) {

            if (context.type === context.UserEventType.VIEW) {

                var form = context.form;

                form.clientScriptModulePath = './xrc_cs_customer_refund.js';

                form.addButton({
                    id: 'custpage_print_check',
                    label: 'Print Check',
                    functionName: 'onPrintCheckClick()',
                });

                form.addButton({
                    id: 'custpage_print_check',
                    label: 'Print Voucher',
                    functionName: 'onPrintVoucherClick()',
                });


            }

        }

        function afterSubmit(context) {

            var newRecord = context.newRecord;

            if (context.type === context.UserEventType.CREATE) {

                // var lbn_id = newRecord.getValue(LBN_NO_FIELD_ID);

                // var total = newRecord.getValue(TOTAL_FIELD_ID);

                // const lbn_rec = record.load({
                //     type: LEASE_BILLING_NOTICE_RECORD_TYPE,
                //     id: lbn_id,
                // });

                // var new_refunded = lbn_rec.getValue(REFUNDED_LBN_FIELD_ID) + total;

                // var new_balance = lbn_rec.getValue(BALANCE_LBN_FIELD_ID) - total;

                // lbn_rec.setValue(REFUNDED_LBN_FIELD_ID, new_refunded);

                // lbn_rec.setValue(BALANCE_LBN_FIELD_ID, new_balance);

                // lbn_rec.save({
                //     ignoreMandatoryFields: true,
                // });

            }

            // Generate series on CREATE context type and on date after opening balance
            (context.type === context.UserEventType.CREATE && isAfterOpeningBalance(date)) && handleSeriesGeneration(newRecord);

        }

        function handleSeriesGeneration(newRecord) {

            var current_script = runtime.getCurrentScript();

            var json_string = current_script.getParameter({ name: CUSTOMER_REFUND_LAST_NUMBER_FIELD_ID });

            var last_num_obj = JSON.parse(json_string);

            var location_code = getLocationCode(newRecord.getValue(LOCATION_FIELD_ID));

            var next_num = (parseInt(last_num_obj[location_code]) || 0) + 1;

            record.submitFields({
                type: newRecord.type,
                id: newRecord.id,
                values: {
                    [ID_FIELD_ID]: location_code + '-' + appendLeadingZeros(next_num, 'CUSRF-'), // Attaching the generated new number on saving the record
                },
                options: {
                    ignoreMandatoryFields: true
                }
            });

            last_num_obj[location_code] = next_num;

            updateLastNumber(last_num_obj);

        }

        function getLocationCode(location_id) {

            const fieldLookUp = search.lookupFields({
                type: search.Type.LOCATION,
                id: location_id,
                columns: ['tranprefix']
            });

            return fieldLookUp['tranprefix'];

        }

        function updateLastNumber(new_obj) {

            record.submitFields({
                type: record.Type.SCRIPT_DEPLOYMENT,
                id: 3190, // Script Deployment ID
                values: {
                    [CUSTOMER_REFUND_LAST_NUMBER_FIELD_ID]: JSON.stringify(new_obj),
                },
                options: {
                    ignoreMandatoryFields: true,
                }
            });

        }

        function appendLeadingZeros(newCode, prefix) {

            var leadingZeros = '0000';
            var zerosLength = 4;

            newCode = newCode.toString();

            if (newCode.length <= zerosLength) {
                leadingZeros = leadingZeros.slice(0, zerosLength - newCode.length);
                newCode = prefix + leadingZeros + newCode;
            } else {
                newCode = prefix + newCode;
            }

            return newCode;
        }

        function isAfterOpeningBalance(date) {

            return date >= new Date("2024-11-01");

        }

        return {
            beforeLoad: beforeLoad,
            afterSubmit: afterSubmit,
        };
    }
);