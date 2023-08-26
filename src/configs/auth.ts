export default {
  meEndpoint: '/api/v1/auth/my-account',
  loginEndpoint: '/api/v1/auth/login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
