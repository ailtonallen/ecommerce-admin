import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';
 
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
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
      return new NextResponse("Tamanh do produto.", { status: 400 });
    }

    if (!colorId) {
      return new NextResponse("Preço do produto.", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Foto do produto.", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Id da loja.", { status: 400 });
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

    const billboard = await prismadb.product.create({
      data: {
        name,
        price,
        isFeatured,
        isArchived,
        categoryId,
        sizeId,
        colorId,
        images:{
          createMany:{
            data: [
              ...images.map((image: {url: string })=> image)
            ]
          }
        },
        storeId: params.storeId,
      }
    });
  
    return NextResponse.json(billboard);
  } catch (error) {
    console.log('[PRODUCTS_POST]', error);
    return new NextResponse("Erro interno", { status: 500 });
  }
};

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {

    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get("categoryId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const isArchived = searchParams.get("isArchived") || undefined;
    const isFeatured = searchParams.get("isFeatured") || undefined;
    if (!params.storeId) {
      return new NextResponse("Necessario Id da loja", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        sizeId,
        colorId,
        isFeatured: isFeatured ? true : undefined,
        isArchived:false
      },
      include: {
        images: true,
        colors: true,
        sizes: true,
        category: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  
    return NextResponse.json(products);
  } catch (error) {
    console.log('[PRODUCTS_GET]', error);
    return new NextResponse("Erro interno", { status: 500 });
  }
};
