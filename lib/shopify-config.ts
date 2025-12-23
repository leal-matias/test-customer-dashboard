import '@shopify/shopify-api/adapters/node';
import { shopifyApi, ApiVersion } from '@shopify/shopify-api';

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET as string,
  scopes: process.env.SCOPES?.split(',') || [],
  hostName: process.env.HOST?.replace(/https?:\/\//, '') as string,
  hostScheme: 'https',
  apiVersion: ApiVersion.October23,
  isEmbeddedApp: true,
});

export { shopify };