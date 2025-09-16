/**
 * 
*@NApiVersion 2.1
*@NScriptType Restlet
*/
define(['N/record', 'N/redirect', 'N/runtime', 'N/search', 'N/email'],

    function (record, redirect, runtime, search, email) {

        const FOR_APPROVAL_FIELD_ID = 'custbody_xrc_for_approval';
        const SUBMIT_FOR_APPROVAL_ACTION_ID = 'submitforapproval';
        const APPROVE_ACTION_ID = 'approve';
        const REJECT_ACTION_ID = 'reject';
        const STATUS_FIELD_ID = 'approvalstatus';
        const PENDING_APPROVAL_STATUS = '1';
        const APPROVED_STATUS = '2';
        const REJECT_STATUS = '3';
        const APPROVAL_ONE_FIELD_ID = 'custbody_xrc_approval1';
        const APPROVAL_TWO_FIELD_ID = 'custbody_xrc_approval2';
        const REJECT_FIELD_ID = 'custbody1';
        const JE_CATEGORY_FIELD_ID = 'custbody_xrc_je_category';
        const JE_CATEGORY_GENERAL = '1';
        const ENTRY_NO_FIELD_ID = 'tranid';
        const SUBSIDIARY_FIELD_ID = 'subsidiary';
        const NOTIF_TYPE_REMINDER = 1;
        const NOTIF_TYPE_APPROVED = 2;
        const NOTIF_TYPE_REJECTED = 3;
        const PREPARED_BY_FIELD_ID = 'custbody_xrc_prepared_by';


        function _get(context) {

            var action = context.action;

            var field = context.field;

            var role_to_email = context.role_to_email;

            try {

                // Loading Initial SOA record
                var rec = record.load({
                    type: record.Type.JOURNAL_ENTRY,
                    id: context.id,
                    isDynamic: true,
                });

                var approval_status = rec.getValue(STATUS_FIELD_ID);

                var tran_id = rec.getValue(ENTRY_NO_FIELD_ID);

                var subsidiary = rec.getValue(SUBSIDIARY_FIELD_ID);

                if (role_to_email) {

                    var employee_ids = getEmployeeIdsWithRole(role_to_email);

                }

                var prepared_by = rec.getValue(PREPARED_BY_FIELD_ID);

                if (action === SUBMIT_FOR_APPROVAL_ACTION_ID) {

                    rec.setValue(FOR_APPROVAL_FIELD_ID, true);

                    rec.setValue(STATUS_FIELD_ID, PENDING_APPROVAL_STATUS);

                    if (approval_status === REJECT_STATUS) {

                        rec.setValue(REJECT_FIELD_ID, false);

                    }

                    var je_category = rec.getValue(JE_CATEGORY_FIELD_ID);

                    if (!je_category) {

                        rec.setValue(JE_CATEGORY_FIELD_ID, JE_CATEGORY_GENERAL);

                    }

                    sendEmail(context.id, tran_id, subsidiary, employee_ids);

                } else if (action === APPROVE_ACTION_ID) {

                    rec.setValue(field, true);

                    rec.setValue(getApproverFieldId(field), runtime.getCurrentUser().id);

                    var category = rec.getValue(JE_CATEGORY_FIELD_ID);

                    var last_approver_field = category === JE_CATEGORY_GENERAL ? APPROVAL_ONE_FIELD_ID : APPROVAL_TWO_FIELD_ID;

                    if (field === last_approver_field) {

                        rec.setValue(STATUS_FIELD_ID, APPROVED_STATUS);

                    }

                    sendEmail(context.id, tran_id, subsidiary, [prepared_by], NOTIF_TYPE_APPROVED);

                    if (employee_ids && field !== last_approver_field) {

                        sendEmail(context.id, tran_id, subsidiary, employee_ids);

                    }

                } else if (action === REJECT_ACTION_ID) {

                    rec.setValue(STATUS_FIELD_ID, REJECT_STATUS);

                    rec.setValue(FOR_APPROVAL_FIELD_ID, false);

                    rec.setValue(REJECT_FIELD_ID, true);

                    var fields = ['custbody_xrc_approval1', 'custbody_xrc_approval2'];

                    for (var i = 0; i < fields.length; i++) {

                        var isChecked = rec.getValue(fields[i]);

                        if (!isChecked) {

                            break;

                        }

                        rec.setValue(fields[i], false);

                    }

                    sendEmail(context.id, tran_id, subsidiary, [prepared_by], NOTIF_TYPE_REJECTED);

                }

                rec.save({
                    ignoreMandatoryFields: true,
                });

            } catch (error) {

                log.debug('error', error);

            }

            redirect.toRecord({
                type: record.Type.JOURNAL_ENTRY,
                id: context.id,
            });

        }


        function getApproverFieldId(field) {

            var approvers = {
                'custbody_xrc_approval1': 'custbody_xrc_approver1',
                'custbody_xrc_approval2': 'custbody_xrc_approver2',
            };

            return approvers[field];

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

        function sendEmail(id, tran_id, subsidiary, recipients, type = NOTIF_TYPE_REMINDER) {

            var fromEmail = getEmailSender(subsidiary);

            var body = type === NOTIF_TYPE_REMINDER ?
                `Good day,<br /><br />
                    The Journal Entry is ready for your review and approval.<br /><br />
                    Details:<br /><br />
                    Reference Number: <a href=https://9794098.app.netsuite.com/app/accounting/transactions/journal.nl?id=${id}><b>${tran_id}</b></a><br />
                    Please review the details and approve at your earliest convenience. Let me know if you have any questions or require additional information.<br /><br />
                    Best regards,`
                : type === NOTIF_TYPE_APPROVED ?
                    `Good day,<br /><br />
                    The Journal Entry has been approved.<br /><br />
                    Details:<br /><br />
                    Reference Number: <a href=https://9794098.app.netsuite.com/app/accounting/transactions/journal.nl?id=${id}><b>${tran_id}</b></a><br />
                    If you have any questions, feel free to reach out.<br /><br />
                    Best regards,`
                    :
                    `Good day,<br /><br />
                    The Journal Entry has been reviewed and rejected.<br /><br />
                    Details:<br /><br />
                    Reference Number: <a href=https://9794098.app.netsuite.com/app/accounting/transactions/journal.nl?id=${id}><b>${tran_id}</b></a><br />
                    If you have any questions or need further clarification, feel free to reach out.<br /><br />
                    Best regards,`
                ;

            // email.send({
            //     author: fromEmail,
            //     recipients: recipients,
            //     subject: type === NOTIF_TYPE_REMINDER ? 'Approval Needed: Journal Entry' : type === NOTIF_TYPE_APPROVED ? 'Approval Notification: Journal Entry' : 'Rejection Notification: Journal Entry',
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
