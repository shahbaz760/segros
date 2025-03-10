import passport from 'passport';
import { Strategy as SamlStrategy } from 'passport-saml';

let certificate = null;

certificate = '-----BEGIN CERTIFICATE-----\n' +
    'MIIC8DCCAdigAwIBAgIQeCR501RGoKdCDlMu1O07fzANBgkqhkiG9w0BAQsFADA0MTIwMAYDVQQD\n' +
    'EylNaWNyb3NvZnQgQXp1cmUgRmVkZXJhdGVkIFNTTyBDZXJ0aWZpY2F0ZTAeFw0yNDA4MjMxMzI0\n' +
    'MDZaFw0yNzA4MjMxMzI0MDVaMDQxMjAwBgNVBAMTKU1pY3Jvc29mdCBBenVyZSBGZWRlcmF0ZWQg\n' +
    'U1NPIENlcnRpZmljYXRlMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAruh8S7Eltzht\n' +
    'sfiefvODp9v+AsJlxDy5asAB6ntfYf5zLrH1goywCWUSnmp5P6fB5yxdjp3LfpB+z2HyxzYBPfxT\n' +
    '5LsiOL75BQlPJXBu9fHcefcYwfoWraATQmDjhxTdE8S3n4T0cfZ4jRGp1hkvnCJiJU2t9T+l3t7u\n' +
    '+NftpfT+DY3TOp8DEXbV6GHkIJfxJCIePAdCsGhuiv4CmGRVRYKFfKQA/jJT7UNXJgiLOoxZ8M+/\n' +
    'DcP7Yu+DY9ctd8FuG9YXxHxRBDsxBrgcQm4QhozmE1t8erbyFIDY1d+kfgUY68pUh0uwAOB+CE7B\n' +
    'emnzQ38PoWdmfh0iJTCEifosvQIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQAll9l+i6O6ZUgwWJHp\n' +
    'V38pI+rzFUrDzcdLovPAylAST6iFQWi02neSUD26urRGEqQFQpxcyuO7ztHmCQjo4Yjfs1xn+qnV\n' +
    '5D1EJXZRCZZ7guRkt0kvXvFBKpuryWtNvoePo+V1pMPTodzzplXE3bekD+XWfSlIDcdECITkMJau\n' +
    'mhvljeJZY6xWwFhw+MGS0i5us6t2gvI2uZM5vGY+8iMwG3zNJbKRKZO0JL6v4dKNCgXakPog1rwZ\n' +
    'WyPcWGEw8xEW5d8ZvR+U+SESpCro3X72weIji20a25st89fmz3AuYEeliavUJeGeNENGBixKC2tx\n' +
    '41dl5bmLVy/+izPve4iF\n' +
    '-----END CERTIFICATE-----';
console.log('process.env.BACKEND_BASE_URL', process.env.BACKEND_BASE_URL);
const samlStrategy = new SamlStrategy(
    {
        entryPoint: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/saml2`,
        issuer: process.env.AZURE_AD_ISSUER,
        callbackUrl: `${process.env.BACKEND_BASE_URL}${process.env.AZURE_AD_REPLY_URL}`,
        signatureAlgorithm: 'sha256',
        cert: certificate,
        logoutUrl: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/saml2/logout`
    },
    (profile, done) => {
        return done(
            null,
            profile
            // {
            //     id: profile['nameID'],
            //     email: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
            //     displayName: profile['http://schemas.microsoft.com/identity/claims/displayname'],
            //     firstName: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'],
            //     lastName: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname']
            // }
        );
    })

passport.use(samlStrategy);

// Serialize user
passport.serializeUser(function (user, done) {
    done(null, user);
});

// Deserialize user
passport.deserializeUser(function (user, done) {
    done(null, user);
});

module.exports = passport;