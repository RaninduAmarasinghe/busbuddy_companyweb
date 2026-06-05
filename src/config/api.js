export const API_BASE_URL =
  "https://busbuddy-10-production.up.railway.app";

export const WS_URL =
  `${API_BASE_URL}/ws-location`;

export const ENDPOINTS = {
  // Company
  COMPANY_LOGIN: "/companies/login",
  COMPANY_REGISTER: "/companies/register",
  COMPANY_BY_ID: "/companies",

  // Driver
  DRIVER_ADD: "/driver/add",
  DRIVER_SEARCH: "/driver/search",
  DRIVER_UPDATE: "/driver/update",
  DRIVER_DELETE: "/driver/delete",

  // Bus
  BUS_ADD: "/bus/add",
  BUS_BY_COMPANY: "/bus/company",
  BUS_UPDATE: "/bus/update",
  BUS_DELETE: "/bus/delete",

  // Alerts
  ALERTS_BY_COMPANY: "/company",
};