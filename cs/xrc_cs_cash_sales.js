/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 13, 2024
 * 
 */
define(['N/record', 'N/search', 'N/format'],

    function (record, search, format) {

        const PARAM_ORIGIN_ID = 'origin_id';
        const MODE_CREATE = 'create';
        const INITIAL_SOA_RECORD_TYPE_ID = 'customrecord_xrc_initial_soa';
        const ISOA_ADVANCE_CHARGES_SUBLIST_ID = 'recmachcustrecord_xrc_initial_soa_num';
        const ISOA_PREPAYMENT_CATEGORY_SUBLIST_FIELD_ID = 'custrecord_xrc_prepayment_category';
        const ISOA_TAXCODE_SUBLIST_FIELD_ID = 'custrecord_xrc_tax_code';
        const INITIAL_SOA_DEPOSIT_RECORD_TYPE_ID = 'customrecord_xrc_initial_soa_dep';
        const ISOA_DEP_HISTORICAL_VALUES_FIELD_ID = 'custrecord_xrc_isoa_dep_historical_vals';
        const ISOA_DEP_DEPOSIT_DATE_FIELD_ID = 'custrecord_xrc_deposit_date';
        const ISOA_DEP_INITIAL_SOA_FIELD_ID = 'custrecord_xrc_initial_soa6';
        const ISOA_DEP_REMARKS_FIELD_ID = 'custrecord_xrc_rem';
        const ISOA_DEP_BANK_CATEGORY_FIELD_ID = 'custrecord_xrc_isoa_dep_bank_category';
        const ISOA_DEP_ACCOUNT_FIELD_ID = 'custrecord_xrc_isoa_dep_account';
        const ISOA_DEP_ADVANCE_CHARGE_SUBLIST_ID = 'custpage_sublist_apply';
        const ISOA_DEP_PAYMENT_SUBLIST_FIELD_ID = 'custpage_payment';
        const UNDEPOSITED_FUNDS_ID = '1';
        const ISOA_LOCATION_FIELD_ID = 'custrecord_xrc_isoa_location';
        const ISOA_CLASS_FIELD_ID = 'custrecord_xrc_isoa_class';
        const ISOA_DEPARTMENT_FIELD_ID = 'custrecord_xrc_isoa_department';
        const CASH_SALE_ISOA_DEPOSIT_FIELD_ID = 'custbody_xrc_isoa_deposit';
        const CASH_SALE_DATE_FIELD_ID = 'trandate';
        const CASH_SALE_REMARKS_FIELD_ID = 'memo';
        const CASH_SALE_UNDEPFUNDS_FIELD_ID = 'undepfunds';
        const CASH_SALE_ACCOUNT_FIELD_ID = 'account';
        const CASH_SALE_LOCATION_FIELD_ID = 'location';
        const CASH_SALE_CLASS_FIELD_ID = 'class';
        const CASH_SALE_DEPARTMENT_FIELD_ID = 'department';
        const CASH_SALE_ITEM_SUBLIST_ID = 'item';
        const CASH_SALE_ITEM_SUBLIST_FIELD_ID = 'item';
        const CASH_SALE_TAXCODE_SUBLIST_FIELD_ID = 'taxcode';
        const CASH_SALE_GROSS_AMT_SUBLIST_FIELD_ID = 'grossamt';



        function pageInit(context) {

            var currentRecord = context.currentRecord;

            if (context.mode === MODE_CREATE) {

                var origin_id = getParameterWithId(PARAM_ORIGIN_ID);

                initiateCashSale(origin_id, currentRecord);

            }

        }

        function initiateCashSale(origin_id, currentRecord) {

            var isoa_dep_rec = record.load({
                type: INITIAL_SOA_DEPOSIT_RECORD_TYPE_ID,
                id: origin_id,
            });

            currentRecord.setValue(CASH_SALE_ISOA_DEPOSIT_FIELD_ID, origin_id);

            currentRecord.setValue(CASH_SALE_DATE_FIELD_ID, isoa_dep_rec.getValue(ISOA_DEP_DEPOSIT_DATE_FIELD_ID));

            currentRecord.setValue(CASH_SALE_REMARKS_FIELD_ID, isoa_dep_rec.getValue(ISOA_DEP_REMARKS_FIELD_ID));

            var bank_category = isoa_dep_rec.getValue(ISOA_DEP_BANK_CATEGORY_FIELD_ID);

            if (bank_category === UNDEPOSITED_FUNDS_ID) {

                currentRecord.setValue(CASH_SALE_UNDEPFUNDS_FIELD_ID, 'T');

            } else {

                currentRecord.setValue(CASH_SALE_UNDEPFUNDS_FIELD_ID, 'F');

                currentRecord.setValue(CASH_SALE_ACCOUNT_FIELD_ID, isoa_dep_rec.getValue(ISOA_DEP_ACCOUNT_FIELD_ID));

            }

            var isoa_id = isoa_dep_rec.getValue(ISOA_DEP_INITIAL_SOA_FIELD_ID);

            var isoa_rec = record.load({
                type: INITIAL_SOA_RECORD_TYPE_ID,
                id: isoa_id,
            });

            currentRecord.setValue(CASH_SALE_LOCATION_FIELD_ID, isoa_rec.getValue(ISOA_LOCATION_FIELD_ID));

            currentRecord.setValue(CASH_SALE_DEPARTMENT_FIELD_ID, isoa_rec.getValue(ISOA_DEPARTMENT_FIELD_ID));

            currentRecord.setValue(CASH_SALE_CLASS_FIELD_ID, isoa_rec.getValue(ISOA_CLASS_FIELD_ID));

            var isoa_dep_historical_values = JSON.parse(isoa_dep_rec.getValue(ISOA_DEP_HISTORICAL_VALUES_FIELD_ID));

            var advance_charges_lines = isoa_rec.getLineCount({
                sublistId: ISOA_ADVANCE_CHARGES_SUBLIST_ID,
            });

            for (var line = 0; line < advance_charges_lines; line++) {

                var item = isoa_rec.getSublistValue({
                    sublistId: ISOA_ADVANCE_CHARGES_SUBLIST_ID,
                    fieldId: ISOA_PREPAYMENT_CATEGORY_SUBLIST_FIELD_ID,
                    line: line,
                });

                var adv_charge = isoa_dep_historical_values.filter(historical_value => historical_value.item_id === item)[0];

                if (adv_charge) {

                    // console.log(adv_charge);

                    var taxcode = isoa_rec.getSublistValue({
                        sublistId: ISOA_ADVANCE_CHARGES_SUBLIST_ID,
                        fieldId: ISOA_TAXCODE_SUBLIST_FIELD_ID,
                        line: line,
                    });

                    currentRecord.setCurrentSublistValue({
                        sublistId: CASH_SALE_ITEM_SUBLIST_ID,
                        fieldId: CASH_SALE_ITEM_SUBLIST_FIELD_ID,
                        value: item,
                        forceSyncSourcing: true,
                    });

                    currentRecord.setCurrentSublistValue({
                        sublistId: CASH_SALE_ITEM_SUBLIST_ID,
                        fieldId: CASH_SALE_TAXCODE_SUBLIST_FIELD_ID,
                        value: taxcode,
                        forceSyncSourcing: true,
                    });

                    currentRecord.setCurrentSublistValue({
                        sublistId: CASH_SALE_ITEM_SUBLIST_ID,
                        fieldId: CASH_SALE_GROSS_AMT_SUBLIST_FIELD_ID,
                        value: adv_charge.payment,
                        forceSyncSourcing: true,
                    });

                    currentRecord.commitLine({
                        sublistId: CASH_SALE_ITEM_SUBLIST_ID,
                    });

                }

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