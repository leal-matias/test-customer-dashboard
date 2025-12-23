import { NextApiRequest, NextApiResponse } from 'next';
import { shopify } from '../../lib/shopify-config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const callback = await shopify.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });

    const { session } = callback;
    
    // Redirect to the app with session token
    const redirectUrl = `/?shop=${session.shop}&host=${req.query.host}`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error(error);
    res.status(500).send('Authentication failed');
  }
}