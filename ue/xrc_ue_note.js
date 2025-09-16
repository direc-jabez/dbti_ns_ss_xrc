/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Jul 26, 2024
 * 
 */
define(['N/runtime', 'N/record', 'N/email', 'N/search'],

    function (runtime, record, email, search) {

        const NEXT_APPROVER_FIELD_ID = 'nextapprover';
        const APPROVAL_TWO_FIELD_ID = 'custbody_xrc_approval2';
        const APPROVER_TWO_FIELD_ID = 'custbody_xrc_approver2';
        const CHECKED_BY_FIELD_ID = 'custbody_xrc_checked_by';
        const NOTED_BY_FIELD_ID = 'custbody_xrc_noted_by';
        const APPROVAL_STATUS_FIELD_ID = 'approvalstatus';
        const APPROVED_STATUS = '2';
        const REJECT_STATUS = '3';
        const INITIAL_SOA_RECORD_TYPE_ID = 'customrecord_xrc_initial_soa';
        const ISOA_NOTED_BY_FIELD_ID = 'custrecord_xrc_noted_by4'
        const ISOA_APPROVAL_TWO_FIELD_ID = 'custrecord_xrc_isoa_approval2';
        const PURCHASE_CATEGORY_FIELD_ID = 'custbody_xrc_purchase_category';
        const ENGINEERING_PR_ID = '1';
        const PO_TRANID_FIELD_ID = 'tranid';
        const NOTIF_TYPE_REMINDER = 1;
        const NOTIF_TYPE_APPROVED = 2;
        const NOTIF_TYPE_REJECTED = 3;
        const REQUESTED_BY_FIELD_ID = 'employee';
        const PREPARED_BY_FIELD_ID = 'custbody_xrc_prepared_by';


        function beforeLoad(context) {

            // Get the current session storage
            var currentSession = runtime.getCurrentSession();

            log.debug('params', context.request.parameters);

            // Save the parameters so we can access it to the
            // afterSubmit entry point
            currentSession.set({
                name: "params",
                value: JSON.stringify(context.request.parameters),
            });

        }

        function afterSubmit(context) {

            // Get the current logged in user
            var currentUser = runtime.getCurrentUser();

            log.debug('params', runtime.getCurrentSession().get({ name: "params" }));

            // Deserialize the save object
            var params = JSON.parse(runtime.getCurrentSession().get({ name: "params" }));

            // if (!params.isApproval) return;

            var type = params.type || 'isoa';

            if (!params?.transaction) return;

            log.debug('type', type);

            // Check the transaction type
            if (type === 'pr') {

                var pr_rec = record.load({
                    type: record.Type.PURCHASE_ORDER,
                    id: params.transaction,
                });

                var requested_by = pr_rec.getValue(REQUESTED_BY_FIELD_ID);

                var prepared_by = pr_rec.getValue(PREPARED_BY_FIELD_ID);

                var category = pr_rec.getValue(PURCHASE_CATEGORY_FIELD_ID);

                var tran_num = pr_rec.getValue(PO_TRANID_FIELD_ID);

                pr_rec.setValue(APPROVAL_TWO_FIELD_ID, true);

                pr_rec.setValue(APPROVER_TWO_FIELD_ID, currentUser.id);

                if (category === ENGINEERING_PR_ID) {

                    // pr_rec.setValue(APPROVAL_STATUS_FIELD_ID, APPROVED_STATUS);

                    var employee_ids = getEmployeeIdsWithRole('1419'); // 1419 = id of XRC - Logistics Manager

                    // sendEmail(pr_rec.id, tran_num, currentUser.id, [requested_by, prepared_by], false, NOTIF_TYPE_APPROVED);

                    // sendEmail(pr_rec.id, tran_num, currentUser.id, employee_ids, true, NOTIF_TYPE_REMINDER);

                }

                pr_rec.save({
                    ignoreMandatoryFields: true,
                });



            } else if (type === 'isoa') {

                record.submitFields({
                    type: INITIAL_SOA_RECORD_TYPE_ID,
                    id: params.transaction,
                    values: {
                        [ISOA_NOTED_BY_FIELD_ID]: currentUser.id,
                        [ISOA_APPROVAL_TWO_FIELD_ID]: true,
                    },
                    options: {
                        ignoreMandatoryFields: true
                    }
                });


            } else {

                record.submitFields({
                    type: record.Type.PURCHASE_ORDER,
                    id: params.transaction,
                    values: {
                        [NOTED_BY_FIELD_ID]: null,
                        [CHECKED_BY_FIELD_ID]: null,
                        [NEXT_APPROVER_FIELD_ID]: null,
                        [APPROVAL_STATUS_FIELD_ID]: REJECT_STATUS,
                    },
                    options: {
                        ignoreMandatoryFields: true
                    }
                });

            }

        }

        function sendEmail(id, tran_num, senderId, recipients, is_check = false, type = NOTIF_TYPE_REMINDER) {

            log.debug('recipients', recipients);

            var body = type === NOTIF_TYPE_REMINDER ?
                `Good day,<br /><br />
                        The Purchase Request is ready for your ${is_check ? 'checking.' : 'review and approval.'}<br /><br />
                        Details:<br /><br />
                        Reference Number: <a href=https://9794098.app.netsuite.com/app/accounting/transactions/purchord.nl?id=${id}&compid=9794098&whence=><b>${tran_num}</b></a><br />
                        Please review the details and approve at your earliest convenience. Let me know if you have any questions or require additional information.<br /><br />
                        Best regards,`
                : type === NOTIF_TYPE_APPROVED ?
                    `Good day,<br /><br />
                        The Purchase Request has been approved.<br /><br />
                        Details:<br /><br />
                        Reference Number: <a href=https://9794098.app.netsuite.com/app/accounting/transactions/purchord.nl?id=${id}&compid=9794098&whence=><b>${tran_num}</b></a><br />
                        If you have any questions, feel free to reach out.<br /><br />
                        Best regards,`
                    :
                    `Good day,<br /><br />
                        The Purchase Request has been reviewed and rejected.<br /><br />
                        Details:<br /><br />
                        Reference Number: <a href=https://9794098.app.netsuite.com/app/accounting/transactions/purchord.nl?id=${id}&compid=9794098&whence=><b>${tran_num}</b></a><br />
                        If you have any questions or need further clarification, feel free to reach out.<br /><br />
                        Best regards,`
                ;

            email.send({
                author: senderId,
                recipients: recipients,
                subject: type === NOTIF_TYPE_REMINDER ? `${is_check ? 'Check' : 'Approval'} Needed: Purchase Request` : type === NOTIF_TYPE_APPROVED ? 'Approval Notification: Purchase Request' : 'Rejection Notification: Purchase Request',
                body: body,
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

        return {
            beforeLoad: beforeLoad,
            afterSubmit: afterSubmit,
        };
    }
);