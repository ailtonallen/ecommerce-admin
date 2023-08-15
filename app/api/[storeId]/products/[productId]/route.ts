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
    
    const { 
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isFeatured,
      isArchived,
     } = body;
    
    if (!userId) {
      return new NextResponse("Não autenticado", { status: 403 });
    }

    if (!label) {
      return new NextResponse("Label é requirido", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("URL da imagem é requirido", { status: 400 });
    }

    if (!params.productId) {
      return new NextResponse("Billboard id é requirido", { status: 400 });
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

    const product = await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
      }
    });
  
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_PATCH]', error);
    return new NextResponse("Erro interno", { status: 500 });
  }
};
