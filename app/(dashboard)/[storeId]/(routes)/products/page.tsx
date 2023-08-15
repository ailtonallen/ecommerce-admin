import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { ProductColumn } from "./components/columns"
import { ProductClient } from "./components/client";
import { formatter } from "@/lib/utils";


const ProductsPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId
    },
    include:{
      category: true,
      sizes: true,
      colors: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price.toNumber()),
    category: item.category.name,
    sizes:  item.sizes.name,
    colors: item.colors.value,
    createdAt: format(item.createdAt, 'dd MMMM, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
