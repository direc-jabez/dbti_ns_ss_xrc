/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 12, 2024
 * 
 */
define(['N/record', 'N/search', 'N/currentRecord', 'N/runtime'],

    function (record, search, m_currentRecord, runtime) {

        const PARAM_ORIGIN_ID = 'origin_id';
        const MODE_CREATE = 'create';
        const LEASE_PROPOSAL_RECORD_TYPE = 'estimate';
        const LEASE_PROPOSAL_FIELD_ID = 'custrecord_xrc_lease_proposal';
        const INITIAL_CHARGERS_FIELD_ID = 'custrecord_xrc_initial_charges';
        const TOTAL_VAT_AMOUNT_FIELD_ID = 'custrecord_xrc_total_vat';
        const TOTAL_WHT_FIELD_ID = 'custrecord_xrc_total_wht';
        const TOTAL_AMOUNT_DUE_FIELD_ID = 'custrecord_total_amount_due';
        const ADVANCE_CHARGES_SUBLIST_ID = 'recmachcustrecord_xrc_initial_soa_num';
        const PREPAYMENT_CATEGORY_SUBLIST_FIELD_ID = 'custrecord_xrc_prepayment_category';
        const ACCOUNT_DESCRIPTION_SUBLIST_FIELD_ID = 'custrecord_xrc_account_descript';
        const QUANTITY_SUBLIST_FIELD_ID = 'custrecord_xrc_qty';
        const CHARGES_SUBLIST_FIELD_ID = 'custrecord_xrc_charges';
        const AMOUNT_SUBLIST_FIELD_ID = 'custrecord_xrc_amount5';
        const TAX_CODE_SUBLIST_FIELD_ID = 'custrecord_xrc_tax_code';
        const TAX_RATE_SUBLIST_FIELD_ID = 'custrecord_xrc_tax_rate';
        const TAX_AMOUNT_SUBLIST_FIELD_ID = 'custrecord_xrc_tax_amt';
        const APPLY_WH_TAX_SUBLIST_FIELD_ID = 'custrecord_xrc_apply_wh_tax';
        const WHT_CODE_SUBLIST_FIELD_ID = 'custrecord_xrc_wht_code';
        const WHT_RATE_SUBLIST_FIELD_ID = 'custrecord_xrc_wht_rate';
        const WHT_AMOUNT_SUBLIST_FIELD_ID = 'custrecord_xrc_wht_amt';
        const GROSS_AMOUNT_SUBLIST_FIELD_ID = 'custrecord_xrc_gross_amt';
        const BALANCE_DUE_SUBLIST_FIELD_ID = 'custrecord_xrc_balance_due';
        const APPROVAL_TWO_FIELD_ID = 'custrecord_xrc_isoa_approval2';
        const CONTRACT_TYPE_FIELD_ID = 'custrecord_xrc_fundreq_contract_type';

        var g_isSubmitForApprovalBtnClick = false;
        var g_isApproveBtnClick = false;
        var g_isRejectBtnClick = false;
        var g_initalSOA_field_lookup = null;
        var g_defaultTaxCode = null;


        function pageInit(context) {

            var currentRecord = context.currentRecord;

            if (context.mode === MODE_CREATE) {

                var origin_id = getParameterWithId(PARAM_ORIGIN_ID);

                currentRecord.setValue(LEASE_PROPOSAL_FIELD_ID, origin_id || null);

                g_initalSOA_field_lookup = search.lookupFields({
                    type: LEASE_PROPOSAL_RECORD_TYPE,
                    id: origin_id,
                    columns: [
                        'entity', 'custbody_xrc_adv_rent_descript', 'custbody_xrc_period_adv_rent', 'custbody_xrc_adv_rent',
                        'custbody_xrc_constr_rent_free', 'custbody_xrc_advance_cusa', 'custbody_xrc_aircon_charge',
                        'custbody_xrc_cusa', 'custbody_xrc_contract_type',
                        'custbody_xrc_electric_bill_dep',
                        'custbody_xrc_water_meter_dep',
                        'custbody_xrc_water_bill_dep',
                        'custbody_xrc_constr_bond_descript', 'custbody_xrc_construct_period', 'custbody_xrc_construct_bond_period',
                        'custbody_xrc_sec_dep_description', 'custbody_xrc_period_sec_dep', 'custbody_xrc_sec_dep_per_period',
                        'custbody_xrc_mktg_supp_fund',
                        'custbody_xrc_elec_meter_dep',
                        'custbody_xrc_lpg_meter_dep',
                        'custbody_xrc_lpg_bill_dep',

                    ],
                });

                var contract_type = g_initalSOA_field_lookup['custbody_xrc_contract_type'][0]?.value;

                if (contract_type) {

                    currentRecord.setValue(CONTRACT_TYPE_FIELD_ID, contract_type);

                }

                g_defaultTaxCode = search.lookupFields({
                    type: search.Type.CUSTOMER,
                    id: g_initalSOA_field_lookup['entity'][0].value,
                    columns: ['taxitem'],
                })['taxitem'][0].value;

                console.log('test');
                
                setupInitialSOA(currentRecord);

            }

        }

        function fieldChanged(context) {

            var currentRecord = context.currentRecord;

            var fieldId = context.fieldId;

            if (fieldId === QUANTITY_SUBLIST_FIELD_ID || fieldId === CHARGES_SUBLIST_FIELD_ID) {

                var qty = currentRecord.getCurrentSublistValue({
                    sublistId: ADVANCE_CHARGES_SUBLIST_ID,
                    fieldId: QUANTITY_SUBLIST_FIELD_ID,
                });

                var charges = currentRecord.getCurrentSublistValue({
                    sublistId: ADVANCE_CHARGES_SUBLIST_ID,
                    fieldId: CHARGES_SUBLIST_FIELD_ID,
                });

                // If qty and charges has values, multiply it to get the Amount value
                if (qty && charges) {

                    currentRecord.setCurrentSublistValue({
                        sublistId: ADVANCE_CHARGES_SUBLIST_ID,
                        fieldId: AMOUNT_SUBLIST_FIELD_ID,
                        value: charges * qty,
                    });

                    setGrossAmount(currentRecord);

                }

            } else if (fieldId === TAX_CODE_SUBLIST_FIELD_ID) {

                var tax_code = currentRecord.getCurrentSublistValue({
                    sublistId: ADVANCE_CHARGES_SUBLIST_ID,
                    fieldId: TAX_CODE_SUBLIST_FIELD_ID,
                });

                var fieldLookUp = search.lookupFields({
                    type: search.Type.SALES_TAX_ITEM,
                    id: tax_code,
                    columns: ['rate'],
                });

                // Get and set the tax rate
                currentRecord.setCurrentSublistValue({
                    sublistId: ADVANCE_CHARGES_SUBLIST_ID,
                    fieldId: TAX_RATE_SUBLIST_FIELD_ID,
                    value: parseFloat(fieldLookUp.rate),
                });

                var amount = currentRecord.getCurrentSublistValue({
                    sublistId: ADVANCE_CHARGES_SUBLIST_ID,
                    fieldId: AMOUNT_SUBLIST_FIELD_ID,
                });

                // Compute for tax amount
                var tax_amt = amount * (parseFloat(fieldLookUp.rate) / 100);

                currentRecord.setCurrentSublistValue({
                    sublistId: ADVANCE_CHARGES_SUBLIST_ID,
                    fieldId: TAX_AMOUNT_SUBLIST_FIELD_ID,
                    value: tax_amt,
                });

                setGrossAmount(currentRecord);

            } else if (fieldId === APPLY_WH_TAX_SUBLIST_FIELD_ID) {

                var apply_wh_tax = currentRecord.getCurrentSublistValue({
                    sublistId: ADVANCE_CHARGES_SUBLIST_ID,
                    fieldId: APPLY_WH_TAX_SUBLIST_FIELD_ID,
                });

                if (!apply_wh_tax) {

                    try {

                        [WHT_CODE_SUBLIST_FIELD_ID, WHT_RATE_SUBLIST_FIELD_ID, WHT_AMOUNT_SUBLIST_FIELD_ID]
                            .forEach(field =>
                                currentRecord.setCurrentSublistValue({
                                    sublistId: ADVANCE_CHARGES_SUBLIST_ID,
                                    fieldId: field,
                                    value: '',
                                })
                            );

                        setGrossAmount(currentRecord);

                    } catch (error) {

                    }

                }

            } else if (fieldId === WHT_RATE_SUBLIST_FIELD_ID) {

                var amount = currentRecord.getCurrentSublistValue({
                    sublistId: ADVANCE_CHARGES_SUBLIST_ID,
                    fieldId: AMOUNT_SUBLIST_FIELD_ID,
                });

                var wht_rate = currentRecord.getCurrentSublistValue({
                    sublistId: ADVANCE_CHARGES_SUBLIST_ID,
                    fieldId: WHT_RATE_SUBLIST_FIELD_ID,
                });

                if (wht_rate) {

                    // Compute for wh tax amount
                    var wh_tax_amt = amount * (parseFloat(wht_rate) / 100);

                    currentRecord.setCurrentSublistValue({
                        sublistId: ADVANCE_CHARGES_SUBLIST_ID,
                        fieldId: WHT_AMOUNT_SUBLIST_FIELD_ID,
                        value: wh_tax_amt,
                    });

                } else {

                    currentRecord.setCurrentSublistValue({
                        sublistId: ADVANCE_CHARGES_SUBLIST_ID,
                        fieldId: WHT_AMOUNT_SUBLIST_FIELD_ID,
                        value: '',
                    });

                }

                setGrossAmount(currentRecord);

            }

        }

        function postSourcing(context) {

            var currentRecord = context.currentRecord;

            var fieldId = context.fieldId;

            if (fieldId === PREPAYMENT_CATEGORY_SUBLIST_FIELD_ID) {

                var item_id = currentRecord.getCurrentSublistValue({
                    sublistId: ADVANCE_CHARGES_SUBLIST_ID,
                    fieldId: PREPAYMENT_CATEGORY_SUBLIST_FIELD_ID,
                });

                var columns = getAdvanceChagesFieldsByItem(item_id);

                columns.forEach((fields_arr, index) => {

                    var value = g_initalSOA_field_lookup[fields_arr[0]];

                    if (fields_arr[0] === "custbody_xrc_advance_cusa") {

                        var adv_cusa_quantity = g_initalSOA_field_lookup[columns[index - 1][0]];

                        currentRecord.setCurrentSublistValue({
                            sublistId: ADVANCE_CHARGES_SUBLIST_ID,
                            fieldId: fields_arr[1],
                            value: (value / adv_cusa_quantity),
                        });

                    } else {

                        currentRecord.setCurrentSublistValue({
                            sublistId: ADVANCE_CHARGES_SUBLIST_ID,
                            fieldId: fields_arr[1],
                            value: value,
                        });

                    }

                });

                currentRecord.setCurrentSublistValue({
                    sublistId: ADVANCE_CHARGES_SUBLIST_ID,
                    fieldId: 'custrecord_xrc_tax_code',
                    value: g_defaultTaxCode,
                });

            }

        }


        function sublistChanged(context) {

            var currentRecord = context.currentRecord;

            var charges_lines = currentRecord.getLineCount({
                sublistId: ADVANCE_CHARGES_SUBLIST_ID,
            });

            var initial_charges_total = 0, total_vat_amount = 0, total_wht = 0, total_amount_due = 0;

            // Summing up the values of specific columns
            for (var line = 0; line < charges_lines; line++) {

                var amount = currentRecord.getSublistValue({
                    sublistId: ADVANCE_CHARGES_SUBLIST_ID,
                    fieldId: AMOUNT_SUBLIST_FIELD_ID,
                    line: line,
                });

                if (amount) initial_charges_total += parseFloat(amount);

                var tax_amt = currentRecord.getSublistValue({
                    sublistId: ADVANCE_CHARGES_SUBLIST_ID,
                    fieldId: TAX_AMOUNT_SUBLIST_FIELD_ID,
                    line: line,
                });

                if (tax_amt) total_vat_amount += parseFloat(tax_amt);


                var wht_amt = currentRecord.getSublistValue({
                    sublistId: ADVANCE_CHARGES_SUBLIST_ID,
                    fieldId: WHT_AMOUNT_SUBLIST_FIELD_ID,
                    line: line,
                });

                if (wht_amt) total_wht += parseFloat(wht_amt);

                var gross_amt = currentRecord.getSublistValue({
                    sublistId: ADVANCE_CHARGES_SUBLIST_ID,
                    fieldId: GROSS_AMOUNT_SUBLIST_FIELD_ID,
                    line: line,
                });

                if (gross_amt) total_amount_due += parseFloat(gross_amt);

            }

            currentRecord.setValue(INITIAL_CHARGERS_FIELD_ID, initial_charges_total);

            currentRecord.setValue(TOTAL_VAT_AMOUNT_FIELD_ID, total_vat_amount);

            currentRecord.setValue(TOTAL_WHT_FIELD_ID, total_wht);

            currentRecord.setValue(TOTAL_AMOUNT_DUE_FIELD_ID, total_amount_due);

            return true;

        }

        function onDepositBtnClick() {

            var currentRecord = m_currentRecord.get();

            // Redirect to Initial SOA Deposit
            window.location.href = 'https://9794098.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=1228&origin_id=' + currentRecord.id;

        }

        function getParameterWithId(param_id) {

            var url = new URL(window.location.href);

            var value = url.searchParams.get(param_id);

            return value;

        }

        function onSubmitForApprovalBtnClick(role_to_email) {

            var currentRecord = m_currentRecord.get();

            // Check if the button is already clicked
            // This is to prevent calling the link multiple times
            if (!g_isSubmitForApprovalBtnClick) {

                g_isSubmitForApprovalBtnClick = true;

                // Redirect to the approval link
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1641&deploy=1&action=submitforapproval&id=" + currentRecord.id + "&role_to_email=" + role_to_email;

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
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1641&deploy=1&action=approve&id=" + currentRecord.id + "&field=" + approve_field + "&role_to_email=" + role_to_email;

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
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1641&deploy=1&action=reject&id=" + currentRecord.id;

            } else {

                alert('You have already submitted the form.');

            }

        }

        function setupInitialSOA(currentRecord) {

            var field_ids = [
                'custbody_xrc_period_adv_rent', 'custbody_xrc_aircon_charge', 'custbody_xrc_advance_cusa',
                'custbody_xrc_electric_bill_dep', 'custbody_xrc_water_meter_dep', 'custbody_xrc_water_bill_dep',
                'custbody_xrc_construct_period', 'custbody_xrc_period_sec_dep', 'custbody_xrc_mktg_supp_fund',
                'custbody_xrc_elec_meter_dep', 'custbody_xrc_lpg_bill_dep', 'custbody_xrc_lpg_meter_dep'
            ];

            field_ids.forEach((field_id) => {

                var payment = parseInt(g_initalSOA_field_lookup[field_id]);

                if (payment) {

                    try {

                        currentRecord.selectNewLine({
                            sublistId: ADVANCE_CHARGES_SUBLIST_ID,
                        });

                        var item = getItemById(field_id);

                        currentRecord.setCurrentSublistValue({
                            sublistId: ADVANCE_CHARGES_SUBLIST_ID,
                            fieldId: PREPAYMENT_CATEGORY_SUBLIST_FIELD_ID,
                            value: item,
                            forceSyncSourcing: true,
                        });

                        currentRecord.commitLine({
                            sublistId: ADVANCE_CHARGES_SUBLIST_ID
                        });

                    } catch (error) {

                        console.log(error);

                    }
                }

            });


        }

        function setGrossAmount(currentRecord) {

            var amount = currentRecord.getCurrentSublistValue({
                sublistId: ADVANCE_CHARGES_SUBLIST_ID,
                fieldId: AMOUNT_SUBLIST_FIELD_ID,
            }) || 0;

            var tax_amt = currentRecord.getCurrentSublistValue({
                sublistId: ADVANCE_CHARGES_SUBLIST_ID,
                fieldId: TAX_AMOUNT_SUBLIST_FIELD_ID,
            }) || 0;

            var wht_amt = currentRecord.getCurrentSublistValue({
                sublistId: ADVANCE_CHARGES_SUBLIST_ID,
                fieldId: WHT_AMOUNT_SUBLIST_FIELD_ID,
            }) || 0;

            var gross_amt = (amount + tax_amt) - wht_amt;

            currentRecord.setCurrentSublistValue({
                sublistId: ADVANCE_CHARGES_SUBLIST_ID,
                fieldId: GROSS_AMOUNT_SUBLIST_FIELD_ID,
                value: gross_amt,
            });

            currentRecord.setCurrentSublistValue({
                sublistId: ADVANCE_CHARGES_SUBLIST_ID,
                fieldId: BALANCE_DUE_SUBLIST_FIELD_ID,
                value: gross_amt,
            });
        }

        function getItemById(id) {

            var items = {
                'custbody_xrc_period_adv_rent': 19, // PAY-0001 ADVANCE RENT
                'custbody_xrc_aircon_charge': 5221, // PAY-0002 ADVANCE A/C CHARGE/S
                'custbody_xrc_advance_cusa': 5222, // PAY-0003 ADVANCE CUSA CHARGE/S
                'custbody_xrc_electric_bill_dep': 5227, // PAY-0009 ELECTRICITY BILL DEPOSIT
                'custbody_xrc_water_meter_dep': 5230, // PAY-0012 WATER METER DEPOSIT
                'custbody_xrc_water_bill_dep': 5229, // PAY-0011 WATER BILL DEPOSIT
                'custbody_xrc_construct_period': 5226, // PAY-0008 CONSTRUCTION BOND
                'custbody_xrc_period_sec_dep': 20, // PAY-0007 SECURITY DEPOSIT
                'custbody_xrc_mktg_supp_fund': 5225, // PAY-0006 MARKETING SUPPORT FUND
                'custbody_xrc_elec_meter_dep': 5228, // PAY-0010 ELECTRIC METER DEPOSIT
                'custbody_xrc_lpg_meter_dep': 10342, // PAY-0015 LPG  METER DEPOSIT
                'custbody_xrc_lpg_bill_dep': 10343, // PAY-0014 LPG BILL DEPOSIT
            };

            return items[id];

        }

        function getAdvanceChagesFieldsByItem(id) {

            var fields = {
                '19': [
                    ['custbody_xrc_adv_rent_descript', ACCOUNT_DESCRIPTION_SUBLIST_FIELD_ID],
                    ['custbody_xrc_period_adv_rent', QUANTITY_SUBLIST_FIELD_ID],
                    ['custbody_xrc_adv_rent', CHARGES_SUBLIST_FIELD_ID],
                ],
                '5221': [
                    ['custbody_xrc_aircon_charge', CHARGES_SUBLIST_FIELD_ID],
                ],
                '5222': [
                    ['custbody_xrc_constr_rent_free', QUANTITY_SUBLIST_FIELD_ID],
                    ['custbody_xrc_advance_cusa', CHARGES_SUBLIST_FIELD_ID],
                ],
                '5227': [
                    ['custbody_xrc_electric_bill_dep', CHARGES_SUBLIST_FIELD_ID],
                ],
                '5230': [
                    ['custbody_xrc_water_meter_dep', CHARGES_SUBLIST_FIELD_ID],
                ],
                '5229': [
                    ['custbody_xrc_water_bill_dep', CHARGES_SUBLIST_FIELD_ID],
                ],
                '10342': [
                    ['custbody_xrc_lpg_meter_dep', CHARGES_SUBLIST_FIELD_ID],
                ],
                '10343': [
                    ['custbody_xrc_lpg_bill_dep', CHARGES_SUBLIST_FIELD_ID],
                ],
                '5226': [
                    ['custbody_xrc_constr_bond_descript', ACCOUNT_DESCRIPTION_SUBLIST_FIELD_ID],
                    ['custbody_xrc_construct_period', QUANTITY_SUBLIST_FIELD_ID],
                    ['custbody_xrc_construct_bond_period', CHARGES_SUBLIST_FIELD_ID],
                ],
                '20': [
                    ['custbody_xrc_sec_dep_description', ACCOUNT_DESCRIPTION_SUBLIST_FIELD_ID],
                    ['custbody_xrc_period_sec_dep', QUANTITY_SUBLIST_FIELD_ID],
                    ['custbody_xrc_sec_dep_per_period', CHARGES_SUBLIST_FIELD_ID],
                ],
                '5225': [
                    ['custbody_xrc_mktg_supp_fund', CHARGES_SUBLIST_FIELD_ID],
                ],
                '5228': [
                    ['custbody_xrc_elec_meter_dep', CHARGES_SUBLIST_FIELD_ID],
                ],
            };

            return fields[id];

        }

        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            postSourcing: postSourcing,
            sublistChanged: sublistChanged,
            onDepositBtnClick: onDepositBtnClick,
            onSubmitForApprovalBtnClick: onSubmitForApprovalBtnClick,
            onApproveBtnClick: onApproveBtnClick,
            onRejectBtnClick: onRejectBtnClick,
        };
    }
);