import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

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

// Función para obtener variables de entorno (con fallback a archivo)
function getEnvVar(name: string): string | undefined {
  // Primero intentar desde process.env
  if (process.env[name]) {
    return process.env[name];
  }
  
  // Fallback: intentar leer desde archivo .env.production
  try {
    const envPaths = [
      path.join(process.cwd(), '.env.production'),
      path.join(process.cwd(), '.next', '.env.production'),
      '/var/task/.env.production',
      '/var/task/.next/.env.production',
    ];
    
    for (const envPath of envPaths) {
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf-8');
        const match = content.match(new RegExp(`^${name}=(.*)$`, 'm'));
        if (match) {
          return match[1];
        }
      }
    }
  } catch (e) {
    console.error('Error reading env file:', e);
  }
  
  return undefined;
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

    // Obtener variables de entorno
    const accessToken = getEnvVar('SHOPIFY_ACCESS_TOKEN');
    const apiKey = getEnvVar('SHOPIFY_API_KEY');
    const apiSecret = getEnvVar('SHOPIFY_API_SECRET');

    // Debug: verificar variables de entorno
    const envCheck = {
      hasApiKey: !!apiKey,
      hasApiSecret: !!apiSecret,
      hasAccessToken: !!accessToken,
      accessTokenPreview: accessToken ? `${accessToken.substring(0, 10)}...` : 'MISSING',
      shop,
      customerId,
      cwd: process.cwd(),
    };
    console.log("Environment check:", envCheck);

    if (!shop) {
      return res.status(400).json({ error: 'Missing shop parameter', envCheck });
    }

    if (!customerId) {
      return res.status(400).json({ error: 'Missing customer_id parameter', envCheck });
    }

    // Verificar que tenemos el access token
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
