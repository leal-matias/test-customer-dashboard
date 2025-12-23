import { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import {
  Card,
  Page,
  Layout,
  BlockStack,
  Text,
  Box,
  Banner,
} from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface PageProps {
  shopifyParams: {
    shop?: string;
    logged_in_customer_id?: string;
    signature?: string;
    timestamp?: string;
    path_prefix?: string;
    host?: string;
    embedded?: string;
  };
  allParams: Record<string, string | string[] | undefined>;
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  const { query } = context;

  // Log en el servidor para debug
  console.log("=== SERVER SIDE PARAMS ===");
  console.log("All query params:", query);
  console.log("==========================");

  return {
    props: {
      shopifyParams: {
        shop: (query.shop as string) || undefined,
        logged_in_customer_id:
          (query.logged_in_customer_id as string) || undefined,
        signature: (query.signature as string) || undefined,
        timestamp: (query.timestamp as string) || undefined,
        path_prefix: (query.path_prefix as string) || undefined,
        host: (query.host as string) || undefined,
        embedded: (query.embedded as string) || undefined,
      },
      allParams: query as Record<string, string | string[] | undefined>,
    },
  };
};

export default function Dashboard({ shopifyParams, allParams }: PageProps) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debugInfo = JSON.stringify(
    {
      shopifyParams,
      allParams,
    },
    null,
    2
  );

  useEffect(() => {
    const { shop, logged_in_customer_id, host } = shopifyParams;

    console.log("=== CLIENT DEBUG ===");
    console.log("shopifyParams:", shopifyParams);
    console.log("allParams:", allParams);
    console.log("====================");

    // Para App Proxy, usar logged_in_customer_id
    if (logged_in_customer_id && shop) {
      fetchCustomerData(shop, logged_in_customer_id);
    }
    // Para apps embebidas en admin, usar shop y host
    else if (shop && host) {
      fetchCustomerData(shop);
    }
    // Sin parámetros válidos
    else {
      setLoading(false);
      if (!shop) {
        setError(
          "No se detectó el parámetro 'shop'. Asegúrate de acceder desde tu tienda Shopify."
        );
      } else {
        setError(
          "No se detectó sesión de customer. Asegúrate de estar logueado en la tienda."
        );
      }
    }
  }, [shopifyParams]);

  const fetchCustomerData = async (shop: string, customerId?: string) => {
    try {
      // Usar URL absoluta de Amplify para evitar que vaya al dominio de Shopify
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
      let url = `${baseUrl}/api/customer-session?shop=${shop}`;
      if (customerId) {
        url += `&customer_id=${customerId}`;
      }

      console.log("Fetching from:", url);
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setCustomer(data.customer);
      } else {
        setError(data.error || "Failed to load customer data");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <p>Loading customer dashboard...</p>
        <pre
          style={{
            fontSize: "10px",
            textAlign: "left",
            maxWidth: "600px",
            margin: "20px auto",
          }}
        >
          {debugInfo}
        </pre>
      </div>
    );
  }

  return (
    <Page title="My Customer Dashboard">
      <Layout>
        {error && (
          <Layout.Section>
            <Banner tone="warning">
              <p>{error}</p>
            </Banner>
          </Layout.Section>
        )}

        <Layout.Section>
          <Card>
            <Box padding="400">
              <BlockStack gap="400">
                <Text variant="headingLg" as="h2">
                  Welcome to Your Dashboard
                </Text>
                {customer ? (
                  <BlockStack gap="200">
                    <Text as="p">
                      <strong>Name:</strong> {customer.firstName}{" "}
                      {customer.lastName}
                    </Text>
                    <Text as="p">
                      <strong>Email:</strong> {customer.email}
                    </Text>
                    <Text as="p">
                      <strong>Customer ID:</strong> {customer.id}
                    </Text>
                  </BlockStack>
                ) : (
                  <Text as="p">
                    No customer data available. Please ensure you&apos;re logged
                    into your Shopify account.
                  </Text>
                )}
              </BlockStack>
            </Box>
          </Card>
        </Layout.Section>

        <Layout.Section variant="oneThird">
          <Card>
            <Box padding="400">
              <BlockStack gap="400">
                <Text variant="headingMd" as="h3">
                  Debug Info (Server Params)
                </Text>
                <pre
                  style={{
                    fontSize: "10px",
                    background: "#f4f4f4",
                    padding: "10px",
                    overflow: "auto",
                    maxHeight: "300px",
                  }}
                >
                  {debugInfo}
                </pre>
              </BlockStack>
            </Box>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
