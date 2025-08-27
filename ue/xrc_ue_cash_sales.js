/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Nov 29, 2024
 * 
 */
define(['N/record'],

    function (record) {

        const ISOA_DEPOSIT_RECORD_TYPE = 'customrecord_xrc_initial_soa_dep';
        const ISOA_DEPOSIT_FIELD_ID = 'custbody_xrc_isoa_deposit';
        const ISOA_DEP_SALES_GENERATED_FIELD_ID = 'custrecord_xrc_isoa_dep_sales_generated';


        function afterSubmit(context) {

            var newRecord = context.newRecord;

            if (context.type === context.UserEventType.CREATE) {

                var isoa_dep_id = newRecord.getValue(ISOA_DEPOSIT_FIELD_ID);

                if (isoa_dep_id) {

                    record.submitFields({
                        type: ISOA_DEPOSIT_RECORD_TYPE,
                        id: isoa_dep_id,
                        values: {
                            [ISOA_DEP_SALES_GENERATED_FIELD_ID]: true,
                        }
                    });

                }
            }

        }

        return {
            afterSubmit: afterSubmit,
        };
    }
);