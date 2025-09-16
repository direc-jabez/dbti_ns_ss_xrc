/**
 * @NApiVersion 2.1
 * @NScripttype Suitelet
 *
 * Created by: DBTI - Charles Maverick Herrera
 * Date: Nov 08, 2024
 *
 */

define(["N/search"], function (search) {
	function onRequest(context) {
		var params = context.request.parameters;

		var id = params.id;

		var withholding_tax_codes = getWithholdingTaxCodes(id);

		var response = "null";

		if (withholding_tax_codes.length > 0) {

			response = withholding_tax_codes.join('|');

		}

		context.response.writeLine('<#assign whtaxes = "' + response + '" />');
	}

	function getWithholdingTaxCodes(withholding_tax_name) {
		var search_obj = search.create({
			type: "customrecord_4601_groupedwitaxcode",
			filters:
				[
					["custrecord_4601_gwtc_group.custrecord_4601_wtc_name", "is", withholding_tax_name]
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

		var withholding_taxes = [];
		search_obj.run().each(function (result) {
			var tax_data = result.getText("custrecord_4601_gwtc_code") + ',' + result.getValue({ name: "custrecord_4601_wtc_rate", join: "CUSTRECORD_4601_GWTC_CODE" }) + ',' + result.getValue("custrecord_4601_gwtc_basis");
			withholding_taxes.push(tax_data);
			return true;
		});
		return withholding_taxes;
	}

	return { onRequest };
});
