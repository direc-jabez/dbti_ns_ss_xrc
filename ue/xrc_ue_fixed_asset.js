/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Jul 25, 2024
 * 
 */
define(['N/record'],

    function (record) {

        const ASSET_TYPE_FIELD_ID = 'custrecord_assettype';
        const IT_EQUIPMENT_TYPE_ID = '1';
        const CUSTOM_FORM_FIELD_ID = 'customform';
        const IT_EQUIPMENT_FORM_ID = '384';

        function afterSubmit(context) {

            var newRecord = context.newRecord;

            // Check if the context is on CREATE
            if (context.type === context.UserEventType.CREATE) {

                // Guard for if the form is already at IT EQUIPMENT FORM
                var custom_form = newRecord.getValue(CUSTOM_FORM_FIELD_ID);

                if (custom_form === IT_EQUIPMENT_FORM_ID) {

                    return;

                }

                var asset_type = newRecord.getValue(ASSET_TYPE_FIELD_ID);

                if (asset_type === IT_EQUIPMENT_TYPE_ID) {

                    // record.submitFields({
                    //     type: newRecord.type,
                    //     id: newRecord.id,
                    //     values: {
                    //         [CUSTOM_FORM_FIELD_ID]: IT_EQUIPMENT_FORM_ID, // Change the form if the asset type is IT Equipment
                    //     },
                    //     options: {
                    //         ignoreMandatoryFields: true
                    //     }
                    // });

                }

            }

        }

        return {
            afterSubmit: afterSubmit,
        };
    }
);