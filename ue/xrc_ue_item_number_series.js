/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Jul 23, 2024
 * 
 */
define(['N/record', 'N/ui/serverWidget'],

    function (record, serverWidget) {

        const CATEGORY_FIELD_ID = 'cseg_xrc_item_categ';
        const ITEM_CODE_FIELD_ID = 'itemid';

        function beforeLoad(context) {

            var newRecord = context.newRecord;

            var form = context.form;

            log.debug('context.type', context.type);

            if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.COPY) {

                newRecord.setValue(ITEM_CODE_FIELD_ID, 'To Be Generated');

            }

            form.getField({ id: ITEM_CODE_FIELD_ID })
                .updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED,
                });

        }

        function afterSubmit(context) {

            var newRecord = context.newRecord;

            log.debug('context.type', context.type);

            // Only run this block of code on CREATE
            if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.COPY) {

                var category = newRecord.getValue(CATEGORY_FIELD_ID);

                handleSeriesGeneration(newRecord, category);

            }

        }

        function handleSeriesGeneration(newRecord, category) {

            var { field, prefix } = getFieldAndPrefixByCategory(category);

            if (!field) return;

            var script_deployment = record.load({
                type: record.Type.SCRIPT_DEPLOYMENT,
                id: 3582, // Script Deployment ID
            })

            var last_number = script_deployment.getValue(field);

            // Increment the last number
            last_number += 1;

            log.debug('item_series', appendLeadingZeros(last_number, prefix));

            record.submitFields({
                type: newRecord.type,
                id: newRecord.id,
                values: {
                    [ITEM_CODE_FIELD_ID]: appendLeadingZeros(last_number, prefix), // Attaching the generated new number on saving the record
                },
                options: {
                    ignoreMandatoryFields: true
                }
            });

            // Updating the last current number
            updateLastNumber(last_number, field);

        }

        // Updates the number of the last created vendor record based on the selected category
        function updateLastNumber(next_number, field) {

            record.submitFields({
                type: record.Type.SCRIPT_DEPLOYMENT,
                id: 3582, // Script Deployment ID
                values: {
                    [field]: next_number,
                },
                options: {
                    ignoreMandatoryFields: true,
                },
            });

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

        function getFieldAndPrefixByCategory(category) {

            const fields = {
                '1': { field: 'custscript_xrc_adv_mat_last_num', prefix: 'ADMTR-' },
                '2': { field: 'custscript_xrc_construction_mat_last_num', prefix: 'CONMT-' },
                '3': { field: 'custscript_xrc_marketing_mat_last_num', prefix: 'MKTMT-' },
                '7': { field: 'custscript_xrc_mis_suppl_last_num', prefix: 'MISSP-' },
                '4': { field: 'custscript_xrc_offc_suppl_last_num', prefix: 'OFCSU-' },
                '5': { field: 'custscript_xrc_ops_suppl_last_num', prefix: 'OPSUP-' },
                '11': { field: 'custscript_xrc_other_items_last_num', prefix: 'OTHER-' },
                '6': { field: 'custscript_xrc_serv_items_last_num', prefix: 'SRITM-' },
                '8': { field: 'custscript_xrc_prep_charges_last_num', prefix: 'PRPCI-' },
                '9': { field: 'custscript_xrc_lease_charges_last_num', prefix: 'LSCHR-' },
                '10': { field: 'custscript_xrc_lease_disc_last_num', prefix: 'LSDSC-' },
            };

            return fields[category];

        }

        return {
            beforeLoad: beforeLoad,
            afterSubmit: afterSubmit,
        };
    }
);