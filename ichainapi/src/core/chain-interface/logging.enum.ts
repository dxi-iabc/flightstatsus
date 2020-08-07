export enum HlfErrors {


    'LOAD_USER_ERROR' = 'FATAL: Failed to load \'%s\' from local wallet.',



    'NO_ENROLLED_USER' = 'User not defined, or not enrolled. Or network is down',
    'BAD_TRANSACTION_PROPOSAL' = 'Transaction proposal was bad (bad count = %d)',
    'TRANSACTION_TIMED_OUT' = 'The transaction has timed out: %s',
    'INVALID_TRANSACTION' = 'The transaction was invalid, code: %s',
    'FAILED_TO_SEND_TX' = 'Failed to send transaction and get notifications within the timeout period: %s',
    'FAILED_TO_SEND_PROPOSAL' = 'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...',
    'FAILED_TO_ENROLL_ADMIN' = 'Failed to enroll admin: %s',
    'ERROR_STARTING_HLF' = 'Error ocurred during connection hlf: %s',
    'FAILED_TO_REGISTER' = 'Failed to register: %s',
    'NO_ADMIN_USER' = 'No Admin user present',
    // tslint:disable-next-line:max-line-length
    'AUTH_FAILURES' = 'Authorization failures may be caused by having admin credentials from a previous CA instance.\n Try again after deleting the contents of the store directory ',
}

export enum HlfInfo {

    'LOAD_USER_SUCCESS' = 'Loaded user \'%s\' from local wallet.',


    'CREATING_CLIENT' = 'Creating client and setting the wallet location...',
    'CHECK_USER_ENROLLED' = 'Checking if user is enrolled...',
    'USER_ENROLLED' = 'User is enrolled: %s',
    'MAKE_QUERY' = 'Making query:',
    'QUERY_TRANSACTIONID' = 'Query transactionId %s:',
    'INIT_SUCCESS' = 'Successfully instantiated HLF Client',
    'ASSIGNING_TRANSACTION_ID' = 'Assigning transaction_id: %s',
    'NO_PAYLOADS_RETURNED' = 'No payloads were returned from query',
    'GOOD_TRANSACTION_PROPOSAL' = 'Transaction proposal was good',
    'RESPONSE_IS' = 'Response is %s',
    'SUCCESFULLY_SENT_PROPOSAL' = 'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s", payload - "%s"',
    'COMMITTED_ON_PEER' = 'The transaction has been committed on peer %s',
    'CHECK_TRANSACTION_PROPOSAL' = 'Checking if transaction proposal is good...',
    'REGISTERING_TRANSACTION_EVENT' = 'Registering transaction event...',
    'CONNECTING_EVENTHUB' = 'Connecting eventhub...',
    'CONNECTED_TO_EVENTHUB' = 'Connecting eventhub...done',
    'REGISTERING_TRANSACTION_EVENT_START' = 'Registering transaction event...start',
    'REGISTERING_TRANSACTION_EVENT_DONE' = 'Registering transaction event...done',
}
