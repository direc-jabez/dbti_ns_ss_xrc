/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Jul 23, 2024
 * 
 */
define([],

    function () {

        const CUSTODIAN_FILTER_FIELD_ID = 'CUSTRECORD_ASSETCARETAKER';

        function pageInit(context) {
            
            var currentRecord = context.currentRecord;

            var custodian_filter_field = currentRecord.getField({
                fieldId: CUSTODIAN_FILTER_FIELD_ID,
            });

            custodian_filter_field.isDisabled = true;

        }

        return {
            pageInit: pageInit,
        };
    }
);