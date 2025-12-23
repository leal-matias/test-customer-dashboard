import { NextApiRequest, NextApiResponse } from 'next';

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
  errors?: Array<{ message: string }>;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Agregar CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const shop = req.query.shop as string;
    const customerId = req.query.customer_id as string;

    // Debug: verificar variables de entorno
    const envCheck = {
      hasApiKey: !!process.env.SHOPIFY_API_KEY,
      hasApiSecret: !!process.env.SHOPIFY_API_SECRET,
      hasAccessToken: !!process.env.SHOPIFY_ACCESS_TOKEN,
      shop,
      customerId,
    };
    console.log("Environment check:", envCheck);

    if (!shop) {
      return res.status(400).json({ error: 'Missing shop parameter', envCheck });
    }

    if (!customerId) {
      return res.status(400).json({ error: 'Missing customer_id parameter', envCheck });
    }

    // Verificar que tenemos el access token
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
    if (!accessToken) {
      return res.status(500).json({ 
        error: 'Missing SHOPIFY_ACCESS_TOKEN environment variable',
        envCheck
      });
    }

    // Usar fetch directo a la Admin API de Shopify
    const graphqlEndpoint = `https://${shop}/admin/api/2024-01/graphql.json`;
    
    const query = `{
      customer(id: "gid://shopify/Customer/${customerId}") {
        id
        firstName
        lastName
        email
        phone
      }
    }`;

    console.log("Making request to:", graphqlEndpoint);
    
    const response = await fetch(graphqlEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
      body: JSON.stringify({ query }),
    });

    const data: CustomerQueryResponse = await response.json();
    
    console.log("Shopify response:", JSON.stringify(data, null, 2));

    if (data.errors) {
      return res.status(400).json({ 
        error: 'GraphQL errors', 
        details: data.errors 
      });
    }

    const customer = data?.data?.customer;
    
    if (!customer) {
      return res.status(404).json({ 
        error: 'Customer not found',
        customerId,
        response: data
      });
    }

    return res.status(200).json({ customer });

  } catch (error) {
    console.error('Customer session error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch customer data',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}
