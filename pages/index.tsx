import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Card, Page, Layout, BlockStack, Text, Box, Banner } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("");

  useEffect(() => {
    // Esperar a que el router esté listo
    if (!router.isReady) return;

    // Obtener parámetros - App Proxy pasa diferentes params
    const { 
      shop, 
      host, 
      logged_in_customer_id,
      signature,
      path_prefix,
      timestamp
    } = router.query;

    // Debug info
    setDebugInfo(JSON.stringify({
      shop,
      host,
      logged_in_customer_id,
      hasSignature: !!signature,
      path_prefix,
      timestamp,
      fullQuery: router.query
    }, null, 2));

    // Para App Proxy, usar logged_in_customer_id
    if (logged_in_customer_id && shop) {
      fetchCustomerData(shop as string, logged_in_customer_id as string);
    } 
    // Para apps embebidas en admin, usar shop y host
    else if (shop && host) {
      fetchCustomerData(shop as string);
    } 
    // Sin parámetros válidos
    else {
      setLoading(false);
      setError("No se detectaron parámetros de Shopify. Asegúrate de acceder desde tu tienda Shopify.");
    }
  }, [router.isReady, router.query]);

  const fetchCustomerData = async (shop: string, customerId?: string) => {
    try {
      let url = `/api/customer-session?shop=${shop}`;
      if (customerId) {
        url += `&customer_id=${customerId}`;
      }
      
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
                  Debug Info
                </Text>
                <pre style={{ 
                  fontSize: "10px", 
                  background: "#f4f4f4", 
                  padding: "10px",
                  overflow: "auto",
                  maxHeight: "200px"
                }}>
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
