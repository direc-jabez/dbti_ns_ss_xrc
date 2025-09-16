/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Jul 23, 2024
 * 
 */
define(['N/record', 'N/runtime'],

    function (record, runtime) {

        const VENDOR_LAST_NUMBER_FIELD_ID = 'custscript_xrc_vendor_last_num';
        const IC_VENDOR_LAST_NUMBER_FIELD_ID = 'custscript_xrc_ic_vend_last_num';
        const CATEGORY_FIELD_ID = 'category';
        const CATEGORY_SUBSIDIARIES_ID = '8';
        const CATEGORY_TAX_AGENCY_ID = '3';
        const TREASURY_ASSISTANT_ROLE_ID = 1482;
        const TREASURY_HEAD_ROLE_ID = 1483;

        function beforeLoad(context) {

            if (context.type === context.UserEventType.VIEW) {

                var currentUser = runtime.getCurrentUser();

                if (currentUser.role !== TREASURY_ASSISTANT_ROLE_ID && currentUser.role !== TREASURY_HEAD_ROLE_ID) {

                    context.form.removeButton({
                        id: 'payment',
                    });

                }

            }

        }

        function afterSubmit(context) {

            var newRecord = context.newRecord;

            // Only run this block of code on CREATE
            if (context.type === context.UserEventType.CREATE) {

                var category = newRecord.getValue(CATEGORY_FIELD_ID);

                category !== CATEGORY_SUBSIDIARIES_ID && category !== CATEGORY_TAX_AGENCY_ID ?
                    handleSeriesGeneration(newRecord, category, 'VENDR-') : category === CATEGORY_SUBSIDIARIES_ID ?
                        handleSeriesGeneration(newRecord, category, 'VENIC-') : null;

            }

        }

        function handleSeriesGeneration(newRecord, category, prefix) {

            var last_number = getVendorLastNumber(category);

            // Increment the last number
            last_number += 1;

            record.submitFields({
                type: newRecord.type,
                id: newRecord.id,
                values: {
                    'entityid': appendLeadingZeros(last_number, prefix), // Attaching the generated new number on saving the record
                },
                options: {
                    ignoreMandatoryFields: true
                }
            });

            // Updating the last current number
            updateLastNumber(last_number, category);

        }

        // Returns the number of the last created vendor record based on the selected category
        function getVendorLastNumber(category) {

            var current_script = runtime.getCurrentScript();

            var last_number = category !== CATEGORY_SUBSIDIARIES_ID && category !== CATEGORY_TAX_AGENCY_ID ?
                current_script.getParameter({ name: VENDOR_LAST_NUMBER_FIELD_ID }) : category === CATEGORY_SUBSIDIARIES_ID ?
                    current_script.getParameter({ name: IC_VENDOR_LAST_NUMBER_FIELD_ID }) : null;

            return last_number;

        }

        // Updates the number of the last created vendor record based on the selected category
        function updateLastNumber(next_number, category) {

            var script_deployment = record.load({
                type: record.Type.SCRIPT_DEPLOYMENT,
                id: 1719, // Script Deployment ID
            });

            category !== CATEGORY_SUBSIDIARIES_ID && category !== CATEGORY_TAX_AGENCY_ID ?
                script_deployment.setValue(VENDOR_LAST_NUMBER_FIELD_ID, next_number) : category === CATEGORY_SUBSIDIARIES_ID ?
                    script_deployment.setValue(IC_VENDOR_LAST_NUMBER_FIELD_ID, next_number) : null;

            script_deployment.save();

        }

        /**
         * Generating new series number for the current record
         * 
         * @param {*} newCode - the next number
         * @param {*} prefix - prefix of the series
         * @returns new generated number series
         * 
         */
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

        return {
            beforeLoad: beforeLoad,
            afterSubmit: afterSubmit,
        };
    }
);