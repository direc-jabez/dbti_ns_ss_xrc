/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 08, 2024
 * 
 */
define(['N/record', 'N/search', 'N/format'],

    function (record, search, format) {

        const ESCALATION_SCHEDULE_SUBLIST_ID = 'recmachcustrecord_xrc_esc_sched_estimate';
        const YEAR_SUBLIST_FIELD_ID = 'custrecord_xrc_esc_sched_year';
        const LEASE_PERIOD_SUBLIST_FIELD_ID = 'custrecord_xrc_esc_sched_lease_period';
        const TRUE_BILLING_DATE_SUBLIST_FIELD_ID = 'custrecord_xrc_bes_billing_date';
        const BILLING_START_DATE_SUBLIST_FIELD_ID = 'custrecord_xrc_billing_start_date';
        const BILLING_DATE_SUBLIST_FIELD_ID = 'custrecord_xrc_esc_sched_billing_date';
        const RENTAL_ESCALATION_SUBLIST_FIELD_ID = 'custrecord_xrc_esc_sched_rental_esc';
        const FIXED_BASIC_RENT_SUBLIST_FIELD_ID = 'custrecord_xrc_esc_sched_fixd_basic_rent';
        const ESCALATED_BASIC_RENT_SUBLIST_FIELD_ID = 'custrecord_xrc_esc_sched_esc_basic_rent';
        const CUSA_ESCALATION_PERCENTAGE_SUBLIST_FIELD_ID = 'custrecord_xrc_esc_sched_cusa_esc_prcnt';
        const ESCALATED_CUSA_SUBLIST_FIELD_ID = 'custrecord_xrc_esc_sched_esc_cusa';
        const FIXED_CUSA_SUBLIST_FIELD_ID = 'custrecord_xrc_esc_sched_fixed_cusa';
        const FIXED_SECURITY_DEPOSIT_SUBLIST_FIELD_ID = 'custrecord_xrc_esc_sched_fxd_sec_dep';
        const ADJUSTED_SECURITY_DEPOSIT_SUBLIST_FIELD_ID = 'custrecord_xrc_esc_sched_adj_sec_dep';
        const SECURITY_DEPOSIT_ADJUSTMENT_SUBLIST_FIELD_ID = 'custrecord_xrc_esc_sched_sec_dep_adj';
        const LEASE_PERIOD_FIELD_ID = 'custbody_xrc_lease_period';
        const CURRENT_LEASE_PERIOD_FIELD_ID = 'custbody_xrc_current_lease_period';
        const CURRENT_LEASE_YEAR_FIELD_ID = 'custbody_xrc_current_lease_year';
        const LEASE_COMMENCEMENT_FIELD_ID = 'custbody_xrc_lease_commencement';
        const LEASE_EXPIRY_FIELD_ID = 'custbody_xrc_lease_expiry';
        const BASIC_RENT_FIELD_ID = 'custbody_xrc_basic_rent';
        const CUSA_FIELD_ID = 'custbody_xrc_cusa';
        const RENTAL_ESCALATION_PERCENTAGE_FIELD_ID = 'custbody_xrc_rental_escalation_percent';
        const CUSA_ESCALATION_PERCENTAGE_FIELD_ID = 'custbody_xrc_cusa_escalation_percent';
        const PERIODS_FOR_SECURITY_DEPOSIT_FIELD_ID = 'custbody_xrc_period_sec_dep';
        const PERMITTED_FIELD_ID = 'custbody_xrc_lm_permitted';
        const SUBSIDIARY_FIELD_ID = 'subsidiary';
        const LOCATION_FIELD_ID = 'location';
        const DEPARTMENT_FIELD_ID = 'department';
        const CLASS_FIELD_ID = 'class';
        const TENANT_FIELD_ID = 'entity';
        const LEASE_TYPE_FIELD_ID = 'custbody_xrc_lease_type';
        const INTEREST_RATE_FOR_UNPAID_BALANCE_FIELD_ID = 'custbody_xrc_interest_rate_unpaid';
        const PRO_RATED_LEASE_EXPIRTY_FIELD_ID = 'custbody_xrc_pro_rated_lease_expiry';
        const LEASE_PERIOD_TYPE_FIELD_ID = 'custbody_xrc_lease_period_type';
        const ONE_TIME_PAYMENT_TYPE_ID = '3';

        const BSCHED_TENANT_FIELD_ID = 'custrecord_xrc_tenant7';
        const BSCHED_SUBSIDIARY_FIELD_ID = 'custrecord_xrc_subsidiary7';
        const BSCHED_LOCATION_FIELD_ID = 'custrecord_xrc_loc7';
        const BSCHED_DEPARTMENT_FIELD_ID = 'custrecord_xrc_dept7';
        const BSCHED_CLASS_FIELD_ID = 'custrecord_xrc_class7';
        const BSCHED_LEASE_TYPE_FIELD_ID = 'custrecord_xrc_lease_type7';
        const BSCHED_INTEREST_RATE_FIELD_ID = 'custrecord_xrc_bes_interestrate';
        const BSCHED_VARIABLE_RENT_ITEM_CODE_FIELD_ID = 'custrecord_xrc_variable_rent_item_code';
        const BSCHED_FIXED_RENT_ITEM_CODE_FIELD_ID = 'custrecord_xrc_rent_item_code';
        const BSCHED_ADMIN_FEE_ITEM_CODE_FIELD_ID = 'custrecord_xrc_admin_fee_item_code';
        const BSCHED_AIRCON_CHARGE_ITEM_CODE_FIELD_ID = 'custrecord_xrc_aircon_charge_item_code';
        const BSCHED_BIOAUGMENTATION_ITEM_CODE_FIELD_ID = 'custrecord_xrc_bioaugmentation_item_code';
        const BSCHED_CUSA_ITEM_CODE_FIELD_ID = 'custrecord_xrc_cusa_item_code';
        const BSCHED_ELECTRICITY_CHARGE_ITEM_CODE_FIELD_ID = 'custrecord_xrc_elec_charge_item_code';
        const BSCHED_WATER_CHARGE_ITEM_CODE_FIELD_ID = 'custrecord_xrc_water_charge_item_code';
        const BSCHED_BOTTLED_WATER_ITEM_CODE_FIELD_ID = 'custrecord_xrc_bottled_water';
        const BSCHED_LPG_CHARGE_ITEM_CODE_FIELD_ID = 'custrecord_xrc_lpg_charge_item_code';
        const BSCHED_GEN_SET_CHARGE_ITEM_CODE_FIELD_ID = 'custrecord_xrc_genset_charge_item_code';
        const BSCHED_MSF_ITEM_CODE_FIELD_ID = 'custrecord_xrc_msf_item_code';
        const BSCHED_SERVICE_REQUEST_ITEM_CODE_FIELD_ID = 'custrecord_xrc_service_req_item_code';
        const BSCHED_LATE_OPENING_EARLY_CLOSING_ITEM_CODE_FIELD_ID = 'custrecord_xrc_lateop_earlyclose_item';
        const BSCHED_PEST_CONTROL_ITEM_CODE_FIELD_ID = 'custrecord_xrc_pest_control_item_code';
        const BSCHED_TENANT_VIOLATION_ITEM_CODE_FIELD_ID = 'custrecord_xrc_tenant_violation_item';
        const BSCHED_CGL_INSURANCE_ITEM_CODE_FIELD_ID = 'custrecord_xrc_cgl_ins_item_code';
        const BSCHED_ID_CHARGE_ITEM_CODE_FIELD_ID = 'custrecord_xrc_id_charge_item_code';
        const BSCHED_PENALTY_FOR_LATE_CLOSING_ITEM_CODE_FIELD_ID = 'custrecord_xrc_penalty_late_close_item';
        const BSCHED_PENALTY_FOR_UNPAID_BAL_ITEM_CODE_FIELD_ID = 'custrecord_xrc_bes_pen_unpaid_itemcode';
        const BSCHED_PREPARED_BY_FIELD_ID = 'custrecord_xrc_prepared_by7';
        const BSCHED_NEXT_ESCALATION_DATE_FIELD_ID = 'custrecord_xrc_next_esc_sched';
        const BSCHED_VIEWED_FIELD_ID = 'custrecord_xrc_esc_sched_viewed';


        function getInputData(context) {

            return createSalesOrderSearch();

        }

        function reduce(context) {

            try {

                log.debug('values', context.values[0]);

                var so_rec = record.load({
                    type: record.Type.SALES_ORDER,
                    id: context.values[0],
                    isDynamic: true,
                });

                // var historical_values_length = JSON.parse(so_rec.getValue('custbody_xrc_historical_values')).length;

                // log.debug('length', value.id + ' => ' + so_rec.getLineCount({ sublistId: ESCALATION_SCHEDULE_SUBLIST_ID }));

                var bsched_sublist_length = so_rec.getLineCount({ sublistId: ESCALATION_SCHEDULE_SUBLIST_ID });

                for (var i = 0; i < bsched_sublist_length; i++) {

                    so_rec.selectLine({
                        sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                        line: i,
                    });

                    so_rec.setCurrentSublistValue({
                        sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                        fieldId: BSCHED_TENANT_FIELD_ID,
                        value: so_rec.getValue(TENANT_FIELD_ID),
                    });

                    so_rec.setCurrentSublistValue({
                        sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                        fieldId: BSCHED_SUBSIDIARY_FIELD_ID,
                        value: so_rec.getValue(SUBSIDIARY_FIELD_ID),
                    });

                    so_rec.setCurrentSublistValue({
                        sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                        fieldId: BSCHED_LOCATION_FIELD_ID,
                        value: so_rec.getValue(LOCATION_FIELD_ID),
                    });

                    so_rec.commitLine({
                        sublistId: ESCALATION_SCHEDULE_SUBLIST_ID
                    });

                }

                // if (bsched_sublist_length == 0) {

                //     so_rec.setValue('custbody_xrc_pto_checkbox', true);

                //     generateBillingSchedules(so_rec);

                so_rec.save({
                    ignoreMandatoryFields: true,
                });

                // }


            } catch (error) {

                log.debug('error', error);

            }
        }

        function createSalesOrderSearch() {

            var so_ids = [];

            var sales_order_search = search.create({
                type: "customrecord_xrc_escalation_schedule",
                filters:
                    [
                        ["custrecord_xrc_esc_sched_billing_date", "onorbefore", "nextmonth"],
                        "AND",
                        ["custrecord_xrc_bes_utilities_uploaded", "is", "F"],
                        "AND",
                        ["custrecord_xrc_tenant7", "anyof", "@NONE@"]

                    ],
                columns:
                    [
                        search.createColumn({
                            name: "internalid",
                            join: "CUSTRECORD_XRC_ESC_SCHED_ESTIMATE",
                            summary: "GROUP",
                            label: "Internal ID",
                            sort: search.Sort.ASC
                        })
                    ]
            });

            sales_order_search.run().each(function (result) {
                var so_id = result.getValue({
                    name: "internalid",
                    join: "CUSTRECORD_XRC_ESC_SCHED_ESTIMATE",
                    summary: "GROUP",
                });

                so_ids.push(so_id);

                return true;
            });

            return so_ids;
        }

        return {
            getInputData: getInputData,
            reduce: reduce,
        };
    }
);