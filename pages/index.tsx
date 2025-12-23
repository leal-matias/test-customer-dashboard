import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Card, Page, Layout, TextContainer, Text } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";

export default function Dashboard() {
  const router = useRouter();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          <Card sectioned>
            <TextContainer>
              <Text variant="headingLg" as="h2">
                Welcome to Your Dashboard
              </Text>
              {customer ? (
                <div>
                  <p>
                    <strong>Name:</strong> {customer.firstName}{" "}
                    {customer.lastName}
                  </p>
                  <p>
                    <strong>Email:</strong> {customer.email}
                  </p>
                  <p>
                    <strong>Customer ID:</strong> {customer.id}
                  </p>
                </div>
              ) : (
                <p>
                  No customer data available. Please ensure you're logged into
                  your Shopify account.
                </p>
              )}
            </TextContainer>
          </Card>
        </Layout.Section>

        <Layout.Section secondary>
          <Card sectioned title="Recent Activity">
            <p>This is your customer-facing dashboard.</p>
            <p>Future features could include:</p>
            <ul>
              <li>Order history</li>
              <li>Subscription management</li>
              <li>Account settings</li>
              <li>Loyalty points</li>
            </ul>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
