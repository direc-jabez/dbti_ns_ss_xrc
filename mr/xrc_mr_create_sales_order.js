/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 22, 2024
 * 
 */
define(['N/record', 'N/search'],

    function (record, search) {

        const SEARCH_ID = 'customsearch_xrc_unpaid_invoice';
        const CUSTOM_FORM_FIELD_ID = 'customform';
        const SALES_ORDER_FORM_ID = '223';
        const CUSTOMER_FIELD_ID = 'entity';
        const LOCATION_FIELD_ID = 'location';
        const SALES_REP_FIELD_ID = 'salesrep';
        const SALES_EFFECTIVE_FIELD_ID = 'saleseffectivedate';
        const SI_NUMBER_FIELD_ID = 'custbody_xrc_invoice_num';
        const AMOUNT_DUE_FIELD_ID = 'amountremaining';
        const ITEMS_SUBLIST_ID = 'item';
        const ITEMS_SUBLIST_FIELD_ID = 'item';
        const LEASE_0016_ID = '5249';
        const QUANTITY_SUBLIST_FIELD_ID = 'quantity';
        const RATE_SUBLIST_FIELD_ID = 'rate';
        const TAX_CODE_SUBLIST_FIELD_ID = 'taxcode';
        const S_PH_TAX_CODE_ID = '6';


        function getInputData(context) {

            // Loading the saved search
            const overdue_invoices = search.load({
                id: SEARCH_ID,
            });

            return overdue_invoices;

        }

        function map(context) {

            var result = JSON.parse(context.value);

            var invoice_rec = record.load({
                type: record.Type.INVOICE,
                id: result.id,
                isDynamic: true,
            });

            var so_rec = record.create({
                type: record.Type.SALES_ORDER,
                isDynamic: true,
            });

            // Setting body fields reference from Invoice record
            so_rec.setValue(CUSTOM_FORM_FIELD_ID, SALES_ORDER_FORM_ID);

            so_rec.setValue(CUSTOMER_FIELD_ID, invoice_rec.getValue(CUSTOMER_FIELD_ID));

            so_rec.setValue(LOCATION_FIELD_ID, invoice_rec.getValue(LOCATION_FIELD_ID));

            so_rec.setValue(SALES_REP_FIELD_ID, invoice_rec.getValue(SALES_REP_FIELD_ID));

            so_rec.setValue(SALES_EFFECTIVE_FIELD_ID, invoice_rec.getValue(SALES_EFFECTIVE_FIELD_ID));

            so_rec.setValue(SI_NUMBER_FIELD_ID, invoice_rec.id);

            // Setting line items
            so_rec.selectNewLine({
                sublistId: ITEMS_SUBLIST_ID,
            });

            so_rec.setCurrentSublistValue({
                sublistId: ITEMS_SUBLIST_ID,
                fieldId: ITEMS_SUBLIST_FIELD_ID,
                value: LEASE_0016_ID,
            });

            so_rec.setCurrentSublistValue({
                sublistId: ITEMS_SUBLIST_ID,
                fieldId: QUANTITY_SUBLIST_FIELD_ID,
                value: 3, // Fixed 3% for the quantity
            });

            var amount_due = invoice_rec.getValue(AMOUNT_DUE_FIELD_ID);

            so_rec.setCurrentSublistValue({
                sublistId: ITEMS_SUBLIST_ID,
                fieldId: RATE_SUBLIST_FIELD_ID,
                value: amount_due,
            });

            so_rec.setCurrentSublistValue({
                sublistId: ITEMS_SUBLIST_ID,
                fieldId: TAX_CODE_SUBLIST_FIELD_ID,
                value: S_PH_TAX_CODE_ID,
            });

            so_rec.commitLine({
                sublistId: ITEMS_SUBLIST_ID,
            });

            var so_id = so_rec.save({
                ignoreMandatoryFields: true,
            });

            log.debug('so_id', so_id);

        }

        return {
            getInputData: getInputData,
            map: map,
        };
    }
);