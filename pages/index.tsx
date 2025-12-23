import { useEffect } from "react";
import { GetServerSideProps } from "next";
import SuscripcionActiva from "../src/SuscripcionActiva";
import DebugStatusBubble from "../src/components/DebugStatusBubble";
import { useSubscriptionStore } from "../src/store/subscriptionStore";

interface PageProps {
  shopifyParams: {
    shop?: string;
    logged_in_customer_id?: string;
    signature?: string;
    timestamp?: string;
    path_prefix?: string;
  };
  customerData?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  } | null;
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  const { query } = context;
  const customerId = query.logged_in_customer_id as string | undefined;
  const shop = query.shop as string | undefined;

  let customerData = null;

  // If we have customer ID and shop, fetch customer data
  if (customerId && shop) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';
      const response = await fetch(
        `${baseUrl}/api/customer-session?shop=${shop}&customer_id=${customerId}`
      );
      
      if (response.ok) {
        const data = await response.json();
        customerData = data.customer;
      }
    } catch (error) {
      console.error('Error fetching customer data:', error);
    }
  }

  return {
    props: {
      shopifyParams: {
        shop: shop || undefined,
        logged_in_customer_id: customerId || undefined,
        signature: (query.signature as string) || undefined,
        timestamp: (query.timestamp as string) || undefined,
        path_prefix: (query.path_prefix as string) || undefined,
      },
      customerData,
    },
  };
};

export default function Dashboard({ shopifyParams, customerData }: PageProps) {
  const { setCustomerEmail, setCustomerId } = useSubscriptionStore();

  useEffect(() => {
    // Initialize store with Shopify customer data
    if (customerData?.email) {
      setCustomerEmail(customerData.email);
    }
    if (shopifyParams.logged_in_customer_id) {
      setCustomerId(shopifyParams.logged_in_customer_id);
    }

    console.log("Shopify params:", shopifyParams);
    console.log("Customer data:", customerData);
  }, [shopifyParams, customerData, setCustomerEmail, setCustomerId]);

  return (
    <>
      <SuscripcionActiva />
      <DebugStatusBubble />
    </>
  );
}
