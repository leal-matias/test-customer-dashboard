import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Card, Page, Layout, BlockStack, Text, Box } from "@shopify/polaris";
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

  useEffect(() => {
    const { shop, host } = router.query;

    if (shop && host) {
      fetchCustomerData(shop as string);
    }
  }, [router.query]);

  const fetchCustomerData = async (shop: string) => {
    try {
      const response = await fetch(`/api/customer-session?shop=${shop}`);
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
        Loading customer dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "50px", textAlign: "center", color: "red" }}>
        Error: {error}
      </div>
    );
  }

  return (
    <Page title="My Customer Dashboard">
      <Layout>
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
                  Recent Activity
                </Text>
                <Text as="p">This is your customer-facing dashboard.</Text>
                <Text as="p">Future features could include:</Text>
                <ul>
                  <li>Order history</li>
                  <li>Subscription management</li>
                  <li>Account settings</li>
                  <li>Loyalty points</li>
                </ul>
              </BlockStack>
            </Box>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
