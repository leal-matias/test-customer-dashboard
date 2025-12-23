import { NextApiRequest, NextApiResponse } from 'next';
import { shopify } from '../../lib/shopify-config';

interface CustomerQueryResponse {
  data?: {
    customer?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    };
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await shopify.session.customAppSession(
      req.query.shop as string
    );

    // Get customer session from headers (Shopify passes this for embedded apps)
    const customerSessionId = req.headers['x-shopify-customer-session-id'];
    
    if (!customerSessionId) {
      return res.status(401).json({ error: 'No customer session' });
    }

    // Verify customer is logged in
    const client = new shopify.clients.Graphql({ session });
    
    // Query customer information
    const response = await client.query({
      data: `{
        customer(customerAccessToken: "${customerSessionId}") {
          id
          firstName
          lastName
          email
          phone
        }
      }`,
    });

    const customer = (response.body as unknown as CustomerQueryResponse)?.data?.customer;
    
    if (!customer) {
      return res.status(401).json({ error: 'Invalid customer session' });
    }

    res.status(200).json({ customer });
  } catch (error) {
    console.error('Customer session error:', error);
    res.status(500).json({ error: 'Failed to verify customer session' });
  }
}