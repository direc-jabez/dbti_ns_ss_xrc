/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 05, 2024
 * 
 */
define(['N/record', 'N/search'],

    function (record, search) {

        const CUSTOM_FORM_FIELD_ID = 'customform';
        const MODE_CREATE = 'create';
        const LEAD_FORM_ID = '335';
        const FORM_PARAM_ID = 'cf';

        function pageInit(context) {

            var currentRecord = context.currentRecord;

            // Get the value of cf parameter
            var form_id = getParameterWithId(FORM_PARAM_ID);

            // If there is no value, set default form (Lead form)
            if (!form_id) {

                currentRecord.setValue(CUSTOM_FORM_FIELD_ID, LEAD_FORM_ID);

            }
        }

        function getParameterWithId(param_id) {

            var url = new URL(window.location.href);

            var value = url.searchParams.get(param_id);

            return value;

        }

        return {
            pageInit: pageInit,
        };
    }
);