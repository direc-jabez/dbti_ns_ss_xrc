/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 22, 2024
 * 
 */
define(['N/dataset', 'N/record'],

    function (dataset, record) {

        const DATASET_ID = 'custdataset_xrc_cust_dep';
        const DEPOSIT_FIELD_ID = 'deposit';
        const LINKS_SUBLIST_ID = 'links';
        const ID_SUBLIST_FIELD_ID = 'id';
        const ESCALATION_SCHEDULE_SUBLIST_ID = 'recmachcustrecord_xrc_esc_sched_estimate';
        const BILLING_DATE_SUBLIST_FIELD_ID = 'custrecord_xrc_esc_sched_billing_date';
        const SECURITY_DEPOSIT_BALANCE_SUBLIST_FIELD_ID = 'custrecord_xrc_sec_dep_bal';
        const DATE_FIELD_ID = 'trandate';
        const APPLIED_FIELD_ID = 'applied';


        function afterSubmit(context) {

            var newRecord = context.newRecord;

            log.debug('type', context.type);

            if (context.type === context.UserEventType.CREATE) {

                var customer_deposit = newRecord.getValue(DEPOSIT_FIELD_ID);

                var deposit_date = newRecord.getValue(DATE_FIELD_ID);

                var lease_proposal_id = getLeaseProposalId(customer_deposit);

                if (lease_proposal_id) {

                    var applied = newRecord.getValue(APPLIED_FIELD_ID);

                    // Update Lease Memo lines (Security Deposit Balance)
                    updateLeaseMemorandum(lease_proposal_id, deposit_date, applied);

                }


            }

        }

        function getLeaseProposalId(customer_deposit) {

            // Loading dataset that contains the ID of 
            // the Lease Proposal
            var myLoadedDataset = dataset.load({
                id: DATASET_ID,
            });

            var data = myLoadedDataset.run().asMappedResults();

            // Filtering the data based on the internal id of
            // the current record
            var filtered_data = data.filter((d) => {
                return d.id === parseInt(customer_deposit);
            });

            return filtered_data[0].id_1; // id_1 is the internal id of the Lease Proposal
        }

        function updateLeaseMemorandum(lease_proposal_id, deposit_date, deposit_amount) {

            var lease_proposal_rec = record.load({
                type: record.Type.ESTIMATE,
                id: lease_proposal_id,
            });

            // Getting the id of Lease Memorandum
            var lease_memo_id = lease_proposal_rec.getSublistValue({
                sublistId: LINKS_SUBLIST_ID,
                fieldId: ID_SUBLIST_FIELD_ID,
                line: 0,
            });

            // Now load the Lease Memorandum
            var lease_memo_rec = record.load({
                type: record.Type.SALES_ORDER,
                id: lease_memo_id,
                isDynamic: true,
            });

            var esc_sched_lines = lease_memo_rec.getLineCount({
                sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
            });

            var sec_dep_bal = 0;

            for (var line = 0; line < esc_sched_lines; line++) {

                lease_memo_rec.selectLine({
                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    line: line,
                });

                var bill_date = lease_memo_rec.getCurrentSublistValue({
                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    fieldId: BILLING_DATE_SUBLIST_FIELD_ID,
                });

                var start_date = new Date(bill_date.getFullYear(), bill_date.getMonth(), 1);

                // Check if date is in range of the current billing date
                if (isDateInRange(deposit_date, start_date, bill_date)) {

                    var security_deposit_balance = lease_memo_rec.getCurrentSublistValue({
                        sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                        fieldId: SECURITY_DEPOSIT_BALANCE_SUBLIST_FIELD_ID,
                    });

                    sec_dep_bal = security_deposit_balance - deposit_amount;

                }

                // If the value of sec_dep_bal changes, update the
                // succeeding billing schedules
                if (sec_dep_bal) {

                    lease_memo_rec.setCurrentSublistValue({
                        sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                        fieldId: SECURITY_DEPOSIT_BALANCE_SUBLIST_FIELD_ID,
                        value: sec_dep_bal,
                    });

                    lease_memo_rec.commitLine({
                        sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    });

                }
            }

            lease_memo_rec.save({
                ignoreMandatoryFields: true,
            });

        }

        function isDateInRange(date, startDate, endDate) {

            // Convert all dates to timestamps for comparison
            var dateTimestamp = date.getTime();
            var startTimestamp = startDate.getTime();
            var endTimestamp = endDate.getTime();

            // Check if the date is within the range
            return dateTimestamp >= startTimestamp && dateTimestamp <= endTimestamp;

        }

        return {
            afterSubmit: afterSubmit,
        };
    }
);