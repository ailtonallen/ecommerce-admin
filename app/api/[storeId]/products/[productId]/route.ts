import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("Id do produto", { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId
      },
        include:{
        images: true,
        category: true,
        sizes: true,
        colors:true,
      }
    });
  
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_GET]', error);
    return new NextResponse("Erro interno", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Não autenticado", { status: 403 });
    }

    if (!params.productId) {
      return new NextResponse("Id do produto", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Não autorizado", { status: 405 });
    }

    const product = await prismadb.product.delete({
      where: {
        id: params.productId,
      }
    });
  
    return NextResponse.json(product);
  } catch (error) {
    console.log('[BILLBOARD_DELETE]', error);
    return new NextResponse("Erro interno", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { productId: string, storeId: string } }
) {
  try {   
    const { userId } = auth();

    const body = await req.json();
    
    const {name,  price,  categoryId,  colorId,  sizeId,  images,      isFeatured,
      isArchived,
     } = body;
    
    if (!userId) {
      return new NextResponse("Não autenticado", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Nome do produto.", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Preço do produto.", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Categoria do produto.", { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse("Tamanho do produto.", { status: 400 });
    }

    if (!colorId) {
      return new NextResponse("Preço do produto.", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Foto do produto.", { status: 400 });
    }

    if (!params.productId) {
      return new NextResponse(" É necssario o Id do Produto", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Não autorizado", { status: 405 });
    }

   await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        images: {
          deleteMany:{}
        },
        isFeatured,
        isArchived
      }
    });
    const product = await prismadb.product.update({
      where: {
        id: params.productId
      },
      data: {
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string }) => image),
            ],
          },
        },
      },
    })
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_PATCH]', error);
    return new NextResponse("Erro interno", { status: 500 });
  }
};
