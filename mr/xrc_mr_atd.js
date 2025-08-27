/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 08, 2024
 * 
 */
define(['N/record', 'N/search', 'N/email'],

    function (record, search, email) {

        const SEARCH_ID = 'customsearch_xrc_5_days_check';
        const FUND_REQUEST_TYPE_ID = 'customrecord_xrc_fund_request';
        const FOR_ATD_FIELD_ID = 'custrecord_xrc_for_atd';

        function getInputData(context) {

            // Load the search with the id
            var cust_search = search.load({
                id: SEARCH_ID,
            });

            return cust_search;

        }

        function reduce(context) {

            try {

                var value = JSON.parse(context.values);

                var fr_id = value.values["custbody_xrc_fund_request_num"].value;

                var fr_name = value.values["custbody_xrc_fund_request_num"].text;

                var emp_id = value.values["custrecord_xrc_requestor.CUSTBODY_XRC_FUND_REQUEST_NUM"].value;

                var emp_name = value.values["custrecord_xrc_requestor.CUSTBODY_XRC_FUND_REQUEST_NUM"].text;

                var purpose = value.values["custrecord_xrc_purpose.CUSTBODY_XRC_FUND_REQUEST_NUM"];

                var total = value.values["amount"];

                record.submitFields({
                    type: FUND_REQUEST_TYPE_ID,
                    id: fr_id,
                    values: {
                        [FOR_ATD_FIELD_ID]: true,
                    },
                    options: {
                        ignoreMandatoryFields: true
                    }
                });

                notifyRequestor(fr_id, fr_name, emp_id, emp_name, purpose, total);

            } catch (error) {

                log.debug('error', error);

            }
        }

        function notifyRequestor(id, tran_id, emp_id, emp_name, purpose, total) {

            total = parseFloat(Math.abs(total)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

            var body = `Good Day,<br /><br />
                        This is to inform you that an Authority to Deduct (ATD) has been issued for your records.<br /><br />
                        Reason for Deduction: ${purpose}<br />
                        Amount: ₱${total}<br />
                        Reference/Details: <b><a href=https://9794098.app.netsuite.com/app/common/custom/custrecordentry.nl?id=${id}&rectype=1213&whence=>${tran_id}</a></b><br /><br />
                        If you have any questions or would like to discuss this further, please feel free to reach out.<br /><br />
                        Thank you for your attention to this matter.<br /><br />
                        Best regards,`
                ;

            log.debug('body', body);

            // Pending author
            // email.send({
            //     author: fromEmail,
            //     recipients: emp_id,
            //     subject: 'Notification of Authority to Deduct (ATD)',
            //     body: body,
            // });
        }

        return {
            getInputData: getInputData,
            reduce: reduce,
        };
    }
);