/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 07, 2024
 * 
 */
define(['N/runtime'],

    function (runtime) {

        const PREPARED_BY_FIELD_ID = 'custbody_xrc_prepared_by';

        function pageInit(context) {

            var currentRecord = context.currentRecord;

            var currentUser = runtime.getCurrentUser();

            if (context.mode === 'copy') {

                currentRecord.setValue(PREPARED_BY_FIELD_ID, currentUser.id);

            }

        }

        return {
            pageInit: pageInit,
        };
    }
);