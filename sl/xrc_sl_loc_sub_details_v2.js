/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/record', 'N/file', 'N/search'],

    function (record, file, search) {

        const LOCATION_QUERY = 'location';
        const SUBSIDIARY_QUERY = 'subsidiary';
        const LOGO_FIELD_ID = 'logo';
        const LEGAL_NAME_FIELD_ID = 'legalname';
        const ADDRESS_FIELD_ID = 'mainaddress_text';
        const CUSTOMER_LEGAL_NAME_FIELD_ID = 'custentity_xrc_legal_name';
        const CUSTOMER_TRADE_NAME_FIELD_ID = 'custentity_xrc_trade_name';
        const CUSTOMER_TYPE_FIELD_ID = 'isperson';
        const DOCUMENT_NUMBER_PREFIX_FIELD_ID = 'tranprefix';
        const ACCOUNT_NAME_FIELD_ID = 'custrecord_xrc_acct_name';
        const BANK_BRANCH_FIELD_ID = 'custrecord_xrc_bank_branch';
        const ACCOUNT_NUMBER_FIELD_ID = 'custrecord_xrc_acct_num';
        const PHONE_FIELD_ID = 'custrecord_xrc_subsidiary_phone';
        const FAX_FIELD_ID = 'fax';
        const AUTHORIZED_REPRESENTATIVE_FIELD_ID = 'custrecord_xrc_authorized_rep';
        const ADDRESS_BOOK_SUBLIST_ID = 'addressbook';
        const ADDRESS_SUBLIST_FIELD_ID = 'addressbookaddress_text';
        const DEFAULT_BILLING_SUBLIST_FIELD_ID = 'defaultbilling';


        function onRequest(context) {

            var params = context.request.parameters;

            log.debug('params', params);

            var response = '';

            if (params?.subname) {

                var sub_id = getSubsidiaryId(params.subname);

                // Get location details on subsidiary query type
                response = getSubsidiaryDetails(sub_id);

            }

            log.debug('response', response);

            context.response.writeLine(response);

        }

        function getSubsidiaryDetails(sub_id) {

            var response = '';

            // Loading the subsidiary record to get the legal name of the subsidiary
            var subsidiary_rec = record.load({
                type: record.Type.SUBSIDIARY,
                id: sub_id,
            });

            response = '<#assign legalName="' + subsidiary_rec.getValue(LEGAL_NAME_FIELD_ID) + '"/>';

            return response;
        }

        function getSubsidiaryId(subname) {

            var subid = '';

            var subsidiary_search = search.create({
                type: "subsidiary",
                filters:
                    [
                        ["custrecord_impbundle_company_shortname", "is", subname]
                    ],
                columns: []
            });


            subsidiary_search.run().each(function (result) {
                subid = result.id;
                return true;
            });

            return subid;


        }

        return {
            onRequest: onRequest
        }
    }
);