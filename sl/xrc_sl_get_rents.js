/**
 * @NApiVersion 2.1
 * @NScripttype Suitelet
 *
 * Created by: DBTI - Ricky Eredillas Jr.
 * Date: Jan 22, 2025
 *
 */

define(["N/record", "N/search"],

    function (record, search) {

        const HISTORICAL_VALUES_FIELD_ID = 'custbody_xrc_historical_values';


        function onRequest(context) {

            var params = context.request.parameters;

            var lease_memo_id = params.lease_memo_id;

            var opening_balance = params.opening_balance;

            log.debug('opening_balance', opening_balance);

            var billing_schedule_search = createBillingScheduleSearch(lease_memo_id);

            const data = [];

            billing_schedule_search.run().each(function (result) {
                log.debug('result', result);
                data.push({
                    year: result.getValue('custrecord_xrc_esc_sched_year'),
                    startDate: result.getValue('custrecord_xrc_billing_start_date'),
                    endDate: result.getValue('custrecord_xrc_esc_sched_billing_date'),
                    rent: parseFloat(result.getValue('custrecord_xrc_esc_sched_esc_basic_rent')),
                    cusa: parseFloat(result.getValue('custrecord_xrc_esc_sched_esc_cusa')),
                    secDep: parseFloat(result.getValue('custrecord_xrc_esc_sched_adj_sec_dep')),
                })
                return true;
            });

            if (data.length === 0) {

                var lm_rec = record.load({
                    type: record.Type.SALES_ORDER,
                    id: lease_memo_id,
                });

                var historical_values = lm_rec.getValue(HISTORICAL_VALUES_FIELD_ID);

                if (historical_values !== '{}') {

                    historical_values = JSON.parse(historical_values);

                    historical_values.forEach(historical_value => {

                        data.push({
                            year: historical_value.custpage_year,
                            startDate: historical_value.custpage_billing_start_date,
                            endDate: historical_value.custpage_billing_date,
                            rent: historical_value.custpage_escalated_basic_rent, // old id => custpage_fixed_basic_rent
                            cusa: historical_value.custpage_escalated_cusa, // old id => custpage_fixed_cusa
                            secDep: historical_value.custpage_adj_sec_dep, // old id => custpage_fixed_sec_dep
                        });

                    });

                }
            }

            log.debug('data', data);

            var ranges = calculateYearRanges(data, opening_balance);

            log.debug('ranges', ranges);

            var rangeArray = [];

            for (const property in ranges) {

                const range = ranges[property];

                rangeArray.push(range.range + '/*/' + range.totalRent + '/*/' + range.totalCusa + '/*/' + range.totalSecDep); // Using arbitrary strings for division

            }

            var response = "<#assign rents='" + rangeArray.join('/-/') + "' />";

            context.response.writeLine(response);

        }

        function createBillingScheduleSearch(lease_memo_id) {

            var billing_schedule_search = search.create({
                type: "customrecord_xrc_escalation_schedule",
                filters:
                    [
                        ["custrecord_xrc_esc_sched_estimate", "anyof", lease_memo_id]
                    ],
                columns:
                    [
                        search.createColumn({ name: "custrecord_xrc_esc_sched_year", label: "Year" }),
                        search.createColumn({ name: "custrecord_xrc_esc_sched_billing_date", label: "Billing Period End Date" }),
                        search.createColumn({ name: "custrecord_xrc_esc_sched_esc_basic_rent", label: "Escalated Basic Rent" }),
                        search.createColumn({ name: "custrecord_xrc_esc_sched_esc_cusa", label: "Escalated CUSA" }),
                        search.createColumn({ name: "custrecord_xrc_esc_sched_adj_sec_dep", label: "Adjusted Security Deposit" })
                    ]
            });

            return billing_schedule_search;

        }

        const calculateYearRanges = (data, opening_balance) => {

            var start_year = parseInt(data[0]['year']);

            var last_year = parseInt(data[data.length - 1]['year']);

            var ranges = {};

            for (var year = start_year; year <= last_year; year++) {

                var year_periods = data.filter(historical_value => historical_value.year == year);

                ranges[year] = {
                    range: `${formatLongDate(year_periods[0]['startDate'])} - ${formatLongDate(year_periods[year_periods.length - 1]['endDate'])}`,
                    totalRent: opening_balance === "Yes" ? parseFloat(year_periods[year === start_year ? 0 : year_periods.length - 1]['rent']).toFixed(2) : parseFloat(year_periods[year_periods.length - 1]['rent']).toFixed(2), // Optional: Include total rent per year
                    totalCusa: opening_balance === "Yes" ? parseFloat(year_periods[year === start_year ? 0 : year_periods.length - 1]['cusa']).toFixed(2) : parseFloat(year_periods[year_periods.length - 1]['cusa']).toFixed(2), // Optional: Include total cusa per year
                    totalSecDep: parseFloat(year_periods[0]?.secDep ? year_periods[0]?.secDep : year_periods[1]?.secDep || 0).toFixed(2), // Optional: Include total secDep per year
                };

            }

            return ranges;
        }

        // Helper function to format dates as long  
        const formatLongDate = (dateString) => {
            const options = { year: "numeric", month: "long", day: "numeric" };
            return new Date(dateString).toLocaleDateString("en-US", options);
        };

        return { onRequest };
    }

);
