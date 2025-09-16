/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 16, 2024
 * 
 */
define(['N/currentRecord', '/SuiteScripts/utils/NSI_CM_InputDialog', 'N/search', 'N/runtime', 'N/format'],

    function (m_currentRecord, dialog, search, runtime, format) {

        const MODE_CREATE = 'create';
        const MODE_EDIT = 'edit';
        const MODE_COPY = 'copy';
        const CUSTOM_FORM_FIELD_ID = 'customform';
        const IC_FORM_ID = '237';
        const LM_FORM_ID = '233';
        const CUSTOMER_FIELD_ID = 'entity';
        const CATEGORY_FIELD_ID = 'category';
        const CATEGORY_SUBISIDIARIES = '3';
        const PARAM_ENTITY_ID = 'entity';
        const PARAM_ORIGIN_ID = 'origin_id';
        const ESCALATION_SCHEDULE_SUBLIST_ID = 'custpage_escalation_schedule';
        const YEAR_SUBLIST_FIELD_ID = 'custpage_year';
        const LEASE_PERIOD_SUBLIST_FIELD_ID = 'custpage_lease_period';
        const RENTAL_ESCALATION_SUBLIST_FIELD_ID = 'custpage_rental_escalation';
        const FIXED_BASIC_RENT_SUBLIST_FIELD_ID = 'custpage_fixed_basic_rent';
        const ESCALATED_BASIC_RENT_SUBLIST_FIELD_ID = 'custpage_escalated_basic_rent';
        const CUSA_ESCALATION_PERCENTAGE_SUBLIST_FIELD_ID = 'custpage_cusa_escalation';
        const ESCALATED_CUSA_SUBLIST_FIELD_ID = 'custpage_escalated_cusa';
        const FIXED_CUSA_SUBLIST_FIELD_ID = 'custpage_fixed_cusa';
        const FIXED_SECURITY_DEPOSIT_SUBLIST_FIELD_ID = 'custpage_fixed_sec_dep';
        const ADJUSTED_SECURITY_DEPOSIT_SUBLIST_FIELD_ID = 'custpage_adj_sec_dep';
        const SECURITY_DEPOSIT_ADJUSTMENT_SUBLIST_FIELD_ID = 'custpage_sec_dep_adj';
        const CREATED_FROM_FIELD_ID = 'createdfrom';
        const LEASE_EXPIRY_FIELD_ID = 'custbody_xrc_lease_expiry';
        const HISTORICAL_VALUES_FIELD_ID = 'custbody_xrc_historical_values';
        const PERIODS_FOR_SECURITY_DEPOSIT_FIELD_ID = 'custbody_xrc_period_sec_dep';
        const ACTUAL_BASIC_RENT_FIELD_ID = 'custbody_xrc_basic_rent';
        const CUSA_FIELD_ID = 'custbody_xrc_cusa';
        const CURRENT_LEASE_YEAR_FIELD_ID = 'custbody_xrc_current_lease_year';
        const CURRENT_LEASE_PERIOD_FIELD_ID = 'custbody_xrc_current_lease_period';
        const LEASE_COMMENCEMENT_FIELD_ID = 'custbody_xrc_lease_commencement';
        const LEASE_PERIOD_FIELD_ID = 'custbody_xrc_lease_period';
        const BASIC_RENT_FIELD_ID = 'custbody_xrc_basic_rent';
        const RENTAL_ESCALATION_PERCENTAGE_FIELD_ID = 'custbody_xrc_rental_escalation_percent';
        const CUSA_ESCALATION_PERCENTAGE_FIELD_ID = 'custbody_xrc_cusa_escalation_percent';
        const ITEMS_SUBLIST_ID = 'item';
        const ITEMS_SUBLIST_FIELD_ID = 'item';
        const FIXED_RENT_ITEM_CODE = '5233';
        const VARIABLE_RENT_ITEM_CODE = '5255';
        const QUANTITY_SUBLIST_FIELD_ID = 'quantity';
        const TRUE_BILLING_DATE_SUBLIST_FIELD_ID = 'custpage_true_billing_date';
        const BILLING_START_DATE_SUBLIST_FIELD_ID = 'custpage_billing_start_date';
        const BILLING_DATE_SUBLIST_FIELD_ID = 'custpage_billing_date';
        const ACTUAL_RATE_PER_SQM_FIELD_ID = 'custbody_xrc_actual_rate_per_sqm';
        const APPROX_FLR_AREA_SQM_FIELD_ID = 'custbody_xrc_approx_flr_area';
        const SECURITY_DEPOSIT_FIELD_ID = 'custbody_xrc_security_deposit';
        const LEASE_TYPE_FIELD_ID = 'custbody_xrc_lease_type';
        const LEASE_TYPE_VARIABLE_RENT_ID = '2';
        const SECURITY_DEPOSIT_PER_PERIOD_FIELD_ID = 'custbody_xrc_sec_dep_per_period';
        const TOTAL_SECURITY_DEPOSIT_FIELD_ID = 'custbody_xrc_security_deposit';
        const PERIODS_FOR_ADVANCE_RENT_FIELD_ID = 'custbody_xrc_period_adv_rent';
        const ADVANCE_RENT_PER_PERIOD_FIELD_ID = 'custbody_xrc_adv_rent';
        const TOTAL_ADVANCE_RENT_FIELD_ID = 'custbody_xrc_advance_rent';
        const CONSTRUCTION_RENT_FREE_PERIOD_FIELD_ID = 'custbody_xrc_construct_period';
        const CONSTRUCTION_BOND_PER_PERIOD_FIELD_ID = 'custbody_xrc_construct_bond_period';
        const TOTAL_CONSTRUCTION_BOND_FIELD_ID = 'custbody_xrc_construction_bond';
        const RATE_SUBLIST_FIELD_ID = 'rate';
        const PRO_RATED_LEASE_EXPIRTY_FIELD_ID = 'custbody_xrc_pro_rated_lease_expiry';
        const LEASE_PERIOD_TYPE_FIELD_ID = 'custbody_xrc_lease_period_type';
        const ONE_TIME_PAYMENT_TYPE_ID = '3';


        const PREPARED_BY_FLD_ID = "custbody_xrc_prepared_by";
        const APPROVER_1_FIELD_ID = 'custbody_xrc_approver1';
        const APPROVER_2_FIELD_ID = 'custbody_xrc_approver2';
        const APPROVER_3_FIELD_ID = 'custbody_xrc_approver3';
        const APPROVAL_1_FLD_ID = "custbody_xrc_approval1";
        const APPROVAL_2_FLD_ID = "custbody_xrc_approval2";
        const APPROVAL_3_FLD_ID = "custbody_xrc_approval3";
        const APPROVAL_4_FLD_ID = "custbody_xrc_approval4";
        const APPROVAL_5_FLD_ID = "custbody_xrc_approval5";
        const APPROVAL_6_FLD_ID = "custbody_xrc_approval6";
        const APPROVAL_7_FLD_ID = "custbody_xrc_approval7";
        const FOR_APPROVAL_FLD_ID = "custbody_xrc_for_approval";
        const REJECTED_FLD_ID = "custbody1";
        const FINAL_SOA_NO_FIELD_ID = 'custbody_xrc_final_soa';
        const INITIAL_SOA_FIELD_ID = 'custbody_xrc_initial_soa';
        const INITIAL_SOA_TOTAL_AMOUNT_FIELD_ID = 'custbody_xrc_isoa_amount';
        const INITIAL_SOA_TOTAL_PAYMENT_FIELD_ID = 'custbody_xrc_isoa_total_pay';
        const INITIAL_SOA_UNPAID_BALANCE_FIELD_ID = 'custbody_xrc_isoa_unpaid_bal';
        const PTO_FIELD_ID = 'custbody_xrc_pto_checkbox';

        var g_mode = 'create'; // Initial value only
        var g_has_generated = true;
        var g_currentRecord = null;
        var g_isPTOBtnClicked = false;
        var g_isSubmitForApprovalBtnClick = false;
        var g_isApproveBtnClick = false;
        var g_isRejectBtnClick = false;
        var g_isCloseOrderBtnClick = false;
        var g_isFinalSOABtnClick = false;
        var g_isRenewBtnClick = false;
        var g_isCommencementDateChanged = false;
        var g_leaseCommencementHistoricalValue = '';
        var g_recalc_required = true;


        function pageInit(context) {

            g_currentRecord = context.currentRecord;

            g_mode = context.mode;

            var currentRecord = context.currentRecord;

            var entity_param = getParameterWithId(PARAM_ENTITY_ID);

            if (entity_param) {

                onSubsidiarVendoryCategoryForm(currentRecord, entity_param);

            }

            console.log(g_mode);

            // Clearing approval fields on record create
            if (g_mode === MODE_COPY) {

                var created_from = currentRecord.getValue(CREATED_FROM_FIELD_ID);

                // if (created_from) {
                var currentUser = runtime.getCurrentUser();
                currentRecord.setValue(PREPARED_BY_FLD_ID, currentUser.id);
                [
                    APPROVAL_1_FLD_ID,
                    APPROVAL_2_FLD_ID,
                    APPROVAL_3_FLD_ID,
                    APPROVAL_4_FLD_ID,
                    APPROVAL_5_FLD_ID,
                    APPROVAL_6_FLD_ID,
                    APPROVAL_7_FLD_ID,
                    FOR_APPROVAL_FLD_ID,
                    REJECTED_FLD_ID,
                    APPROVER_1_FIELD_ID,
                    APPROVER_2_FIELD_ID,
                    APPROVER_3_FIELD_ID,
                    FINAL_SOA_NO_FIELD_ID,
                    INITIAL_SOA_FIELD_ID,
                    INITIAL_SOA_TOTAL_AMOUNT_FIELD_ID,
                    INITIAL_SOA_TOTAL_PAYMENT_FIELD_ID,
                    INITIAL_SOA_UNPAID_BALANCE_FIELD_ID,
                    PTO_FIELD_ID,
                ].forEach((field) => {
                    try {
                        currentRecord.setValue(field, '');
                    } catch (error) {
                        currentRecord.setValue(field, false);
                    }
                });
                // }

                var origin = getParameterWithId(PARAM_ORIGIN_ID);

                if (origin) {

                    setupLeaseMemoRenewal(currentRecord);

                }

            }

        }

        function fieldChanged(context) {

            var currentRecord = context.currentRecord;

            var fieldId = context.fieldId;

            var sublistId = context.sublistId;

            try {

                if (sublistId === ESCALATION_SCHEDULE_SUBLIST_ID) {

                    var lease_commencement = g_currentRecord.getValue(LEASE_COMMENCEMENT_FIELD_ID);

                    var isNotFirstDay = lease_commencement.getDate() > 1 ? true : false;

                    if (currentRecord.getValue(HISTORICAL_VALUES_FIELD_ID)) {

                        var historical_values = JSON.parse(currentRecord.getValue(HISTORICAL_VALUES_FIELD_ID));

                        var line = context.line;

                        if (!isNotFirstDay) {
                            line += 1;
                        }

                        var period = currentRecord.getCurrentSublistValue({
                            sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                            fieldId: LEASE_PERIOD_SUBLIST_FIELD_ID,
                        });

                        console.log(period);

                        var historical_value_period = getPeriod(historical_values, period);

                        console.log(historical_value_period);

                        if (fieldId === RENTAL_ESCALATION_SUBLIST_FIELD_ID) {

                            var rental_escalation_percentage = currentRecord.getCurrentSublistValue({
                                sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                                fieldId: RENTAL_ESCALATION_SUBLIST_FIELD_ID,
                            }) || 0;

                            var fixed_basic_rent = currentRecord.getCurrentSublistValue({
                                sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                                fieldId: FIXED_BASIC_RENT_SUBLIST_FIELD_ID,
                            });

                            // Calculate for the escalated basic rent
                            currentRecord.setCurrentSublistValue({
                                sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                                fieldId: ESCALATED_BASIC_RENT_SUBLIST_FIELD_ID,
                                value: (((100 + rental_escalation_percentage) / 100) * fixed_basic_rent),
                            });

                            console.log('test0');

                            if (period) historical_value_period[RENTAL_ESCALATION_SUBLIST_FIELD_ID] = rental_escalation_percentage;

                            console.log('test1');

                            if (period) historical_value_period[ESCALATED_BASIC_RENT_SUBLIST_FIELD_ID] = (((100 + rental_escalation_percentage) / 100) * fixed_basic_rent);

                            // Check if the period is the start of year
                            // if (isNewYear(period)) {

                            var period_for_security_deposit = currentRecord.getValue(PERIODS_FOR_SECURITY_DEPOSIT_FIELD_ID);

                            if (rental_escalation_percentage) {

                                if ((fixed_basic_rent * period_for_security_deposit)) { // null check

                                    currentRecord.setCurrentSublistValue({
                                        sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                                        fieldId: FIXED_SECURITY_DEPOSIT_SUBLIST_FIELD_ID,
                                        value: fixed_basic_rent * period_for_security_deposit,
                                    });

                                    if (period) historical_value_period[FIXED_SECURITY_DEPOSIT_SUBLIST_FIELD_ID] = (fixed_basic_rent * period_for_security_deposit);

                                }


                                var escalated_basic_rent = g_currentRecord.getCurrentSublistValue({
                                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                                    fieldId: ESCALATED_BASIC_RENT_SUBLIST_FIELD_ID,
                                });

                                if ((escalated_basic_rent * period_for_security_deposit)) {

                                    g_currentRecord.setCurrentSublistValue({
                                        sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                                        fieldId: ADJUSTED_SECURITY_DEPOSIT_SUBLIST_FIELD_ID,
                                        value: escalated_basic_rent * period_for_security_deposit,
                                    });

                                    if (period) historical_value_period[ADJUSTED_SECURITY_DEPOSIT_SUBLIST_FIELD_ID] = (escalated_basic_rent * period_for_security_deposit);

                                }

                                var fixed_security_deposit = currentRecord.getCurrentSublistValue({
                                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                                    fieldId: FIXED_SECURITY_DEPOSIT_SUBLIST_FIELD_ID,
                                });

                                var adjusted_security_deposit = currentRecord.getCurrentSublistValue({
                                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                                    fieldId: ADJUSTED_SECURITY_DEPOSIT_SUBLIST_FIELD_ID,
                                });

                                currentRecord.setCurrentSublistValue({
                                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                                    fieldId: SECURITY_DEPOSIT_ADJUSTMENT_SUBLIST_FIELD_ID,
                                    value: adjusted_security_deposit ? (adjusted_security_deposit - fixed_security_deposit) : fixed_security_deposit,
                                });

                                if (period) historical_value_period[SECURITY_DEPOSIT_ADJUSTMENT_SUBLIST_FIELD_ID] = (adjusted_security_deposit ? (adjusted_security_deposit - fixed_security_deposit) : fixed_security_deposit);

                            } else {

                                g_currentRecord.setCurrentSublistValue({
                                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                                    fieldId: FIXED_SECURITY_DEPOSIT_SUBLIST_FIELD_ID,
                                    value: '',
                                });

                                if (period) historical_value_period[FIXED_SECURITY_DEPOSIT_SUBLIST_FIELD_ID] = '';

                                g_currentRecord.setCurrentSublistValue({
                                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                                    fieldId: ADJUSTED_SECURITY_DEPOSIT_SUBLIST_FIELD_ID,
                                    value: '',
                                });

                                if (period) historical_value_period[ADJUSTED_SECURITY_DEPOSIT_SUBLIST_FIELD_ID] = '';

                                g_currentRecord.setCurrentSublistValue({
                                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                                    fieldId: SECURITY_DEPOSIT_ADJUSTMENT_SUBLIST_FIELD_ID,
                                    value: '',
                                });

                                if (period) historical_value_period[SECURITY_DEPOSIT_ADJUSTMENT_SUBLIST_FIELD_ID] = '';

                            }


                            // if (rental_escalation_percentage) {


                            // } else {

                            // g_currentRecord.setCurrentSublistValue({
                            //     sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                            //     fieldId: FIXED_SECURITY_DEPOSIT_SUBLIST_FIELD_ID,
                            //     value: '',
                            // });

                            // g_currentRecord.setCurrentSublistValue({
                            //     sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                            //     fieldId: ADJUSTED_SECURITY_DEPOSIT_SUBLIST_FIELD_ID,
                            //     value: '',
                            // });

                            // g_currentRecord.setCurrentSublistValue({
                            //     sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                            //     fieldId: SECURITY_DEPOSIT_ADJUSTMENT_SUBLIST_FIELD_ID,
                            //     value: '',
                            // });

                            // }

                            // }

                        } else if (fieldId === CUSA_ESCALATION_PERCENTAGE_SUBLIST_FIELD_ID || fieldId === FIXED_CUSA_SUBLIST_FIELD_ID) {

                            var cusa_escalation_percentage = currentRecord.getCurrentSublistValue({
                                sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                                fieldId: CUSA_ESCALATION_PERCENTAGE_SUBLIST_FIELD_ID,
                            });

                            var fixed_cusa = currentRecord.getCurrentSublistValue({
                                sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                                fieldId: FIXED_CUSA_SUBLIST_FIELD_ID,
                            });

                            // Calculate for the escalated basic rent
                            currentRecord.setCurrentSublistValue({
                                sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                                fieldId: ESCALATED_CUSA_SUBLIST_FIELD_ID,
                                value: (((100 + cusa_escalation_percentage) / 100) * fixed_cusa),
                            });

                            if (period) historical_value_period[CUSA_ESCALATION_PERCENTAGE_SUBLIST_FIELD_ID] = cusa_escalation_percentage;

                            if (period) historical_value_period[ESCALATED_CUSA_SUBLIST_FIELD_ID] = (((100 + cusa_escalation_percentage) / 100) * fixed_cusa);

                        } else if (fieldId === FIXED_BASIC_RENT_SUBLIST_FIELD_ID) {

                            var fixed_basic_rent = currentRecord.getCurrentSublistValue({
                                sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                                fieldId: FIXED_BASIC_RENT_SUBLIST_FIELD_ID,
                            });

                            var rental_escalation_percentage = currentRecord.getCurrentSublistValue({
                                sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                                fieldId: RENTAL_ESCALATION_SUBLIST_FIELD_ID,
                            });

                            // Calculate for the escalated basic rent
                            currentRecord.setCurrentSublistValue({
                                sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                                fieldId: ESCALATED_BASIC_RENT_SUBLIST_FIELD_ID,
                                value: (((100 + rental_escalation_percentage) / 100) * fixed_basic_rent),
                            });

                            if (period) historical_value_period[ESCALATED_BASIC_RENT_SUBLIST_FIELD_ID] = (((100 + rental_escalation_percentage) / 100) * fixed_basic_rent);

                        } else if (fieldId === FIXED_SECURITY_DEPOSIT_SUBLIST_FIELD_ID || fieldId === ADJUSTED_SECURITY_DEPOSIT_SUBLIST_FIELD_ID) {

                            var fixed_security_deposit = currentRecord.getCurrentSublistValue({
                                sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                                fieldId: FIXED_SECURITY_DEPOSIT_SUBLIST_FIELD_ID,
                            });

                            var adjusted_security_deposit = currentRecord.getCurrentSublistValue({
                                sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                                fieldId: ADJUSTED_SECURITY_DEPOSIT_SUBLIST_FIELD_ID,
                            });

                            currentRecord.setCurrentSublistValue({
                                sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                                fieldId: SECURITY_DEPOSIT_ADJUSTMENT_SUBLIST_FIELD_ID,
                                value: adjusted_security_deposit ? (adjusted_security_deposit - fixed_security_deposit) : fixed_security_deposit,
                            });

                            if (period) historical_value_period[FIXED_SECURITY_DEPOSIT_SUBLIST_FIELD_ID] = (fixed_security_deposit);

                            if (period) historical_value_period[ADJUSTED_SECURITY_DEPOSIT_SUBLIST_FIELD_ID] = (adjusted_security_deposit);

                            if (period) historical_value_period[SECURITY_DEPOSIT_ADJUSTMENT_SUBLIST_FIELD_ID] = (adjusted_security_deposit ? (adjusted_security_deposit - fixed_security_deposit) : fixed_security_deposit);

                        }

                        currentRecord.setValue(HISTORICAL_VALUES_FIELD_ID, JSON.stringify(historical_values));

                    }

                }

                if (fieldId === APPROX_FLR_AREA_SQM_FIELD_ID || fieldId === ACTUAL_RATE_PER_SQM_FIELD_ID) {

                    var approx_flr_area_sqm = currentRecord.getValue(APPROX_FLR_AREA_SQM_FIELD_ID);

                    var actual_rate_per_sqm = currentRecord.getValue(ACTUAL_RATE_PER_SQM_FIELD_ID);

                    var basic_rent = approx_flr_area_sqm * actual_rate_per_sqm;

                    currentRecord.setValue(BASIC_RENT_FIELD_ID, basic_rent);

                    currentRecord.setValue(SECURITY_DEPOSIT_FIELD_ID, (basic_rent * 3));

                } else if (fieldId === BASIC_RENT_FIELD_ID || fieldId === LEASE_PERIOD_FIELD_ID) {

                    updateRentItem(currentRecord);

                    var actual_basic_rent = currentRecord.getValue(BASIC_RENT_FIELD_ID);

                    // Update specific fields on Actual Basic Rent change
                    currentRecord.setValue(SECURITY_DEPOSIT_PER_PERIOD_FIELD_ID, actual_basic_rent);

                    currentRecord.setValue(ADVANCE_RENT_PER_PERIOD_FIELD_ID, actual_basic_rent);

                    currentRecord.setValue(CONSTRUCTION_BOND_PER_PERIOD_FIELD_ID, actual_basic_rent);

                } else if (fieldId === LEASE_TYPE_FIELD_ID) {

                    putItem(currentRecord);

                } else if (fieldId === PERIODS_FOR_SECURITY_DEPOSIT_FIELD_ID || fieldId === SECURITY_DEPOSIT_PER_PERIOD_FIELD_ID) {

                    // Multiplying Periods for Security Deposit to Security Deposit per period
                    // and setting it to Total Security Deposit
                    currentRecord.setValue(TOTAL_SECURITY_DEPOSIT_FIELD_ID, currentRecord.getValue(PERIODS_FOR_SECURITY_DEPOSIT_FIELD_ID) * currentRecord.getValue(SECURITY_DEPOSIT_PER_PERIOD_FIELD_ID));

                } else if (fieldId === PERIODS_FOR_ADVANCE_RENT_FIELD_ID || fieldId === ADVANCE_RENT_PER_PERIOD_FIELD_ID) {

                    // Multiplying Periods for Advance Rent to Advance Rent per period
                    // and setting it to Total Advance Rent
                    currentRecord.setValue(TOTAL_ADVANCE_RENT_FIELD_ID, currentRecord.getValue(PERIODS_FOR_ADVANCE_RENT_FIELD_ID) * currentRecord.getValue(ADVANCE_RENT_PER_PERIOD_FIELD_ID));

                } else if (fieldId === CONSTRUCTION_RENT_FREE_PERIOD_FIELD_ID || fieldId === CONSTRUCTION_BOND_PER_PERIOD_FIELD_ID) {

                    // Multiplying Construction (Rent Free) Period to Construction Bond per period
                    // and setting it to Total Construction Bond
                    currentRecord.setValue(TOTAL_CONSTRUCTION_BOND_FIELD_ID, currentRecord.getValue(CONSTRUCTION_RENT_FREE_PERIOD_FIELD_ID) * currentRecord.getValue(CONSTRUCTION_BOND_PER_PERIOD_FIELD_ID));

                } else if (fieldId === LEASE_PERIOD_FIELD_ID || fieldId === LEASE_COMMENCEMENT_FIELD_ID || fieldId === PRO_RATED_LEASE_EXPIRTY_FIELD_ID) {

                    var lease_period_type = currentRecord.getValue(LEASE_PERIOD_TYPE_FIELD_ID);

                    var lease_period = g_currentRecord.getValue(LEASE_PERIOD_FIELD_ID);

                    var lease_commencement_date = g_currentRecord.getValue(LEASE_COMMENCEMENT_FIELD_ID);

                    if (!lease_period || !lease_commencement_date) return;

                    var is_not_first_day = lease_commencement_date.getDate() > 1;

                    var pro_rated_lease_expiry = currentRecord.getValue(PRO_RATED_LEASE_EXPIRTY_FIELD_ID);

                    var yearOffset = parseInt(lease_period / 12);

                    var targetYear = lease_commencement_date.getFullYear() + yearOffset;

                    var targetMonth = lease_commencement_date.getMonth();

                    var lease_expiry = addMonths(lease_commencement_date, lease_period === 1 && !is_not_first_day ? 0 : lease_period);

                    if (lease_period_type === ONE_TIME_PAYMENT_TYPE_ID) {

                        var lease_expiry = addMonths(lease_commencement_date, 0);

                        lease_expiry = getLastDateOfMonth(lease_expiry.getFullYear(), lease_expiry.getMonth());

                    } else if (is_not_first_day) {

                        var day = pro_rated_lease_expiry ? lease_commencement_date.getDate() - 1 : getLastDateOfMonth(lease_expiry.getFullYear(), lease_expiry.getMonth()).getDate();

                        lease_expiry = new Date(lease_expiry.getFullYear(), lease_expiry.getMonth(), day);

                    } else {

                        lease_expiry = getLastDateOfMonth(lease_expiry.getFullYear(), lease_period === 1 ? lease_expiry.getMonth() : lease_expiry.getMonth() - 1);

                    }

                    g_currentRecord.setValue(LEASE_EXPIRY_FIELD_ID, lease_expiry);

                }

                if (fieldId === RENTAL_ESCALATION_PERCENTAGE_FIELD_ID || fieldId === CUSA_FIELD_ID || fieldId === CUSA_ESCALATION_PERCENTAGE_FIELD_ID || fieldId === LEASE_EXPIRY_FIELD_ID) {

                    if (g_has_generated) {

                        alert('Changing values for Lease Expiry, Common Use Service Area (CUSA), Rental Escalation % or Cusa Escalation % will require you to re-generate the escalation schedule.');

                        g_has_generated = false;

                    }

                }

            } catch (error) {

            }


        }

        function postSourcing(context) {

            var currentRecord = context.currentRecord;

            var fieldId = context.fieldId;

            if (fieldId === CUSTOMER_FIELD_ID) {

                var customer = currentRecord.getValue(fieldId);

                onSubsidiarVendoryCategoryForm(currentRecord, customer);

            }

        }

        function sublistChanged(context) {

            var currentRecord = context.currentRecord;

            var sublistId = context.sublistId;

            if (sublistId === ESCALATION_SCHEDULE_SUBLIST_ID) {

                g_recalc_required = true;

            }

        }

        function saveRecord(context) {

            if (!g_has_generated) {

                alert("Please generate/re-generate escalation schedule first.");

                return false;
            }

            // if (g_recalc_required) {

            //     alert("Escalation Schedules has been modified. Please recalc.");
            // }

            return true;

        }


        function onSubsidiarVendoryCategoryForm(currentRecord, customer) {

            // Get the category of the customer
            search.lookupFields.promise({
                type: search.Type.CUSTOMER,
                id: customer,
                columns: [CATEGORY_FIELD_ID],
            }).then(function (result) {

                // Set the form depending on the category
                var form = currentRecord.getValue(CUSTOM_FORM_FIELD_ID);

                if (result[CATEGORY_FIELD_ID][0].value === CATEGORY_SUBISIDIARIES) {

                    if (form !== IC_FORM_ID) {

                        currentRecord.setValue(CUSTOM_FORM_FIELD_ID, IC_FORM_ID);

                    }

                } else {

                    if (form !== LM_FORM_ID) {

                        currentRecord.setValue(CUSTOM_FORM_FIELD_ID, LM_FORM_ID);

                    }

                }

            });

        }

        function putItem(currentRecord) {

            var lineCount = currentRecord.getLineCount({
                sublistId: ITEMS_SUBLIST_ID,
            });

            // Remove lines if there is any
            if (lineCount > 0) {

                // Loop backward to avoid index issues when removing lines
                for (var line = lineCount - 1; line >= 0; line--) {
                    currentRecord.removeLine({
                        sublistId: ITEMS_SUBLIST_ID,
                        line: line,
                        ignoreRecalc: true
                    });
                }

            }

            // Putting rent item on Items sublist
            var values = [currentRecord.getValue(LEASE_TYPE_FIELD_ID), currentRecord.getValue(LEASE_PERIOD_FIELD_ID), currentRecord.getValue(BASIC_RENT_FIELD_ID)];

            ['item', 'quantity', 'rate'].forEach((field, index) => {
                g_currentRecord.setCurrentSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: field,
                    value: field === 'item' ? (values[index] === LEASE_TYPE_VARIABLE_RENT_ID ? VARIABLE_RENT_ITEM_CODE : FIXED_RENT_ITEM_CODE) : values[index],
                    forceSyncSourcing: true,
                });
            });

            g_currentRecord.commitLine({
                sublistId: ITEMS_SUBLIST_ID,
            });


        }

        function updateRentItem(currentRecord) {

            var items_lines = currentRecord.getLineCount({
                sublistId: ITEMS_SUBLIST_ID,
            });

            for (var line = 0; line < items_lines; line++) {

                currentRecord.selectLine({
                    sublistId: ITEMS_SUBLIST_ID,
                    line: line,
                });

                var item = currentRecord.getCurrentSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: ITEMS_SUBLIST_FIELD_ID,
                });

                // Check if item codes matches with either Fixed or Variable Rent item code
                if (item === FIXED_RENT_ITEM_CODE || item === VARIABLE_RENT_ITEM_CODE) {

                    var basic_rent = currentRecord.getValue(BASIC_RENT_FIELD_ID);

                    var period = currentRecord.getValue(LEASE_PERIOD_FIELD_ID);

                    // Update the value with the current values
                    currentRecord.setCurrentSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: RATE_SUBLIST_FIELD_ID,
                        value: basic_rent,
                        forceSyncSourcing: true,
                    });

                    currentRecord.setCurrentSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: QUANTITY_SUBLIST_FIELD_ID,
                        value: period,
                        forceSyncSourcing: true,
                    });

                    currentRecord.commitLine({
                        sublistId: ITEMS_SUBLIST_ID,
                    });

                }

            }

        }

        function setupLeaseMemoRenewal(currentRecord) {

            g_leaseCommencementHistoricalValue = currentRecord.getValue(LEASE_COMMENCEMENT_FIELD_ID);

            var lease_expiry = currentRecord.getValue(LEASE_EXPIRY_FIELD_ID);

            var lease_commencement = getNextDate(lease_expiry);

            var parsed_date = format.parse({
                value: lease_commencement,
                type: format.Type.DATE
            });

            currentRecord.setValue({
                fieldId: LEASE_COMMENCEMENT_FIELD_ID,
                value: parsed_date,
                ignoreFieldChange: true,
            });

            [
                'custbody_xrc_final_soa_num', 'memo', 'custbody_xrc_actual_rate_per_sqm',
                'custbody_xrc_basic_rent', 'custbody_xrc_lease_period', 'custbody_xrc_turnover_date',
                'custbody_xrc_lease_expiry', 'custbody_xrc_current_lease_year', 'custbody_xrc_current_lease_period',
                'custbody_xrc_historical_values'
            ]
                .forEach(field => {

                    currentRecord.setValue({
                        fieldId: field,
                        value: '',
                        ignoreFieldChange: true,
                    });

                });


            currentRecord.setValue({
                fieldId: 'custbody_xrc_contract_type',
                value: '2', // Renewal
                ignoreFieldChange: true,
            });

            onRemoveAllLinesBtnClick();

            // removeAllItems();

        }

        function removeAllItems() {

            var lineCount = g_currentRecord.getLineCount({
                sublistId: ITEMS_SUBLIST_ID,
            });

            // Loop backward to avoid index issues when removing lines
            for (var line = lineCount - 1; line >= 0; line--) {
                g_currentRecord.removeLine({
                    sublistId: ITEMS_SUBLIST_ID,
                    line: line,
                    ignoreRecalc: true
                });
            }

        }

        function onSubmitForApprovalBtnClick(role_to_email) {

            var currentRecord = m_currentRecord.get();

            // Check if the button is already clicked
            // This is to prevent calling the link multiple times
            if (!g_isSubmitForApprovalBtnClick) {

                g_isSubmitForApprovalBtnClick = true;

                // Redirect to the approval link
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1494&deploy=1&action=submitforapproval&so_id=" + currentRecord.id + "&role_to_email=" + role_to_email;

            } else {

                alert('You have already submitted the form.');

            }


        }

        function onApproveBtnClick(approve_field, role_to_email) {

            var currentRecord = m_currentRecord.get();

            // Check if the button is already clicked
            // This is to prevent calling the link multiple times
            if (!g_isApproveBtnClick) {

                g_isApproveBtnClick = true;

                // Redirect to the approval link
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1494&deploy=1&action=approve&so_id=" + currentRecord.id + "&field=" + approve_field + "&role_to_email=" + role_to_email;

            } else {

                alert('You have already submitted the form.');

            }

        }

        function onRejectBtnClick() {

            var currentRecord = m_currentRecord.get();

            // Check if the button is already clicked
            // This is to prevent calling the link multiple times
            if (!g_isRejectBtnClick) {

                g_isRejectBtnClick = true;

                // Redirect to the approval link
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1494&deploy=1&action=reject&so_id=" + currentRecord.id;

            } else {

                alert('You have already submitted the form.');

            }

        }

        function onPTOBtnClick(lease_commencement_date) {

            var currentRecord = m_currentRecord.get();

            // Check if the button is already clicked
            // This is to prevent calling the link multiple times
            if (!g_isPTOBtnClicked) {

                g_isPTOBtnClicked = true;

                var options = {
                    title: 'Commencement Date (PTO)',
                    message: 'Commencement Date',
                    buttons: [{
                        label: 'OK',
                        value: 1
                    }, {
                        label: 'Cancel',
                        value: 2
                    }],
                    textarea: {
                        rows: 1,
                        cols: 45,
                        isMandatory: true,
                        caption: 'Date (MM/DD/YYYY)',
                        actionButtons: [1]
                    },
                };

                var success = function (result, value) {

                    if (result === 1) {

                        var { isValid, message } = validateDate(value, lease_commencement_date);

                        console.log(isValid);

                        if (isValid) {

                            // Redirect to the approval link
                            window.location.href = 'https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1494&deploy=1&action=pto&so_id=' + currentRecord.id + '&date=' + value;

                        } else {

                            g_isPTOBtnClicked = false;

                            alert(message);
                        }

                    } else {

                        g_isPTOBtnClicked = false;

                    }

                }

                var failure = function (result, value) {
                    alert('Input dialog closed by clicking button ' + result + ' | value: ' + value);
                }

                dialog.create(options, success, failure);

            } else {

                alert('You have already submitted the form.');

            }
        }

        function validateDate(stringDate, lease_commencement_date) {

            // Regular expression for MM/DD/YYYY format
            const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;

            var pto_date_digits = stringDate.split("/");

            var pto_date = new Date(pto_date_digits[2] + "-" + pto_date_digits[0] + "-" + pto_date_digits[1]);

            var lease_commencement_date_digits = lease_commencement_date.split("/");

            var parsed_lease_commencement_date = new Date(lease_commencement_date_digits[2] + "-" + lease_commencement_date_digits[0] + "-" + lease_commencement_date_digits[1]);

            // Test and return the string against the regex
            return {
                isValid: regex.test(stringDate) && (pto_date >= parsed_lease_commencement_date),
                message: !regex.test(stringDate) ? "Invalida date value. Please follow MM/DD/YYY date format." : (pto_date < parsed_lease_commencement_date) ? "PTO date cannot be an earlier date" : "valid",
            };
        }

        function getParameterWithId(param_id) {

            var url = new URL(window.location.href);

            var value = url.searchParams.get(param_id);

            return value;

        }

        async function onRecalcBtnClick() {

            // Show loading popup
            // const messageBox = Ext.MessageBox.show({
            //     title: 'Calculating...',
            //     msg: 'Recalculating billing schedule',
            //     wait: true,
            //     width: 250
            // });

            if (!g_has_generated) {

                alert("Please generate/re-generate escalatiom schedule first.");

                return;
            }

            var lease_commencement = g_currentRecord.getValue(LEASE_COMMENCEMENT_FIELD_ID);

            var pro_rated_lease_expiry = g_currentRecord.getValue(PRO_RATED_LEASE_EXPIRTY_FIELD_ID);

            var basic_rent = g_currentRecord.getValue(ACTUAL_BASIC_RENT_FIELD_ID) || 0;

            var cusa = g_currentRecord.getValue(CUSA_FIELD_ID) || 0;

            var current_lease_year = g_currentRecord.getValue(CURRENT_LEASE_YEAR_FIELD_ID) || 0;

            var lease_period = g_currentRecord.getValue(LEASE_PERIOD_FIELD_ID);

            var current_lease_period = g_currentRecord.getValue(CURRENT_LEASE_PERIOD_FIELD_ID) ? g_currentRecord.getValue(CURRENT_LEASE_PERIOD_FIELD_ID) - 1 : 0;

            // TODO: Update Historical Values

            var escalation_lines = g_currentRecord.getLineCount({
                sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
            });

            var period_for_security_deposit = g_currentRecord.getValue(PERIODS_FOR_SECURITY_DEPOSIT_FIELD_ID);

            // Separating variables for each column so it won't conflict with each other columns
            var current_year = current_lease_year, current_cusa_year = current_lease_year, current_rent_escalation = 0, current_cusa_escalation = 0;

            var early_rental_escalation = 0, early_cusa_escalation = 0;

            // Get the date on the Lease Commencement date
            var isNotFirstDay = lease_commencement.getDate() > 1 ? true : false;

            for (var line = 0; line < escalation_lines; line++, current_lease_period++) {

                g_currentRecord.selectLine({
                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    line: line,
                });

                var year = g_currentRecord.getCurrentSublistValue({
                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    fieldId: YEAR_SUBLIST_FIELD_ID,
                });

                if (line === 0) continue;

                if (isNotFirstDay ? isNewYear(current_lease_period) : isNewYear(current_lease_period + 1)) {

                    var period = g_currentRecord.getSublistValue({
                        sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                        fieldId: 'custpage_lease_period',
                        line: line - 1,
                    });

                    if (period > 0) {

                        basic_rent = g_currentRecord.getSublistValue({
                            sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                            fieldId: ESCALATED_BASIC_RENT_SUBLIST_FIELD_ID,
                            line: line - 1,
                        });

                        cusa = g_currentRecord.getSublistValue({
                            sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                            fieldId: ESCALATED_CUSA_SUBLIST_FIELD_ID,
                            line: line - 1,
                        });

                        console.log('current_lease_period', current_lease_period, 'line', line, 'basic_rent', basic_rent, 'cusa', cusa);

                    }

                }

                if ((current_lease_period + 1) === lease_period) {

                    var day = g_currentRecord.getValue(LEASE_EXPIRY_FIELD_ID).getDate();

                    var last_date = getLastDateOfMonth(g_currentRecord.getValue(LEASE_EXPIRY_FIELD_ID).getFullYear(), g_currentRecord.getValue(LEASE_EXPIRY_FIELD_ID).getMonth());

                    var pro_rated_rent = getProRatedRent(basic_rent, last_date, day);

                    g_currentRecord.setCurrentSublistValue({
                        sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                        fieldId: FIXED_BASIC_RENT_SUBLIST_FIELD_ID,
                        value: pro_rated_rent,
                    });

                } else {

                    g_currentRecord.setCurrentSublistValue({
                        sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                        fieldId: FIXED_BASIC_RENT_SUBLIST_FIELD_ID,
                        value: basic_rent,
                    });

                }


                g_currentRecord.setCurrentSublistValue({
                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    fieldId: FIXED_CUSA_SUBLIST_FIELD_ID,
                    value: cusa,
                });

                // console.log('line: ', line, 'year: ', year, 'current_year: ', current_year);

                // Resetting current_rent_escalation and current_cusa_escalation in new year
                if (year !== current_year) current_rent_escalation = 0;

                if (year !== current_cusa_year) current_cusa_escalation = 0;

                var rental_escalation = g_currentRecord.getCurrentSublistValue({
                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    fieldId: RENTAL_ESCALATION_SUBLIST_FIELD_ID,
                });

                var cusa_escalation = g_currentRecord.getCurrentSublistValue({
                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    fieldId: CUSA_ESCALATION_PERCENTAGE_SUBLIST_FIELD_ID,
                });

                if (isNotFirstDay ? (current_lease_period <= 12) : ((current_lease_period + 1) <= 12)) {

                    if (!early_rental_escalation) if (rental_escalation) early_rental_escalation = rental_escalation;

                    if (!early_cusa_escalation) if (cusa_escalation) early_cusa_escalation = cusa_escalation;

                } else {

                    // If new year, and there is a rental escalation, save the current year and rental escalation
                    if (current_lease_period !== 0 && (parseInt(year) !== parseInt(current_year))) {

                        console.log(current_lease_period, year, current_year);

                        current_year = year;

                        current_rent_escalation = rental_escalation;

                        var fixed_basic_rent = g_currentRecord.getCurrentSublistValue({
                            sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                            fieldId: FIXED_BASIC_RENT_SUBLIST_FIELD_ID,
                        });

                        g_currentRecord.setCurrentSublistValue({
                            sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                            fieldId: FIXED_SECURITY_DEPOSIT_SUBLIST_FIELD_ID,
                            value: fixed_basic_rent * period_for_security_deposit,
                        });

                        var escalated_basic_rent = g_currentRecord.getCurrentSublistValue({
                            sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                            fieldId: ESCALATED_BASIC_RENT_SUBLIST_FIELD_ID,
                        });

                        g_currentRecord.setCurrentSublistValue({
                            sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                            fieldId: ADJUSTED_SECURITY_DEPOSIT_SUBLIST_FIELD_ID,
                            value: escalated_basic_rent * period_for_security_deposit,
                        });

                        var fixed_security_deposit = g_currentRecord.getCurrentSublistValue({
                            sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                            fieldId: FIXED_SECURITY_DEPOSIT_SUBLIST_FIELD_ID,
                        });

                        var adjusted_security_deposit = g_currentRecord.getCurrentSublistValue({
                            sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                            fieldId: ADJUSTED_SECURITY_DEPOSIT_SUBLIST_FIELD_ID,
                        });

                        // Security Deposit Adjustment
                        var sda = adjusted_security_deposit ? (adjusted_security_deposit - fixed_security_deposit) : fixed_security_deposit;

                        g_currentRecord.setCurrentSublistValue({
                            sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                            fieldId: SECURITY_DEPOSIT_ADJUSTMENT_SUBLIST_FIELD_ID,
                            value: sda,
                        });
                    }

                    if ((year !== current_cusa_year) && cusa_escalation) {

                        current_cusa_year = year;

                        current_cusa_escalation = cusa_escalation;

                    }

                }

                if (current_rent_escalation || early_rental_escalation) {

                    // Updating rental escalation
                    // g_currentRecord.setCurrentSublistValue({
                    //     sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    //     fieldId: RENTAL_ESCALATION_SUBLIST_FIELD_ID,
                    //     value: current_rent_escalation || early_rental_escalation,
                    // });

                }

                if (current_cusa_escalation || early_cusa_escalation) {

                    // Updating cusa escalation
                    // g_currentRecord.setCurrentSublistValue({
                    //     sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    //     fieldId: CUSA_ESCALATION_PERCENTAGE_SUBLIST_FIELD_ID,
                    //     value: current_cusa_escalation || early_cusa_escalation,
                    // });

                }

                g_currentRecord.commitLine({
                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                });

                // Use setTimeout to yield control back to the event loop
                await new Promise(resolve => setTimeout(resolve, 0)); // 0 ms to let the event loop run other tasks

            }

            var new_historical_values = updateHistoricalValues();

            g_currentRecord.setValue(HISTORICAL_VALUES_FIELD_ID, new_historical_values);

            g_recalc_required = false;

            // Hide loading popup
            // messageBox.hide();
        }

        async function onGenerateBtnClick() {

            // Set g_has_generated to determine if a user has already
            // generated a schedule
            g_has_generated = true;

            var lease_period_type = g_currentRecord.getValue(LEASE_PERIOD_TYPE_FIELD_ID);

            var lease_period = g_currentRecord.getValue(LEASE_PERIOD_FIELD_ID);

            var lines = lease_period;

            var lease_commencement = g_currentRecord.getValue(LEASE_COMMENCEMENT_FIELD_ID);

            var pro_rated_lease_expiry = g_currentRecord.getValue(PRO_RATED_LEASE_EXPIRTY_FIELD_ID);

            var basic_rent = g_currentRecord.getValue(BASIC_RENT_FIELD_ID);

            var rental_escalation = g_currentRecord.getValue(RENTAL_ESCALATION_PERCENTAGE_FIELD_ID) || 0;

            var cusa_rent = g_currentRecord.getValue(CUSA_FIELD_ID) || 0;

            var cusa_escalation = g_currentRecord.getValue(CUSA_ESCALATION_PERCENTAGE_FIELD_ID) || 0;

            var current_lease_year = g_currentRecord.getValue(CURRENT_LEASE_YEAR_FIELD_ID) || 1;

            var current_lease_period = g_currentRecord.getValue(CURRENT_LEASE_PERIOD_FIELD_ID) || 1;

            var period_for_security_deposit = g_currentRecord.getValue(PERIODS_FOR_SECURITY_DEPOSIT_FIELD_ID);

            var valueCheck = checkValues(lease_period, lease_commencement);

            if (!valueCheck.valid) {

                alert(valueCheck.message);

                return;

            }

            // Show loading popup
            // const messageBox = Ext.MessageBox.show({
            //     title: 'Generating...',
            //     msg: 'Generating billing schedule',
            //     wait: true,
            //     width: 250
            // });


            // Get the date on the Lease Commencement date
            var isNotFirstDay = lease_commencement.getDate() > 1 ? true : false;

            var year = current_lease_year;

            var last_date = getLastDateOfMonth(lease_commencement.getFullYear(), lease_commencement.getMonth());

            var bsched_lines = g_currentRecord.getLineCount({
                sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
            });

            if (bsched_lines > 0) {

                // Loop backward to avoid index issues when removing lines
                for (var line = bsched_lines - 1; line >= 0; line--) {
                    g_currentRecord.removeLine({
                        sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                        line: line,
                        ignoreRecalc: true
                    });
                }

            }

            // Adding only one on One Time Payment Type
            if (lease_period_type === ONE_TIME_PAYMENT_TYPE_ID) {

                g_currentRecord.setCurrentSublistValue({
                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    fieldId: YEAR_SUBLIST_FIELD_ID,
                    value: 1,
                });

                g_currentRecord.setCurrentSublistValue({
                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    fieldId: LEASE_PERIOD_SUBLIST_FIELD_ID,
                    value: 1,
                });

                g_currentRecord.setCurrentSublistValue({
                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    fieldId: TRUE_BILLING_DATE_SUBLIST_FIELD_ID,
                    value: getFifthOfTheMonth(last_date.toLocaleDateString()),
                });

                g_currentRecord.setCurrentSublistValue({
                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    fieldId: BILLING_DATE_SUBLIST_FIELD_ID,
                    value: g_currentRecord.getValue(LEASE_EXPIRY_FIELD_ID).toLocaleDateString(),
                });

                g_currentRecord.setCurrentSublistValue({
                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    fieldId: FIXED_BASIC_RENT_SUBLIST_FIELD_ID,
                    value: basic_rent,
                });

                g_currentRecord.setCurrentSublistValue({
                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    fieldId: ESCALATED_BASIC_RENT_SUBLIST_FIELD_ID,
                    value: basic_rent,
                });

                g_currentRecord.setCurrentSublistValue({
                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    fieldId: ESCALATED_CUSA_SUBLIST_FIELD_ID,
                    value: cusa_rent,
                });

                g_currentRecord.setCurrentSublistValue({
                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    fieldId: ESCALATED_CUSA_SUBLIST_FIELD_ID,
                    value: cusa_rent,
                });

                g_currentRecord.setCurrentSublistValue({
                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    fieldId: FIXED_SECURITY_DEPOSIT_SUBLIST_FIELD_ID,
                    value: basic_rent * period_for_security_deposit,
                });

                g_currentRecord.setCurrentSublistValue({
                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    fieldId: ADJUSTED_SECURITY_DEPOSIT_SUBLIST_FIELD_ID,
                    value: basic_rent * period_for_security_deposit,
                });

                var fixed_security_deposit = g_currentRecord.getCurrentSublistValue({
                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    fieldId: FIXED_SECURITY_DEPOSIT_SUBLIST_FIELD_ID,
                });

                var adjusted_security_deposit = g_currentRecord.getCurrentSublistValue({
                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    fieldId: ADJUSTED_SECURITY_DEPOSIT_SUBLIST_FIELD_ID,
                });

                // Security Deposit Adjustment
                var sda = adjusted_security_deposit ? (adjusted_security_deposit - fixed_security_deposit) : fixed_security_deposit;

                g_currentRecord.setCurrentSublistValue({
                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    fieldId: SECURITY_DEPOSIT_ADJUSTMENT_SUBLIST_FIELD_ID,
                    value: sda,
                });

                g_currentRecord.commitLine({
                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                });

                var new_historical_values = updateHistoricalValues();

                g_currentRecord.setValue(HISTORICAL_VALUES_FIELD_ID, new_historical_values);

                return;

            }

            for (var i = current_lease_period; i <= lease_period; i++) {

                if (i === 1 && isNotFirstDay) {

                    i = 0; // Make the period 0 if last_date non-falsy value

                    isNotFirstDay = false; // Make the isNotFirstDay false so it will be ignored after the first loop

                    lines = lease_period + 1;

                }

                g_currentRecord.setCurrentSublistValue({
                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    fieldId: YEAR_SUBLIST_FIELD_ID,
                    value: year,
                });

                g_currentRecord.setCurrentSublistValue({
                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    fieldId: LEASE_PERIOD_SUBLIST_FIELD_ID,
                    value: i,
                });

                g_currentRecord.setCurrentSublistValue({
                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    fieldId: TRUE_BILLING_DATE_SUBLIST_FIELD_ID,
                    value: getFifthOfTheMonth(last_date.toLocaleDateString()),
                });

                // if (i === lease_period) {

                //     if (pro_rated_lease_expiry) {

                //         var day = last_date.getDate() - (lease_commencement.getDate() + 1);

                //         var pro_rated_date = new Date(last_date.getFullYear(), lease_commencement.getMonth(), day);

                //         g_currentRecord.setValue(LEASE_EXPIRY_FIELD_ID, pro_rated_date);

                //     } else {

                //         // Last period billing date is Lease Expiry date
                //         g_currentRecord.setValue(LEASE_EXPIRY_FIELD_ID, last_date);

                //     }

                // }

                g_currentRecord.setCurrentSublistValue({
                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    fieldId: BILLING_START_DATE_SUBLIST_FIELD_ID,
                    value: (i === 0) ? g_currentRecord.getValue(LEASE_COMMENCEMENT_FIELD_ID).toLocaleDateString() : getFirstDateOfMonth(last_date.getFullYear(), last_date.getMonth()).toLocaleDateString(),
                });

                g_currentRecord.setCurrentSublistValue({
                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    fieldId: BILLING_DATE_SUBLIST_FIELD_ID,
                    value: (i === lease_period && pro_rated_lease_expiry) ? g_currentRecord.getValue(LEASE_EXPIRY_FIELD_ID).toLocaleDateString() : last_date.toLocaleDateString(),
                });

                // Skipping every first year for rental escalation
                if (year > 1) {

                    g_currentRecord.setCurrentSublistValue({
                        sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                        fieldId: RENTAL_ESCALATION_SUBLIST_FIELD_ID,
                        value: rental_escalation,
                        // ignoreFieldChange: true,
                    });

                    console.log('test2');

                    g_currentRecord.setCurrentSublistValue({
                        sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                        fieldId: CUSA_ESCALATION_PERCENTAGE_SUBLIST_FIELD_ID,
                        value: cusa_escalation,
                        // ignoreFieldChange: true,
                    });
                }

                // If the commencement date is not the first day of the month,
                // get the pro rated rent, otherwise set the value as basic rent

                var fbr = 0; // Fixed basic rent

                if (i === 0 || i === lease_period) {

                    var day = i === 0 ? ((last_date.getDate() - lease_commencement.getDate()) + 1) : i === lease_period ? g_currentRecord.getValue(LEASE_EXPIRY_FIELD_ID).getDate() : null;

                    fbr = getProRatedRent(basic_rent, last_date, day);

                } else {

                    fbr = basic_rent;
                }

                g_currentRecord.setCurrentSublistValue({
                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    fieldId: FIXED_BASIC_RENT_SUBLIST_FIELD_ID,
                    value: fbr,
                });

                var rental_escalation_percentage = g_currentRecord.getCurrentSublistValue({
                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    fieldId: RENTAL_ESCALATION_SUBLIST_FIELD_ID,
                });

                var fixed_basic_rent = g_currentRecord.getCurrentSublistValue({
                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    fieldId: FIXED_BASIC_RENT_SUBLIST_FIELD_ID,
                });

                // Escalated basic rent
                var ebr = i === 0 ? fbr : rental_escalation_percentage ? (((100 + rental_escalation_percentage) / 100) * fixed_basic_rent) : fixed_basic_rent;

                // Calculate for the escalated basic rent
                g_currentRecord.setCurrentSublistValue({
                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    fieldId: ESCALATED_BASIC_RENT_SUBLIST_FIELD_ID,
                    value: ebr,
                });

                g_currentRecord.setCurrentSublistValue({
                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    fieldId: FIXED_CUSA_SUBLIST_FIELD_ID,
                    value: cusa_rent,
                });

                var cusa_escalation_percentage = g_currentRecord.getCurrentSublistValue({
                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    fieldId: CUSA_ESCALATION_PERCENTAGE_SUBLIST_FIELD_ID,
                });

                var fixed_cusa = g_currentRecord.getCurrentSublistValue({
                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    fieldId: FIXED_CUSA_SUBLIST_FIELD_ID,
                });

                // Escalated CUSA
                var ec = cusa_escalation_percentage ? (((100 + cusa_escalation_percentage) / 100) * fixed_cusa) : fixed_cusa;

                g_currentRecord.setCurrentSublistValue({
                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    fieldId: ESCALATED_CUSA_SUBLIST_FIELD_ID,
                    value: ec,
                });

                // Check if the period is the start of year
                if (isNewYear(i)) {

                    g_currentRecord.setCurrentSublistValue({
                        sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                        fieldId: FIXED_SECURITY_DEPOSIT_SUBLIST_FIELD_ID,
                        value: fixed_basic_rent * period_for_security_deposit,
                    });

                    var escalated_basic_rent = g_currentRecord.getCurrentSublistValue({
                        sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                        fieldId: ESCALATED_BASIC_RENT_SUBLIST_FIELD_ID,
                    });

                    g_currentRecord.setCurrentSublistValue({
                        sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                        fieldId: ADJUSTED_SECURITY_DEPOSIT_SUBLIST_FIELD_ID,
                        value: escalated_basic_rent * period_for_security_deposit,
                    });

                    var fixed_security_deposit = g_currentRecord.getCurrentSublistValue({
                        sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                        fieldId: FIXED_SECURITY_DEPOSIT_SUBLIST_FIELD_ID,
                    });

                    var adjusted_security_deposit = g_currentRecord.getCurrentSublistValue({
                        sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                        fieldId: ADJUSTED_SECURITY_DEPOSIT_SUBLIST_FIELD_ID,
                    });

                    // Security Deposit Adjustment
                    var sda = adjusted_security_deposit ? (adjusted_security_deposit - fixed_security_deposit) : fixed_security_deposit;

                    g_currentRecord.setCurrentSublistValue({
                        sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                        fieldId: SECURITY_DEPOSIT_ADJUSTMENT_SUBLIST_FIELD_ID,
                        value: sda,
                    });

                }

                // Gettting the last date of every succeeding month
                last_date = getLastDateOfMonth(last_date.getFullYear(), last_date.getMonth() + 1);

                // values.push(data);

                if (i !== 0 && i % 12 === 0) {

                    year += 1;

                    // Make the escalated basic rent as the new basic rent
                    // every year end
                    basic_rent = g_currentRecord.getCurrentSublistValue({
                        sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                        fieldId: ESCALATED_BASIC_RENT_SUBLIST_FIELD_ID,
                    });

                    cusa_rent = g_currentRecord.getCurrentSublistValue({
                        sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                        fieldId: ESCALATED_CUSA_SUBLIST_FIELD_ID,
                    });

                }

                g_currentRecord.commitLine({
                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                });

                // Use setTimeout to yield control back to the event loop
                await new Promise(resolve => setTimeout(resolve, 0)); // 0 ms to let the event loop run other tasks
            }

            // Initially, lines variable has the value as lease_period.
            // Check if lines, increased
            if (lines > lease_period) {

                var items_lines = g_currentRecord.getLineCount({
                    sublistId: ITEMS_SUBLIST_ID,
                });

                for (var line = 0; line < items_lines; line++) {

                    g_currentRecord.selectLine({
                        sublistId: ITEMS_SUBLIST_ID,
                        line: line,
                    });

                    var item = g_currentRecord.getCurrentSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: ITEMS_SUBLIST_FIELD_ID,
                    });

                    // Check if item matches with fixed or variable rent item code 
                    if (item === FIXED_RENT_ITEM_CODE || item === VARIABLE_RENT_ITEM_CODE) {

                        // Update the quantity
                        g_currentRecord.setCurrentSublistValue({
                            sublistId: ITEMS_SUBLIST_ID,
                            fieldId: QUANTITY_SUBLIST_FIELD_ID,
                            value: lines,
                        });

                        g_currentRecord.commitLine({
                            sublistId: ITEMS_SUBLIST_ID,
                        });

                    }

                }

            }

            var new_historical_values = updateHistoricalValues();

            g_currentRecord.setValue(HISTORICAL_VALUES_FIELD_ID, new_historical_values);

            // Hide loading popup
            // messageBox.hide();
        }

        function updateHistoricalValues() {

            // Defining a list of ids from Escalation Schedule sublist
            var ids = ['custpage_year', 'custpage_lease_period', 'custpage_true_billing_date', 'custpage_billing_start_date', 'custpage_billing_date', 'custpage_rental_escalation', 'custpage_fixed_basic_rent', 'custpage_escalated_basic_rent', 'custpage_cusa_escalation', 'custpage_escalated_cusa', 'custpage_fixed_cusa', 'custpage_fixed_sec_dep', 'custpage_adj_sec_dep', 'custpage_sec_dep_adj'];

            var esc_lines = g_currentRecord.getLineCount({
                sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
            });

            var values = [];

            for (var line = 0; line < esc_lines; line++) {

                g_currentRecord.selectLine({
                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    line: line,
                });

                // Each line of escalation schedule is 1 data object
                var data = {};

                ids.forEach(id => {

                    var value = g_currentRecord.getCurrentSublistValue({
                        sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                        fieldId: id,
                    });

                    data[id] = value;

                });

                values.push(data);

            }

            return JSON.stringify(values);

        }

        function getProRatedRent(basic_rent, last_date, day) {

            var month_last_date = last_date.getDate();

            return basic_rent * (day / month_last_date);

        }

        function checkValues(lease_period, lease_commencement) {

            // Defining array for paramerters and labels
            var params_labels = ['Lease Period', 'Lease Commencement'];

            var params = [lease_period, lease_commencement];

            for (let i = 0; i < params.length; i++) {

                if (!params[i]) {

                    // Check null, return error if so
                    return {
                        valid: false,
                        message: "Required field value\n\n" + params_labels[i],
                    };

                }

            }

            return {
                valid: true,
                message: '',
            };

        }

        async function onRemoveAllLinesBtnClick() {

            // Show loading popup
            // const messageBox = Ext.MessageBox.show({
            //     title: 'Removing lines...',
            //     msg: 'Removing billing schedules',
            //     wait: true,
            //     width: 250
            // });


            var lineCount = g_currentRecord.getLineCount({
                sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
            });

            // Loop backward to avoid index issues when removing lines
            for (var line = lineCount - 1; line >= 0; line--) {
                g_currentRecord.removeLine({
                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    line: line,
                    ignoreRecalc: true
                });
                // Use setTimeout to yield control back to the event loop
                await new Promise(resolve => setTimeout(resolve, 0)); // 0 ms to let the event loop run other tasks
            }

            // Hide loading popup
            // messageBox.hide();

        }

        function onCloseOrderBtnClick() {

            var currentRecord = m_currentRecord.get();

            // Check if the button is already clicked
            // This is to prevent calling the link multiple times
            if (!g_isCloseOrderBtnClick) {

                g_isCloseOrderBtnClick = true;

                window.location.href = 'https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1765&deploy=1&id=' + currentRecord.id;

            } else {

                alert('You have already submitted the form.');

            }

        }

        function onFinalSOABtnClick(tenant, subsidiary) {

            var currentRecord = m_currentRecord.get();

            // Check if the button is already clicked
            // This is to prevent calling the link multiple times
            if (!g_isFinalSOABtnClick) {

                g_isFinalSOABtnClick = true;

                window.location.href = 'https://9794098.app.netsuite.com/app/accounting/transactions/custinvc.nl?warnnexuschange=F&at=T&usefirstopenperiod=F&mar=T&whence=&cf=220&entity=' + tenant + '&nexus=1&custpage_4601_appliesto=&subsidiary=' + subsidiary + '&manual_reload=T&origin_id=' + currentRecord.id;

            } else {

                alert('You have already submitted the form.');

            }

        }

        function isNewYear(period) { // 🎇🎇🎇

            return period === 1 || ((period - 1) % 12 === 0);

        }

        function getNextDate(date) {

            // var nextDate = new Date(date);

            date.setDate(date.getDate() + 1); // Increment the day by 1

            return date.toLocaleDateString();
        }

        function getFifthOfTheMonth(date) {

            var year = date.split('/')[2];

            var month = date.split('/')[0];

            month = parseInt(month) < 10 ? "0" + month : month;

            return month + "/05/" + year;

        }

        function addMonths(date, months) {

            date.setMonth(date.getMonth() + months);

            return date;
        }

        function getFirstDateOfMonth(year, month) {

            return new Date(year, month, 1);

        }

        function getLastDateOfMonth(year, month) {

            return new Date(year, month + 1, 0);

        }

        function getPeriod(historical_values, period) {

            var periods = historical_values.filter((historical_value) => historical_value.custpage_lease_period == period);

            return periods[0];

        }

        function getMonthEnd(date) {

            var givenDate = new Date(date); // Ensure it's a Date object

            var nextMonth = new Date(givenDate.getFullYear(), givenDate.getMonth() + 1, 1);

            var lastDayOfMonth = new Date(nextMonth - 1); // Subtract 1 day from the first day of next month

            var is_month_end = givenDate.getDate() === lastDayOfMonth.getDate();

            var last_date = lastDayOfMonth.toLocaleDateString();

            return { is_month_end, last_date };

        }

        function onRenewBtnClick() {

            var currentRecord = m_currentRecord.get();

            // Check if the button is already clicked
            // This is to prevent calling the link multiple times
            if (!g_isRenewBtnClick) {

                g_isRenewBtnClick = true;

                // Redirecting to lease memo copy link
                window.location.href = "https://9794098.app.netsuite.com/app/accounting/transactions/salesord.nl?id=" + currentRecord.id + "&whence=&e=T&memdoc=0&renewal=T&origin_id=" + currentRecord.id;

            } else {

                alert('You have already submitted the form.');

            }

        }

        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            postSourcing: postSourcing,
            sublistChanged: sublistChanged,
            saveRecord: saveRecord,
            onSubmitForApprovalBtnClick: onSubmitForApprovalBtnClick,
            onApproveBtnClick: onApproveBtnClick,
            onRejectBtnClick: onRejectBtnClick,
            onPTOBtnClick: onPTOBtnClick,
            onRecalcBtnClick: onRecalcBtnClick,
            onGenerateBtnClick: onGenerateBtnClick,
            onRemoveAllLinesBtnClick: onRemoveAllLinesBtnClick,
            onCloseOrderBtnClick: onCloseOrderBtnClick,
            onFinalSOABtnClick: onFinalSOABtnClick,
            onRenewBtnClick: onRenewBtnClick,
        };
    }
);