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
    const shop = req.query.shop as string;
    const customerId = req.query.customer_id as string;

    if (!shop) {
      return res.status(400).json({ error: 'Missing shop parameter' });
    }

    // Para App Proxy con logged_in_customer_id
    if (customerId) {
      const session = await shopify.session.customAppSession(shop);
      const client = new shopify.clients.Graphql({ session });
      
      // Usar Admin API para obtener datos del customer por ID
      const response = await client.query({
        data: `{
          customer(id: "gid://shopify/Customer/${customerId}") {
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
        return res.status(404).json({ error: 'Customer not found' });
      }

      return res.status(200).json({ customer });
    }

    // Para apps embebidas con customer session token
    const customerSessionId = req.headers['x-shopify-customer-session-id'];
    
    if (!customerSessionId) {
      return res.status(401).json({ 
        error: 'No customer session. Make sure you are logged in.',
        debug: {
          hasCustomerId: !!customerId,
          hasSessionHeader: !!customerSessionId,
          shop
        }
      });
    }

    const session = await shopify.session.customAppSession(shop);
    const client = new shopify.clients.Graphql({ session });
    
    // Query customer information usando Storefront API
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
    res.status(500).json({ 
      error: 'Failed to verify customer session',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
