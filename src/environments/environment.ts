export const endpoints = {
  '/users': 'https://userapi.com',
  '/roles': 'https://roleapi.com',
};
export const base = window.location.origin;

export const environment = {
  isProduction: false,
  adalConfig : {
    tenant: '<>',
    instance: '<>',
    clientId: '<>',
    endpoints: endpoints,
    redirectUri: base
  },
  rolesUrl: '/roles',
  userUrl: '/users',
};
