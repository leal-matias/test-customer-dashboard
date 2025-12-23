import { GetServerSideProps } from "next";
import Reactivate from "../src/Reactivate";

interface PageProps {
  shopifyParams: {
    shop?: string;
    logged_in_customer_id?: string;
  };
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  const { query } = context;

  return {
    props: {
      shopifyParams: {
        shop: (query.shop as string) || undefined,
        logged_in_customer_id:
          (query.logged_in_customer_id as string) || undefined,
      },
    },
  };
};

export default function ReactivatePage({ shopifyParams }: PageProps) {
  console.log("Shopify params:", shopifyParams);

  return <Reactivate />;
}

