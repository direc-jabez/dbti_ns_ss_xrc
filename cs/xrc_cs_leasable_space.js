/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Sept. 25, 2024
 * 
 */
define([],

    function () {

        const APPROX_FLR_AREA_SQM_FIELD_ID = 'custrecord_xrc_ls_approx_flr_area';
        const PROJECTED_RATE_PER_SQM_FIELD_ID = 'custrecord_xrc_proj_rate_per_sqm';
        const PROJECTED_BASIC_RENT_FIELD_ID = 'custrecord_xrc_ls_proj_basic_rent';


        function pageInit(context) {

        }

        function fieldChanged(context) {

            var currentRecord = context.currentRecord;

            var fieldId = context.fieldId;

            if (fieldId === APPROX_FLR_AREA_SQM_FIELD_ID || fieldId === PROJECTED_RATE_PER_SQM_FIELD_ID) {

                // Multiplying Approximate Floor Area per SQM to Projected Rate Per SQM
                // and setting it to Projected Basic Rent
                currentRecord.setValue(PROJECTED_BASIC_RENT_FIELD_ID, currentRecord.getValue(APPROX_FLR_AREA_SQM_FIELD_ID) * currentRecord.getValue(PROJECTED_RATE_PER_SQM_FIELD_ID));

            }

        }

        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
        };
    }
);