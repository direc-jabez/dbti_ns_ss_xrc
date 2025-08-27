/**
 * @NApiVersion 2.1
 * @NScripttype Suitelet
 *
 * Created by: DBTI - Charles Maverick Herrera
 * Date: Oct 29, 2024
 *
 */

define(["N/record"], function (record) {

	const LEASE_PROPOSAL_RENTAL_ESCALATION = "custbody_xrc_rental_escalation_percent";
	const LEASE_PROPOSAL_CUSA_FIELD_ID = 'custbody_xrc_cusa';
	const SPACE_NO_FIELD_ID = 'custbody_xrc_space_num';
	const CONTACT_PERSON_FIELD_ID = 'custbody_xrc_lp_contact_person';
	const JOB_TITLE_FIELD_ID = 'custbody_xrc_lp_job_title';
	const LEASE_TYPE_FIELD_ID = 'custbody_xrc_lease_type';
	const PERCENTAGE_FIELD_ID = 'custbody_xrc_percentage_rate';
	const PERCENTAGE_ON_WORD = 'custbody_number_on_word';


	function onRequest(context) {

		var params = context.request.parameters; // Getting URI parameters

		var lease_proposal_id = params.lease_proposal_id;

		log.debug('lease_proposal_id', lease_proposal_id);

		try {
			var lease_proposal_rec = record.load({
				type: record.Type.ESTIMATE,
				id: lease_proposal_id,	
				isDynamic: true,
			});

			var rental_escalation = lease_proposal_rec.getValue(LEASE_PROPOSAL_RENTAL_ESCALATION);

			var cusa = lease_proposal_rec.getValue(LEASE_PROPOSAL_CUSA_FIELD_ID);

			var space_no = lease_proposal_rec.getText(SPACE_NO_FIELD_ID);

			var contact_person = lease_proposal_rec.getText(CONTACT_PERSON_FIELD_ID).split(":")[1].trim();;

			var job_title = lease_proposal_rec.getText(JOB_TITLE_FIELD_ID);

			var lease_type = lease_proposal_rec.getText(LEASE_TYPE_FIELD_ID);

			var percentage = lease_proposal_rec.getValue(PERCENTAGE_FIELD_ID);

			var percentage_on_word = lease_proposal_rec.getValue(PERCENTAGE_ON_WORD).split(',')[4];

			log.debug('percentage_on_word', percentage_on_word);

			var response = '<#assign lease_proposal_rental_escalation="' + rental_escalation + '"/>' +
				'<#assign lease_proposal_cusa="' + cusa + '"/>' +
				'<#assign space_no="' + space_no + '"/>' +
				'<#assign contact_person="' + contact_person + '"/>' +
				'<#assign contact_job_title="' + job_title + '"/>' +
				'<#assign lease_type="' + lease_type + '"/>' +
				'<#assign percentage="' + percentage + '"/>' +
				'<#assign percentage_on_word="' + percentage_on_word + '"/>';

			context.response.writeLine(response);
		} catch (error) {

		}

	}

	return { onRequest };
});
