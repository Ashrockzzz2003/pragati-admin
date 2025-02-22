// const BASE_URL: string = "http://localhost:8080/api";
const BASE_URL: string = "https://pragati.amrita.edu/api";

export const api = {
    LOGIN_URL: `${BASE_URL}/auth/login`,
    TAGS_URL: `${BASE_URL}/tag`,
    CLUBS_URL: `${BASE_URL}/club`,
    ORGS_URL: `${BASE_URL}/org`,
    EVENTS_URL: `${BASE_URL}/event`,
    ALERTS_URL: `${BASE_URL}/notification`,
    ALL_EVENTS_URL: `${BASE_URL}/event/all`,
    REVENUE_URL: `${BASE_URL}/admin/amountGenerated`,
    ALL_TRANSACTIONS_URL: `${BASE_URL}/admin/transactions`,
    VERIFY_TRANSACTION_URL: `https://pragati.amrita.edu/transactions/verify`,
    ALL_PARTICIPANTS_URL: `${BASE_URL}/admin/all`,
};
