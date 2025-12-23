import { GetServerSideProps } from "next";
import SuscripcionActiva from "../src/SuscripcionActiva";
import DebugStatusBubble from "../src/components/DebugStatusBubble";

interface PageProps {
  shopifyParams: {
    shop?: string;
    logged_in_customer_id?: string;
    signature?: string;
    timestamp?: string;
    path_prefix?: string;
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
        signature: (query.signature as string) || undefined,
        timestamp: (query.timestamp as string) || undefined,
        path_prefix: (query.path_prefix as string) || undefined,
      },
    },
  };
};

export default function Dashboard({ shopifyParams }: PageProps) {
  // Podemos usar shopifyParams para obtener datos del customer si es necesario
  console.log("Shopify params:", shopifyParams);

  return (
    <>
      <SuscripcionActiva />
      <DebugStatusBubble />
    </>
  );
}
