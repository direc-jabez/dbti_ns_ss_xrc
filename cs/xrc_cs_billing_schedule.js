/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 21, 2024
 * 
 */
define(['N/currentRecord'],

    function (m_currentRecord) {

        const TENANT_GROSS_SALE_FIELD_ID = 'custrecord_xrc_tenant_gross_sales';
        const PERCENTAGE_RATE_FIELD_ID = 'custrecord_xrc_percentage_rate7';
        const VARIABLE_RENT_FIELD_ID = 'custrecord_xrc_variable_rent';
        const ELECTRICITY_CONSUMPTION_KWH_FIELD_ID = 'custrecord_xrc_electricity_kwh'
        const ELECTRICITY_COMSUMPTION_RATE_FIELD_ID = 'custrecord_xrc_elec_rate';
        const ELECTRICITY_CONSUMPTION_AMOUNT_FIELD_ID = 'custrecord_xrc_elec_amount';
        const WATER_CONSUMPTION_CUBIC_METER_FIELD_ID = 'custrecord_xrc_water_m3';
        const WATER_CONSUMPTION_RATE_FIELD_ID = 'custrecord_xrc_water_rate';
        const WATER_AMOUNT_FIELD_ID = 'custrecord_xrc_water_amount';
        const LPG_CONSUMPTION_KG_FIELD_ID = 'custrecord_xrc_lpg_consumption_kg';
        const LPG_CONSUMPTION_RATE_FIELD_ID = 'custrecord_xrc_consumption_rate';
        const LPG_CONSUMPTION_AMOUNT_FIELD_ID = 'custrecord_xrc_lpg_consumption_amt';
        const GEN_SET_CONSUMPTION_KWH_FIELD_ID = 'custrecord_xrc_genset_consumpt_kwh';
        const GEN_SET_CONSUMPTION_RATE_FIELD_ID = 'custrecord_xrc_genset_consumpt_rate';
        const GEN_SET_CONSUMPTION_AMOUNT_FIELD_ID = 'custrecord_xrc_genset_consumpt_amt';
        const BOTTLED_WATER_QTY_FIELD_ID = 'custrecord_xrc_bottled_water_qty';
        const BOTTLED_WATER_SALES_PRICE_FIELD_ID = 'custrecord_xrc_bottled_water_salesprice';
        const BOTTLED_WATER_AMOUNT_FIELD_ID = 'custrecord_xrc_bottled_water_amount';
        const ADDITIONAL_CHARGE_QTY_FIELD_ID = 'custrecord_xrc_add_charge1_qty';
        const ADDITIONAL_CHARGE_RATE_FIELD_ID = 'custrecord_xrc_add_charge1_rate';
        const ADDITIONAL_CHARGE_AMOUNT_FIELD_ID = 'custrecord_xrc_add_charge1_amount';
        const ADDITIONAL_CHARGE_2_QTY_FIELD_ID = 'custrecord_xrc_add_charge2_qty';
        const ADDITIONAL_CHARGE_2_RATE_FIELD_ID = 'custrecord_xrc_add_charge2_rate';
        const ADDITIONAL_CHARGE_2_AMOUNT_FIELD_ID = 'custrecord_xrc_add_charge2_amount';
        const ADDITIONAL_CHARGE_3_QTY_FIELD_ID = 'custrecord_xrc_add_charge3_qty';
        const ADDITIONAL_CHARGE_3_RATE_FIELD_ID = 'custrecord_xrc_add_charge3_rate';
        const ADDITIONAL_CHARGE_3_AMOUNT_FIELD_ID = 'custrecord_xrc_add_charge3_amount';

        var g_isSubmitForApprovalBtnClick = false;
        var g_isCheckBtnClick = false;
        var g_isApproveBtnClick = false;
        var g_isRejectBtnClick = false;


        function pageInit(context) {

        }

        function fieldChanged(context) {

            var currentRecord = context.currentRecord;

            var fieldId = context.fieldId;

            if (fieldId === TENANT_GROSS_SALE_FIELD_ID) {

                var tenant_gross_sale = currentRecord.getValue(fieldId);

                // Tenant's Gross Sales null check
                if (tenant_gross_sale) {

                    var percentage_rate = currentRecord.getValue(PERCENTAGE_RATE_FIELD_ID);

                    currentRecord.setValue(VARIABLE_RENT_FIELD_ID, (tenant_gross_sale * (percentage_rate / 100)));

                }

            } else if (fieldId === ELECTRICITY_CONSUMPTION_KWH_FIELD_ID || fieldId === ELECTRICITY_COMSUMPTION_RATE_FIELD_ID) {

                var kwh = currentRecord.getValue(ELECTRICITY_CONSUMPTION_KWH_FIELD_ID) || 0;

                var rate = currentRecord.getValue(ELECTRICITY_COMSUMPTION_RATE_FIELD_ID) || 0;

                currentRecord.setValue(ELECTRICITY_CONSUMPTION_AMOUNT_FIELD_ID, kwh * rate);

            } else if (fieldId === WATER_CONSUMPTION_CUBIC_METER_FIELD_ID || fieldId === WATER_CONSUMPTION_RATE_FIELD_ID) {

                var cubic = currentRecord.getValue(WATER_CONSUMPTION_CUBIC_METER_FIELD_ID) || 0;

                var rate = currentRecord.getValue(WATER_CONSUMPTION_RATE_FIELD_ID) || 0;

                currentRecord.setValue(WATER_AMOUNT_FIELD_ID, cubic * rate);

            } else if (fieldId === BOTTLED_WATER_QTY_FIELD_ID || fieldId === BOTTLED_WATER_SALES_PRICE_FIELD_ID) {

                var qty = currentRecord.getValue(BOTTLED_WATER_QTY_FIELD_ID) || 0;

                var rate = currentRecord.getValue(BOTTLED_WATER_SALES_PRICE_FIELD_ID) || 0;

                currentRecord.setValue(BOTTLED_WATER_AMOUNT_FIELD_ID, qty * rate);

            } else if (fieldId === ADDITIONAL_CHARGE_QTY_FIELD_ID || fieldId === ADDITIONAL_CHARGE_RATE_FIELD_ID) {

                var qty = currentRecord.getValue(ADDITIONAL_CHARGE_QTY_FIELD_ID) || 0;

                var rate = currentRecord.getValue(ADDITIONAL_CHARGE_RATE_FIELD_ID) || 0;

                currentRecord.setValue(ADDITIONAL_CHARGE_AMOUNT_FIELD_ID, qty * rate);

            } else if (fieldId === ADDITIONAL_CHARGE_2_QTY_FIELD_ID || fieldId === ADDITIONAL_CHARGE_2_RATE_FIELD_ID) {

                var qty = currentRecord.getValue(ADDITIONAL_CHARGE_2_QTY_FIELD_ID) || 0;

                var rate = currentRecord.getValue(ADDITIONAL_CHARGE_2_RATE_FIELD_ID) || 0;

                currentRecord.setValue(ADDITIONAL_CHARGE_2_AMOUNT_FIELD_ID, qty * rate);

            } else if (fieldId === ADDITIONAL_CHARGE_3_QTY_FIELD_ID || fieldId === ADDITIONAL_CHARGE_3_RATE_FIELD_ID) {

                var qty = currentRecord.getValue(ADDITIONAL_CHARGE_3_QTY_FIELD_ID) || 0;

                var rate = currentRecord.getValue(ADDITIONAL_CHARGE_3_RATE_FIELD_ID) || 0;

                currentRecord.setValue(ADDITIONAL_CHARGE_3_AMOUNT_FIELD_ID, qty * rate);

            } else if (fieldId === LPG_CONSUMPTION_KG_FIELD_ID || fieldId === LPG_CONSUMPTION_RATE_FIELD_ID) {

                var qty = currentRecord.getValue(LPG_CONSUMPTION_KG_FIELD_ID) || 0;

                var rate = currentRecord.getValue(LPG_CONSUMPTION_RATE_FIELD_ID) || 0;

                currentRecord.setValue(LPG_CONSUMPTION_AMOUNT_FIELD_ID, qty * rate);

            } else if (fieldId === GEN_SET_CONSUMPTION_KWH_FIELD_ID || fieldId === GEN_SET_CONSUMPTION_RATE_FIELD_ID) {

                var qty = currentRecord.getValue(GEN_SET_CONSUMPTION_KWH_FIELD_ID) || 0;

                var rate = currentRecord.getValue(GEN_SET_CONSUMPTION_RATE_FIELD_ID) || 0;

                currentRecord.setValue(GEN_SET_CONSUMPTION_AMOUNT_FIELD_ID, qty * rate);

            }

        }

        function onSubmitForApprovalBtnClick() {

            var currentRecord = m_currentRecord.get();

            // Check if the button is already clicked
            // This is to prevent calling the link multiple times
            if (!g_isSubmitForApprovalBtnClick) {

                g_isSubmitForApprovalBtnClick = true;

                // Redirect to the approval link
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1496&deploy=1&action=submitforapproval&id=" + currentRecord.id;

            } else {

                alert('You have already submitted the form.');

            }

        }

        function onCheckedBtnClick() {

            var currentRecord = m_currentRecord.get();

            // Check if the button is already clicked
            // This is to prevent calling the link multiple times
            if (!g_isCheckBtnClick) {

                g_isCheckBtnClick = true;

                // Redirect to the approval link
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1496&deploy=1&action=checked&id=" + currentRecord.id;

            } else {

                alert('You have already submitted the form.');

            }

        }

        function onApproveBtnClick(approve_field) {

            var currentRecord = m_currentRecord.get();

            // Check if the button is already clicked
            // This is to prevent calling the link multiple times
            if (!g_isApproveBtnClick) {

                g_isApproveBtnClick = true;

                // Redirect to the approval link
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1496&deploy=1&action=approve&id=" + currentRecord.id + "&field=" + approve_field;

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
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1496&deploy=1&action=reject&id=" + currentRecord.id;

            } else {

                alert('You have already submitted the form.');

            }

        }

        function onInvoiceBtnClick(lm_id) {

            var currentRecord = m_currentRecord.get();

            //Redirect to Invoice
            window.location.href = 'https://9794098.app.netsuite.com/app/accounting/transactions/custinvc.nl?id=' + lm_id + '&e=T&transform=salesord&billorderedtime=T&memdoc=0&whence=&origin_id=' + currentRecord.id;

        }

        function onDepositBtnClick() {

            var currentRecord = m_currentRecord.get();

            //Redirect to Invoice
            window.location.href = 'https://9794098.app.netsuite.com/app/accounting/transactions/custdep.nl?origin_id=' + currentRecord.id;

        }

        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            onInvoiceBtnClick: onInvoiceBtnClick,
            onDepositBtnClick: onDepositBtnClick,
            onSubmitForApprovalBtnClick: onSubmitForApprovalBtnClick,
            onCheckedBtnClick: onCheckedBtnClick,
            onApproveBtnClick: onApproveBtnClick,
            onRejectBtnClick: onRejectBtnClick,
        };
    }
);