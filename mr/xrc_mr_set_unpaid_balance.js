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

        const BILLING_SCHEDULE_RECORD_TYPE_FIELD_ID = 'customrecord_xrc_escalation_schedule';
        const BSCHED_UNPAID_BALANCE_FIELD_ID = 'custrecord_xrc_bes_unpaidbal';
        const BSCHED_UNPAID_BALANCE_AS_OF_FIELD_ID = 'custrecord_xrc_bes_unpaidbal_asof';
        const BSCHED_PENALTY_FOR_UNPAID_BALANCE_FIELD_ID = 'custrecord_xrc_bes_penalty_unpaidbal';


        function getInputData(context) {

            return createBillingScheduleSearch();

        }

        function reduce(context) {

            try {

                var result = JSON.parse(context.values);

                var so_id = result.values["custrecord_xrc_esc_sched_estimate"].value;

                var lease_period = result.values["custrecord_xrc_esc_sched_lease_period"];

                var interest_rate = parseFloat(result.values["custrecord_xrc_bes_interestrate"]);

                var bsched_search = createBillingScheduleWithUnpaidBalance(so_id, lease_period);

                var unpaid_balance = 0;

                var unpaid_balance_as_of = null;

                bsched_search.run().each(function (bsched_search_result) {

                    unpaid_balance_as_of = bsched_search_result.getValue("custrecord_xrc_esc_sched_billing_date");

                    unpaid_balance += parseFloat(bsched_search_result.getValue("custrecord_xrc_bes_unpaid_bal"));

                    return true;
                });

                var penalty = unpaid_balance * (1 + (interest_rate / 100));

                // Updating Unpaid Balance for current selected Billing Schedule
                record.submitFields({
                    type: BILLING_SCHEDULE_RECORD_TYPE_FIELD_ID,
                    id: result.id,
                    values: {
                        [BSCHED_UNPAID_BALANCE_AS_OF_FIELD_ID]: unpaid_balance_as_of,
                        [BSCHED_UNPAID_BALANCE_FIELD_ID]: unpaid_balance,
                        [BSCHED_PENALTY_FOR_UNPAID_BALANCE_FIELD_ID]: penalty,
                    },
                    options: {
                        enableSourcing: true,
                        ignoreMandatoryFields: true
                    }
                });

            } catch (error) {

                log.debug('error', error);

            }
        }

        // Search for Billing Schedule for the current month
        function createBillingScheduleSearch() {

            // Createing Billing Schedule search that Billing Date 
            // is within the current month
            var bsched_search = search.create({
                type: "customrecord_xrc_escalation_schedule",
                filters:
                    [
                        ["custrecord_xrc_esc_sched_billing_date", "within", "thismonth"],
                        "AND",
                        ["internalid", "anyof", "1065"]
                    ],
                columns:
                    [
                        search.createColumn({ name: "custrecord_xrc_esc_sched_lease_period", label: "Lease Period" }),
                        search.createColumn({ name: "custrecord_xrc_esc_sched_billing_date", label: "Billing Period End Date" }),
                        search.createColumn({ name: "custrecord_xrc_bes_unpaid_bal", label: "SOA Unpaid Balance" }),
                        search.createColumn({ name: "custrecord_xrc_esc_sched_estimate", label: "Sales Order" }),
                        search.createColumn({ name: "custrecord_xrc_bes_interestrate", label: "Interest Rate" })
                    ]
            });

            return bsched_search;

        }

        function createBillingScheduleWithUnpaidBalance(so_id, lease_period) {

            // Creating Billing Schedule search that returns
            // Unpaid Balance of previous periods
            var bsched_search = search.create({
                type: "customrecord_xrc_escalation_schedule",
                filters:
                    [
                        ["custrecord_xrc_esc_sched_estimate", "anyof", so_id],
                        "AND",
                        ["formulanumeric: " + lease_period + "-{custrecord_xrc_esc_sched_lease_period}", "greaterthan", "1"],
                        "AND",
                        ["custrecord_xrc_bes_unpaid_bal", "greaterthan", "0.00"]
                    ],
                columns:
                    [
                        search.createColumn({ name: "custrecord_xrc_esc_sched_lease_period", label: "Lease Period" }),
                        search.createColumn({ name: "custrecord_xrc_esc_sched_billing_date", label: "Billing Period End Date" }),
                        search.createColumn({ name: "custrecord_xrc_bes_unpaid_bal", label: "SOA Unpaid Balance" })
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