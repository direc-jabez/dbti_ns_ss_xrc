/**
 * 
*@NApiVersion 2.1
*@NScriptType Restlet
*/
define(['N/record', 'N/redirect', 'N/runtime', 'N/search', 'N/email'],

    function (record, redirect, runtime, search, email) {

        const FOR_APPROVAL_FIELD_ID = 'custbody_xrc_for_approval';
        const SUBMIT_FOR_APPROVAL_ACTION_ID = 'submitforapproval';
        const TRANID_NO_FIELD_ID = 'tranid';
        const SUBSIDIARY_FIELD_ID = 'subsidiary';
        const NOTIF_TYPE_REMINDER = 1;
        const NOTIF_TYPE_APPROVED = 2;
        const PREPARED_BY_FIELD_ID = 'employee';


        function _get(context) {

            var action = context.action;

            var role_to_email = context.role_to_email;

            try {

                // Loading Initial SOA record
                var rec = record.load({
                    type: 'intercompanytransferorder',
                    id: context.id,
                    isDynamic: true,
                });

                var tran_id = rec.getValue(TRANID_NO_FIELD_ID);

                var subsidiary = rec.getValue(SUBSIDIARY_FIELD_ID);

                if (role_to_email) {

                    var employee_ids = getEmployeeIdsWithRole(role_to_email);

                }

                var prepared_by = rec.getValue(PREPARED_BY_FIELD_ID);

                if (action === SUBMIT_FOR_APPROVAL_ACTION_ID) {

                    rec.setValue(FOR_APPROVAL_FIELD_ID, true);

                    sendEmail(rec.type, context.id, tran_id, subsidiary, employee_ids);

                }

                rec.save({
                    ignoreMandatoryFields: true,
                });

            } catch (error) {

                log.debug('error', error);

            }

            redirect.toRecord({
                type: 'intercompanytransferorder',
                id: context.id,
            });

        }

        function getEmployeeIdsWithRole(role) {

            var employee_ids = [];

            var employee_search = search.create({
                type: "employee",
                filters:
                    [
                        ["role", "anyof", role],
                    ],
                columns:
                    [
                        search.createColumn({ name: "internalid", label: "Internal ID" })
                    ]
            });

            var search_result = employee_search.run();

            var results = search_result.getRange({
                start: 0,
                end: 8,
            });

            for (var i = 0; i < results.length; i++) {

                employee_ids.push(results[i].id);

            }

            return employee_ids;

        }

        function sendEmail(record_type, id, tran_id, subsidiary, recipients, type = NOTIF_TYPE_REMINDER) {

            var fromEmail = getEmailSender(subsidiary);

            var url = record_type === "transferorder" ? `https://9794098.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=1228&id=${id}` : `https://9794098.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=1228&id=${id}&icto=T`;

            var body = type === NOTIF_TYPE_REMINDER ?
                `Good day,<br /><br />
                The Transfer Order is ready for your review and approval.<br /><br />
                Details:<br /><br />
                Reference Number: <a href=${url}><b>${tran_id}</b></a><br />
                Please review the details and approve at your earliest convenience. Let me know if you have any questions or require additional information.<br /><br />
                Best regards,`
                : type === NOTIF_TYPE_APPROVED ?
                    `Good day,<br /><br />
                The Transfer Order has been approved.<br /><br />
                Details:<br /><br />    
                Reference Number: <a href=${url}><b>${tran_id}</b></a><br />
                If you have any questions, feel free to reach out.<br /><br />
                Best regards,`
                    :
                    `Good day,<br /><br />
                The Transfer Order has been reviewed and rejected.<br /><br />
                Details:<br /><br />
                Reference Number: <a href=${url}><b>${tran_id}</b></a><br />
                If you have any questions or need further clarification, feel free to reach out.<br /><br />
                Best regards,`
                ;

            log.debug('params', [id, tran_id, subsidiary, recipients, type]);

            log.debug('body', body);

            // email.send({
            //     author: fromEmail,
            //     recipients: recipients,
            //     subject: type === NOTIF_TYPE_REMINDER ? 'Approval Needed: Transfer Order' : type === NOTIF_TYPE_APPROVED ? 'Approval Notification: Transfer Order' : 'Rejection Notification: Transfer Order',
            //     body: body,
            // });

        }

        function getEmailSender(subsidiary) {

            var subsidiary_fieldLookUp = search.lookupFields({
                type: search.Type.SUBSIDIARY,
                id: subsidiary,
                columns: ['email']
            });

            return subsidiary_fieldLookUp.email;
        }

        return {
            get: _get,
        };
    }
);
