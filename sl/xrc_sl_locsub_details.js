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

            var query_type = params.querytype;

            var cust_id = params.custid;

            var response = '';

            // Call function depending on the query type
            if (query_type === LOCATION_QUERY) {

                var loc_id = params.locid;

                // Get location details on location query type
                response = getLocationDetails(loc_id);

            } else if (query_type === SUBSIDIARY_QUERY) {

                var sub_id = params.subid;

                // Get location details on subsidiary query type
                response = getSubsidiaryDetails(sub_id);
            }

            if (cust_id) {

                // Get the Legal name of the tagged customer
                var customer_fieldLookUp = search.lookupFields({
                    type: record.Type.CUSTOMER,
                    id: cust_id, // Customer id
                    columns: [CUSTOMER_LEGAL_NAME_FIELD_ID, CUSTOMER_TRADE_NAME_FIELD_ID],
                });

                var customer_rec = record.load({
                    type: record.Type.CUSTOMER,
                    id: cust_id
                });

                var address_book_lines = customer_rec.getLineCount({
                    sublistId: ADDRESS_BOOK_SUBLIST_ID,
                });

                var label = "";

                if (address_book_lines > 0) {

                    for (var line = 0; line < address_book_lines; line++) {

                        var default_billing = customer_rec.getSublistValue({
                            sublistId: ADDRESS_BOOK_SUBLIST_ID,
                            fieldId: DEFAULT_BILLING_SUBLIST_FIELD_ID,
                            line: line,
                        });

                        if (default_billing) {

                            label = customer_rec.getSublistValue({
                                sublistId: ADDRESS_BOOK_SUBLIST_ID,
                                fieldId: ADDRESS_SUBLIST_FIELD_ID,
                                line: line
                            });

                            break;

                        }

                    }

                    if (!label) {

                        label = customer_rec.getSublistValue({
                            sublistId: ADDRESS_BOOK_SUBLIST_ID,
                            fieldId: ADDRESS_SUBLIST_FIELD_ID,
                            line: 0,
                        });

                    }

                }

                log.debug('label', label.split("<br>").length);

                response += '<#assign default_address="' + label + '"?html/>' + '<#assign customerLegalName="' + customer_fieldLookUp[CUSTOMER_LEGAL_NAME_FIELD_ID] + '"?html/>' + '<#assign customerTradeName="' + customer_fieldLookUp[CUSTOMER_TRADE_NAME_FIELD_ID] + '"?html/>';

            }

            log.debug('response', response);

            context.response.writeLine(response);

        }

        function getLocationDetails(loc_id) {

            var location_rec = record.load({
                type: record.Type.LOCATION,
                id: loc_id,
            });

            // Loading the file object to get the logo URL
            var fileObject = file.load({
                id: location_rec.getValue(LOGO_FIELD_ID), // Logo ID
            });

            var location_code = location_rec.getValue(DOCUMENT_NUMBER_PREFIX_FIELD_ID);

            var account_name = location_rec.getValue(ACCOUNT_NAME_FIELD_ID);

            var bank_branch = location_rec.getValue(BANK_BRANCH_FIELD_ID);

            var account_number = location_rec.getValue(ACCOUNT_NUMBER_FIELD_ID);

            var response = '<#assign locationLogoURL="' + fileObject.url + '"/>' +
                '<#assign location_code="' + location_code + '"/>' +
                '<#assign account_name="' + account_name + '"/>' +
                '<#assign bank_branch="' + bank_branch + '"/>' +
                '<#assign account_number="' + account_number + '"/>';

            return response;

        }

        function getSubsidiaryDetails(sub_id) {

            var response = '';

            // Loading the subsidiary record to get the legal name of the subsidiary
            var subsidiary_rec = record.load({
                type: record.Type.SUBSIDIARY,
                id: sub_id,
            });

            response = '<#assign legalName="' + subsidiary_rec.getValue(LEGAL_NAME_FIELD_ID) + '"/>' +
                '<#assign address="' + subsidiary_rec.getValue(ADDRESS_FIELD_ID) + '"/>' +
                '<#assign phone="' + subsidiary_rec.getValue(PHONE_FIELD_ID) + '"/>' +
                '<#assign fax="' + subsidiary_rec.getValue(FAX_FIELD_ID) + '"/>' +
                '<#assign vat_reg_tin="' + subsidiary_rec.getValue("federalidnumber") + '"/>';

            var authorized_rep_id = subsidiary_rec.getValue(AUTHORIZED_REPRESENTATIVE_FIELD_ID);

            if (authorized_rep_id) {

                var authorized_rep = subsidiary_rec.getText(AUTHORIZED_REPRESENTATIVE_FIELD_ID);

                var emp_fieldLookup = search.lookupFields({
                    type: search.Type.EMPLOYEE,
                    id: authorized_rep_id,
                    columns: ['title', 'firstname', 'middlename', 'lastname']
                });

                var authorized_rep_name = emp_fieldLookup.firstname + ' ' + emp_fieldLookup.middlename + ' ' + emp_fieldLookup.lastname;

                response += '<#assign authorized_rep="' + authorized_rep_name + '"/>' +
                    '<#assign job_title="' + emp_fieldLookup.title + '"/>';

            }


            return response;
        }

        return {
            onRequest: onRequest
        }
    }
);