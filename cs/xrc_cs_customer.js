/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Feb 13, 2025
 * 
 */
define([],

    function () {

        const CUSTOMER_ID_FIELD_ID = 'entityid';
        const CATEGORY_FIELD_ID = 'category';
        const DEFAULT_TAX_CODE_FIELD_ID = 'taxitem';
        const PHONE_FIELD_ID = 'phone';

        function fieldChanged(context) {

            var currentRecord = context.currentRecord;

            var fieldId = context.fieldId;

            if (fieldId === CATEGORY_FIELD_ID) {

                var category = currentRecord.getValue(fieldId);

                currentRecord.setValue(DEFAULT_TAX_CODE_FIELD_ID, getDefaultTaxIdByTenantCategory(category));

            }

        }

        function saveRecord(context) {

            var currentRecord = context.currentRecord;

            var customer_id = currentRecord.getValue(CUSTOMER_ID_FIELD_ID);

            if (customer_id && customer_id.length !== 13) {

                alert('Customer ID should have 13 characters.');

                return false;

            }

            var phone = currentRecord.getValue(PHONE_FIELD_ID);

            if (!phone) {

                alert('Phone field is mandatory.');

                return false;

            }

            return true;

        }

        function getDefaultTaxIdByTenantCategory(category) {

            var categories = {
                '1': '6', // VAT_PH:S-PH
                '5': '8', // VAT_PH:EX-PH
                '6': '9', // VAT_PH:G-PH
                '7': '5', // VAT_PH:UNDEF-PH
            };

            return categories[category];

        }

        return {
            fieldChanged: fieldChanged,
            saveRecord: saveRecord,
        };
    }
);