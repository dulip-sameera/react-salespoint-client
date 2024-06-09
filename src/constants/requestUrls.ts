const DOMAIN = "http://localhost:8080";

const AUTH = "auth";
export const AUTH_LOGIN_URL = `${DOMAIN}/${AUTH}/login`;

const CUSTOMERS = "customers";
export const GET_ALL_CUSTOMERS_URL = `${DOMAIN}/${CUSTOMERS}`;
export const GET_CUSTOMER_URL = `${DOMAIN}/${CUSTOMERS}`;
export const GET_CUSTOMER_BY_PHONE_URL = `${DOMAIN}/${CUSTOMERS}/phone`;
export const POST_CREATE_CUSTOMER_URL = `${DOMAIN}/${CUSTOMERS}`;
export const PUT_UPDATE_CUSTOMER_URL = `${DOMAIN}/${CUSTOMERS}`;
export const DELETE_CUSTOMER_URL = `${DOMAIN}/${CUSTOMERS}`;

const USERS = "users";
export const GET_CURRENT_USER_URL = `${DOMAIN}/${USERS}/me`;
export const GET_ALL_USERS_URL = `${DOMAIN}/${USERS}`;
export const GET_USER_URL = `${DOMAIN}/${USERS}`;
export const POST_CREATE_USER_URL = `${DOMAIN}/${USERS}`;
export const DELETE_USER_URL = `${DOMAIN}/${USERS}`;
export const PUT_UPDATE_USER_URL = `${DOMAIN}/${USERS}`;
export const GET_ALL_USER_ROLES_URL = `${DOMAIN}/${USERS}/roles`;
export const GET_ALL_USER_STATUSES_URL = `${DOMAIN}/${USERS}/statuses`;

const ITEM_CATEGORIES = "item-categories";
export const GET_ALL_ITEM_CATEGORIES_URL = `${DOMAIN}/${ITEM_CATEGORIES}`;
export const GET_ITEM_CATEGORy_BY_ID_URL = `${DOMAIN}/${ITEM_CATEGORIES}`;
export const GET_ITEM_CATEGORy_BY_NAME_URL = `${DOMAIN}/${ITEM_CATEGORIES}`;
export const POST_CREATE_ITEM_CATEGORIES_URL = `${DOMAIN}/${ITEM_CATEGORIES}`;
export const PUT_UPDATE_ITEM_CATEGORIES_URL = `${DOMAIN}/${ITEM_CATEGORIES}`;
export const DELETE_ITEM_CATEGORY_URL = `${DOMAIN}/${ITEM_CATEGORIES}`;

const ITEM = "items";
export const GET_ALL_ITEMS_URL = `${DOMAIN}/${ITEM}`;
export const GET_ITEM_BY_ID_URL = `${DOMAIN}/${ITEM}`;
export const GET_ALL_ITEM_STATUSES_URL = `${DOMAIN}/${ITEM}/statuses`;
export const POST_CREATE_ITEM_URL = `${DOMAIN}/${ITEM}`;
export const PUT_UPDATE_ITEM_URL = `${DOMAIN}/${ITEM}`;
export const DELETE_ITEM_URL = `${DOMAIN}/${ITEM}`;

const STOCK = "stocks";
export const GET_ALL_STOCKS_URL = `${DOMAIN}/${STOCK}`;
export const GET_STOCK_BY_ID_URL = `${DOMAIN}/${STOCK}`;
export const GET_ALL_STOCKS_BY_ITEM_URL = `${DOMAIN}/${STOCK}/item`;
export const POST_CREATE_STOCK_URL = `${DOMAIN}/${STOCK}`;
export const PUT_UPDATE_STOCK_URL = `${DOMAIN}/${STOCK}`;
export const DELETE_STOCK_URL = `${DOMAIN}/${STOCK}`;

const ORDER = "orders";
export const GET_ALL_ORDERS_URL = `${DOMAIN}/${ORDER}`;
export const GET_ORDER_BY_ID_URL = `${DOMAIN}/${ORDER}`;
export const POST_CREATE_ORDER_URL = `${DOMAIN}/${ORDER}`;
export const POST_ORDER_ADD_ITEM_URL = `${DOMAIN}/${ORDER}/add-item`;
export const POST_ORDER_REMOVE_ITEM_URL = `${DOMAIN}/${ORDER}/remove-item`;
export const PUT_UPDATE_PAID_STATUS_URL = `${DOMAIN}/${ORDER}/pay`;
export const DELETE_ORDER_URL = `${DOMAIN}/${ORDER}`;
