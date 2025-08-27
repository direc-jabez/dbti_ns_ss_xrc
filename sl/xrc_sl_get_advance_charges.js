/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/search', 'N/record'],

    function (search, record) {

        const WHT_GOV = '102';
        const WHT_CODE_RECORD_TYPE = 'customrecord_4601_witaxcode';
        const GROUPED_WHT_CODES_FIELD_ID = 'custrecord_4601_wtc_groupedwitaxcodes';

        function onRequest(context) {

            var params = context.request.parameters;

            var advance_charges = getAdvanceCharges(params.id);
            log.debug('advance charges', advance_charges);

            var response = '<#assign charges="' + advance_charges.join(',') + '"/>';

            context.response.writeLine(response);

        }

        function getAdvanceCharges(internal_id) {

            var charges = [];

            var advance_charges_search = search.create({
                type: "customrecord_xrc_initial_soa_item",
                filters:
                    [
                        ["custrecord_xrc_initial_soa_num", "anyof", internal_id]
                    ],
                columns:
                    [
                        search.createColumn({ name: "custrecord_xrc_account_id", label: "Account ID" }),
                        search.createColumn({ name: "custrecord_xrc_account_descript", label: "Account Description" }),
                        search.createColumn({ name: "custrecord_xrc_charges", label: "Charges" }),
                        search.createColumn({ name: "custrecord_xrc_amount5", label: "Amount" }),
                        search.createColumn({ name: "custrecord_xrc_tax_amt", label: "Tax Amt" }),
                        search.createColumn({ name: "custrecord_xrc_wht_amt", label: "WHT Amt" }),
                        search.createColumn({ name: "custrecord_xrc_balance_due", label: "Balance Due" }),
                        search.createColumn({ name: "custrecord_xrc_qty", label: "Qty" }),
                        search.createColumn({ name: "custrecord_xrc_wht_code", label: "WHT Code" }),
                    ]
            });

            advance_charges_search.run().each(function (result) {

                var wht_code = result.getValue('custrecord_xrc_wht_code');

                var total_amt = result.getValue('custrecord_xrc_amount5');

                charges.push('accountId=' + result.getText('custrecord_xrc_account_id') + '&accDesc=' + result.getValue('custrecord_xrc_account_descript') + '&charges=' + result.getValue('custrecord_xrc_charges') + '&totalAmt=' + total_amt + '&taxAmt=' + result.getValue('custrecord_xrc_tax_amt') + '&whtAmt=' + result.getValue('custrecord_xrc_wht_amt') + '&due=' + result.getValue('custrecord_xrc_balance_due') + '&qty=' + result.getValue('custrecord_xrc_qty') + '&wht_code=' + result.getText('custrecord_xrc_wht_code'));

                if (wht_code === WHT_GOV) {

                    const basisAndRates = getWHTBasisAndRate();

                    basisAndRates.forEach(obj => {

                        const { wht_code, rate, basis } = obj;

                        var wht_amount = (parseFloat(total_amt) * basis) * rate;

                        charges.push('accountId=' + '' + '&accDesc=' + '' + '&charges=' + '' + '&totalAmt=' + '' + '&taxAmt=' + '' + '&whtAmt=' + wht_amount + '&due=' + 'N/A' + '&qty=' + '' + '&wht_code=' + wht_code);

                    });

                    log.debug('basis and rates', basisAndRates);

                }


                return true;
            });


            return charges;

        }

        function getWHTBasisAndRate() {

            var basisAndRates = [];

            var grouped_wht_search = search.create({
                type: "customrecord_4601_groupedwitaxcode",
                filters:
                    [
                        ["custrecord_4601_gwtc_group", "anyof", "102"]
                    ],
                columns:
                    [
                        search.createColumn({ name: "custrecord_4601_gwtc_code", label: "Withholding Tax Code" }),
                        search.createColumn({
                            name: "custrecord_4601_wtc_rate",
                            join: "CUSTRECORD_4601_GWTC_CODE",
                            label: "Rate"
                        }),
                        search.createColumn({ name: "custrecord_4601_gwtc_basis", label: "Basis" })
                    ]
            });

            grouped_wht_search.run().each(function (result) {

                basisAndRates.push({
                    wht_code: result.getText('custrecord_4601_gwtc_code'),
                    rate: parseFloat(result.getValue({ name: "custrecord_4601_wtc_rate", join: "CUSTRECORD_4601_GWTC_CODE" })) / 100,
                    basis: parseFloat(result.getValue('custrecord_4601_gwtc_basis')) / 100,
                });

                return true;
            });

            return basisAndRates;

        }

        return {
            onRequest: onRequest
        }
    }
);