/**
*@NApiVersion 2.1
*@NScriptType Restlet
*/
define(['N/record', 'N/redirect', 'N/runtime', 'N/search', 'N/email'],

    function (record, redirect, runtime, search, email) {

        const LEASE_PROPOSAL_RECORD_TYPE = 'estimate';
        const DOCUMENT_STATUS_FIELD_ID = 'custbody_xrc_doc_status';
        const ACTION_SUBMIT = 'submit';
        const ACTION_SIGNED = 'signed';
        const ACTION_SUBMIT_FOR_APPROVAL = 'submitforapproval';
        const ACTION_APPROVE = 'approve';
        const ACTION_REJECT = 'reject';
        const ACTION_CANCEL = 'cancel';
        const STATUS_APPROVED_PENDING_SUBMISSION_ID = '1';
        const STATUS_SUBMITTED_ID = '2';
        const STATUS_SIGNED_ID = '3';
        const STATUS_PENDING_APPROVAL_ID = '5';
        const STATUS_REJECT_ID = '6';
        const STATUS_CANCELLED_ID = '7';
        const ATTACHMENT_FIELD_ID = 'custbody_xrc_lp_attachment';
        const FOR_APPROVAL_FIELD_ID = 'custbody_xrc_for_approval';
        const APPROVAL_ONE_FIELD_ID = 'custbody_xrc_approval1';
        const APPROVAL_TWO_FIELD_ID = 'custbody_xrc_approval2';
        const APPROVER_ONE_FIELD_ID = 'custbody_xrc_approver1';
        const APPROVER_TWO_FIELD_ID = 'custbody_xrc_approver2';
        const REJECTED_FIELD_ID = 'custbody1';
        const TRANID_NO_FIELD_ID = 'tranid';
        const SUBSIDIARY_FIELD_ID = 'subsidiary';
        const NOTIF_TYPE_REMINDER = 1;
        const NOTIF_TYPE_APPROVED = 2;
        const NOTIF_TYPE_REJECTED = 3;
        const PREPARED_BY_FIELD_ID = 'custbody_xrc_prepared_by';

        function _get(context) {

            var currentUser = runtime.getCurrentUser();

            var action = context.action;

            var field = context.field;

            // var role_to_email = context.role_to_email;

            var values = {};

            try {

                // Loading Initial SOA record
                var rec = record.load({
                    type: record.Type.ESTIMATE,
                    id: context.id,
                    isDynamic: true,
                });

                // var tran_id = rec.getValue(TRANID_NO_FIELD_ID);

                // var subsidiary = rec.getValue(SUBSIDIARY_FIELD_ID);

                // if (role_to_email) {

                // var employee_ids = getEmployeeIdsWithRole(role_to_email);

                // }

                // var prepared_by = rec.getValue(PREPARED_BY_FIELD_ID);

                if (action === ACTION_SUBMIT) {

                    values = {
                        [DOCUMENT_STATUS_FIELD_ID]: STATUS_SUBMITTED_ID,
                    };

                } else if (action === ACTION_SIGNED) {

                    var url = context.url;

                    values = {
                        [DOCUMENT_STATUS_FIELD_ID]: STATUS_SIGNED_ID,
                        [ATTACHMENT_FIELD_ID]: url,
                    };

                } else if (action === ACTION_APPROVE) {

                    // sendEmail(context.id, tran_id, subsidiary, [prepared_by], NOTIF_TYPE_APPROVED);

                    if (field === APPROVAL_ONE_FIELD_ID) {

                        values = {
                            [APPROVAL_ONE_FIELD_ID]: true,
                            [APPROVER_ONE_FIELD_ID]: currentUser.id,
                        };

                        // sendEmail(context.id, tran_id, subsidiary, employee_ids);

                    } else if (field === APPROVAL_TWO_FIELD_ID) {

                        values = {
                            [APPROVAL_TWO_FIELD_ID]: true,
                            [APPROVER_TWO_FIELD_ID]: currentUser.id,
                            [DOCUMENT_STATUS_FIELD_ID]: STATUS_APPROVED_PENDING_SUBMISSION_ID,
                        };


                    }

                } else if (action === ACTION_REJECT) {

                    values = {
                        [FOR_APPROVAL_FIELD_ID]: false,
                        [REJECTED_FIELD_ID]: true,
                        [APPROVAL_ONE_FIELD_ID]: false,
                        [APPROVAL_TWO_FIELD_ID]: false,
                        [APPROVER_ONE_FIELD_ID]: null,
                        [APPROVER_TWO_FIELD_ID]: null,
                        [DOCUMENT_STATUS_FIELD_ID]: STATUS_REJECT_ID,
                    };

                    // sendEmail(context.id, tran_id, subsidiary, [prepared_by], NOTIF_TYPE_REJECTED);

                } else if (action === ACTION_SUBMIT_FOR_APPROVAL) {

                    values = {
                        [FOR_APPROVAL_FIELD_ID]: true,
                        [REJECTED_FIELD_ID]: false,
                        [DOCUMENT_STATUS_FIELD_ID]: STATUS_PENDING_APPROVAL_ID,
                    };

                    // sendEmail(context.id, tran_id, subsidiary, employee_ids);

                } else if (action === ACTION_CANCEL) {

                    values = {
                        [FOR_APPROVAL_FIELD_ID]: false,
                        [DOCUMENT_STATUS_FIELD_ID]: STATUS_CANCELLED_ID,
                    };

                }

                record.submitFields({
                    type: record.Type.ESTIMATE,
                    id: context.id, // Lease proposal id
                    values: values,
                    options: {
                        ignoreMandatoryFields: true
                    }
                });

            } catch (error) {

                log.debug('error', error);

            }

            redirect.toRecord({
                type: record.Type.ESTIMATE,
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

        function sendEmail(id, tran_id, subsidiary, recipients, type = NOTIF_TYPE_REMINDER) {

            log.debug('params', [id, tran_id, subsidiary, recipients, type]);

            var fromEmail = getEmailSender(subsidiary);

            var body = type === NOTIF_TYPE_REMINDER ?
                `Good day,<br /><br />
                The Lease Proposal is ready for your review and approval.<br /><br />
                Details:<br /><br />
                Reference Number: <a href=https://9794098.app.netsuite.com/app/accounting/transactions/estimate.nl?id=${id}><b>${tran_id}</b></a><br />
                Please review the details and approve at your earliest convenience. Let me know if you have any questions or require additional information.<br /><br />
                Best regards,`
                : type === NOTIF_TYPE_APPROVED ?
                    `Good day,<br /><br />
                The Lease Proposal has been approved.<br /><br />
                Details:<br /><br />    
                Reference Number: <a href=https://9794098.app.netsuite.com/app/accounting/transactions/estimate.nl?id=${id}><b>${tran_id}</b></a><br />
                If you have any questions, feel free to reach out.<br /><br />
                Best regards,`
                    :
                    `Good day,<br /><br />
                The Lease Proposal has been reviewed and rejected.<br /><br />
                Details:<br /><br />
                Reference Number: <a href=https://9794098.app.netsuite.com/app/accounting/transactions/estimate.nl?id=${id}><b>${tran_id}</b></a><br />
                If you have any questions or need further clarification, feel free to reach out.<br /><br />
                Best regards,`
                ;

            log.debug('body', body);

            // email.send({
            //     author: fromEmail,
            //     recipients: recipients,
            //     subject: type === NOTIF_TYPE_REMINDER ? 'Approval Needed: Lease Proposal' : type === NOTIF_TYPE_APPROVED ? 'Approval Notification: Lease Proposal' : 'Rejection Notification: Lease Proposal',
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
