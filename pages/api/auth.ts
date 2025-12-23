import { NextApiRequest, NextApiResponse } from 'next';
import { shopify } from '../../lib/shopify-config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { shop } = req.query;

  if (!shop) {
    return res.status(400).send('Missing shop parameter');
  }

  const authRoute = await shopify.auth.begin({
    shop: shop as string,
    callbackPath: '/api/auth/callback',
    isOnline: true,
    rawRequest: req,
    rawResponse: res,
  });

  return res.redirect(authRoute);
}