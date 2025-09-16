/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/format', 'N/record'],

    function (format, record) {

        const METHOD_POST = 'POST';
        const ATD_RECORD_TYPE_ID = 'customrecord_xrc_auth_to_deduct';
        const ATD_CUSTOM_FORM_FIELD_ID = 'customform';
        const ATD_ID_FIELD_ID = 'name';
        const ATD_BILL_FORM_ID = '407';
        const ATD_DATE_FIELD_ID = 'custrecord_xrc_date3';
        const ATD_CREATED_FROM_FIELD_ID = 'custrecord_xrc_created_from';
        const ATD_FUND_CATEGORY_FIELD_ID = 'custrecord_xrc_fund_category3';
        const ATD_CASH_ADVANCE_FUND_CATEGORY_ID = '8';
        const ATD_EMPLOYEE_FIELD_ID = 'custrecord_xrc_fund_custodian3';
        const ATD_REMARKS_FIELD_ID = 'custrecord_xrc_remarks3';
        const ATD_AMOUNT_FIELD_ID = 'custrecord_xrc_amount3';
        const ATD_SUBSIDIARY_FIELD_ID = 'custrecord_xrc_subsidiary3';
        const ATD_LOCATION_FIELD_ID = 'custrecord_xrc_location3';
        const ATD_DEPARTMENT_FIELD_ID = 'custrecord_xrc_department3';
        const ATD_CLASS_FIELD_ID = 'custrecord_xrc_class3';

        function onRequest(context) {

            var method = context.request.method;

            var body = JSON.parse(context.request.body);

            log.debug('body', body);

            if (method === METHOD_POST) {

                var atd_id = createATD(
                    body.date,
                    body.bill_id,
                    body.emp_name,
                    body.memo,
                    body.charge_amount,
                    body.subsidiary,
                    body.location,
                    body.department,
                    body.class
                );

                var data = {
                    atd_id: atd_id,
                };

                context.response.write(JSON.stringify(data));

            }

        }

        function createATD(date, bill_id, employee, remarks, charge_amount, subsidiary, location, department, bill_class) {

            var atd_rec = record.create({
                type: ATD_RECORD_TYPE_ID,
            });

            atd_rec.setValue(ATD_CUSTOM_FORM_FIELD_ID, ATD_BILL_FORM_ID);

            atd_rec.setValue(ATD_DATE_FIELD_ID, new Date(date.split("T")[0] + "T12:00:00"));

            atd_rec.setValue(ATD_CREATED_FROM_FIELD_ID, bill_id);

            atd_rec.setValue(ATD_FUND_CATEGORY_FIELD_ID, ATD_CASH_ADVANCE_FUND_CATEGORY_ID);

            atd_rec.setValue(ATD_CREATED_FROM_FIELD_ID, bill_id);

            atd_rec.setValue(ATD_EMPLOYEE_FIELD_ID, employee);

            atd_rec.setValue(ATD_REMARKS_FIELD_ID, remarks);

            atd_rec.setValue(ATD_AMOUNT_FIELD_ID, charge_amount);

            atd_rec.setValue(ATD_SUBSIDIARY_FIELD_ID, subsidiary);

            atd_rec.setValue(ATD_LOCATION_FIELD_ID, location);

            atd_rec.setValue(ATD_DEPARTMENT_FIELD_ID, department);

            atd_rec.setValue(ATD_CLASS_FIELD_ID, bill_class);

            var atd_id = atd_rec.save({
                ignoreMandatoryFields: true,
            });

            return atd_id;
        }

        return {
            onRequest: onRequest
        }
    }
);