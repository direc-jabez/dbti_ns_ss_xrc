/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Nov 15, 2024
 * 
 */
define(['N/record', 'N/search'],

    function (record, search) {

        const LEASABLE_SPACE_RECORD_TYPE = 'customrecord_xrc_leasable_spaces';
        const LS_LEASE_STATUS_FIELD_ID = 'custrecord_xrc_ls_lease_status';
        const LS_STATUS_VACANT_ID = '2';

        function getInputData(context) {

            return createSalesOrderSearch();

        }

        function reduce(context) {

            try {

                log.debug('Execution', 'Executed at ' + new Date().toLocaleDateString());

                var value = JSON.parse(context.values);

                const fields = ['custrecord_xrc_lease_memo14', 'custrecord_xrc_tenant', 'custrecord_xrc_lease_type', 'custrecord_xrc_ls_lease_period_type', 'custrecord_xrc_ls_lease_period', 'custrecord_xrc_ls_actual_rate_per_sqm', 'custrecord_xrc_actual_basic_rent', 'custrecord_xrc_ls_lease_commence', 'custrecord_xrc_ls_lease_expiry', 'custrecord_xrc_ls_lease_status'];

                const values = {};

                fields.forEach((field) => {

                    if (field === LS_LEASE_STATUS_FIELD_ID) {

                        values[field] = LS_STATUS_VACANT_ID;

                    } else {

                        values[field] = null;

                    }
                });

                record.submitFields({
                    type: LEASABLE_SPACE_RECORD_TYPE,
                    id: value.values['custbody_xrc_space_num'].value,
                    values: values,
                });

            } catch (error) {

                log.debug('error', error);

            }
        }

        function createSalesOrderSearch() {

            var sales_order_search = search.create({
                type: "salesorder",
                filters: [
                    ["type", "anyof", "SalesOrd"],
                    "AND",
                    ["status", "anyof", "SalesOrd:G", "SalesOrd:H", "SalesOrd:C"],
                    "AND",
                    ["mainline", "is", "T"],
                    "AND",
                    ["custbody_xrc_space_num", "noneof", "@NONE@"],
                    "AND",
                    ["custbody_xrc_space_num.custrecord_xrc_lease_memo14", "noneof", "@NONE@"]
                ],
                columns: [search.createColumn({ name: "custbody_xrc_space_num", label: "Space No." })]
            });

            return sales_order_search;
        }

        return {
            getInputData: getInputData,
            reduce: reduce,
        };
    }
);