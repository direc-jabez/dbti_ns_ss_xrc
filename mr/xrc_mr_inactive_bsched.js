/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Sept. 24, 2024
 * 
 */
define(['N/record', 'N/search'],

    function (record, search) {


        function getInputData(context) {

            return createBillingScheduleSearch();

        }

        function reduce(context) {

            try {

                var result = JSON.parse(context.values);

                // Setting Inactive as true
                record.submitFields({
                    type: result.recordType,
                    id: result.id, // Billing schedule id
                    values: {
                        'isinactive': true,
                    },
                    options: {
                        ignoreMandatoryFields: true
                    }
                });

            } catch (error) {

                log.debug('error', error);

            }
        }

        function createBillingScheduleSearch() {

            // Creating search for Billing Schedule thas has no Lease Memorandum tagged
            var bsched_search = search.create({
                type: "customrecord_xrc_escalation_schedule",
                filters:
                    [
                        ["custrecord_xrc_esc_sched_estimate", "anyof", "@NONE@"],
                        "AND",
                        ["isinactive", "is", "F"],
                    ],
                columns:
                    [
                        search.createColumn({ name: "internalid", label: "Internal ID" }),
                    ]
            });

            return bsched_search;
        }

        return {
            getInputData: getInputData,
            reduce: reduce,
        };
    }
);