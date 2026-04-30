import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { connectMongo } from "@/database/db";
import Category from "@/database/models/Category";
import Product from "@/database/models/Product";
import User from "@/database/models/User";
import AWS from "aws-sdk";
import { verifyToken } from "@/lib/auth";
import { objectIdSchema } from "@/lib/validators/product";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const confirmDeleteSchema = z.object({
  password: z.string().min(1, "Senha obrigatória"),
  confirmationPhrase: z.literal("EXCLUIR CATEGORIA"),
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Validar ObjectId
    const idResult = objectIdSchema.safeParse(id);
    if (!idResult.success) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }
    const validatedId = idResult.data;
    
    // Extrair userId do JWT
    const payload = await verifyToken(request);
    if (!payload || !payload.userId) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }
    const userId = payload.userId as string;
    
    // Validar body com Zod
    const body = await request.json();
    const bodyResult = confirmDeleteSchema.safeParse(body);
    if (!bodyResult.success) {
      return NextResponse.json(
        { error: "Dados inválidos" },
        { status: 400 }
      );
    }
    const { password } = bodyResult.data;
    
    await connectMongo();
    
    // Buscar usuário no banco
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "Confirmação inválida" },
        { status: 403 }
      );
    }
    
    // Validar senha com bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Confirmação inválida" },
        { status: 403 }
      );
    }
    
    // Buscar categoria
    const category = await Category.findById(validatedId);
    if (!category) {
      return NextResponse.json({ error: "Categoria não encontrada" }, { status: 404 });
    }

    const s3Errors: string[] = [];

    // 1. Deletar todos os produtos da categoria (pasta inteira no S3)
    try {
      const listParams = {
        Bucket: process.env.AWS_S3_BUCKET_PRODUCTS!,
        Prefix: `${category.name}/`,
      };

      const listedObjects = await s3.listObjectsV2(listParams).promise();

      if (listedObjects.Contents && listedObjects.Contents.length > 0) {
        const deleteParams = {
          Bucket: process.env.AWS_S3_BUCKET_PRODUCTS!,
          Delete: { Objects: listedObjects.Contents.map(({ Key }) => ({ Key: Key! })) },
        };

        await s3.deleteObjects(deleteParams).promise();
        console.log(`✓ Pasta de produtos deletada: ${category.name}/`);
      }
    } catch (error) {
      const errorMsg = `Erro ao deletar pasta de produtos: ${error}`;
      console.error(errorMsg);
      s3Errors.push(errorMsg);
    }

    // 2. Deletar imagem da categoria (em categories/)
    if (category.image) {
      try {
        const url = new URL(category.image);
        const key = decodeURIComponent(url.pathname.substring(1));
        
        if (key) {
          await s3.deleteObject({
            Bucket: process.env.AWS_S3_BUCKET_PRODUCTS!,
            Key: key,
          }).promise();
          
          console.log(`✓ Imagem da categoria deletada: ${key}`);
        }
      } catch (error) {
        const errorMsg = `Erro ao deletar imagem da categoria: ${error}`;
        console.error(errorMsg);
        s3Errors.push(errorMsg);
      }
    }
    
    // Se houver erros no S3, não deletar do banco
    if (s3Errors.length > 0) {
      console.error("Falha ao deletar arquivos do S3. Abortando delete da categoria.");
      return NextResponse.json({ 
        error: "Erro ao deletar arquivos do S3",
        details: s3Errors 
      }, { status: 500 });
    }

    // 3. Deletar produtos do banco
    await Product.deleteMany({ category: category.name });
    console.log(`✓ Produtos deletados do banco: categoria ${category.name}`);

    // 4. Deletar categoria do banco
    await Category.findByIdAndDelete(validatedId);
    console.log(`✓ Categoria deletada do banco: ${category.name} (ID: ${validatedId})`);
    
    // Revalidar home e página de produtos da categoria deletada
    revalidatePath("/");
    revalidatePath(`/products/${encodeURIComponent(category.name)}`);
    
    return NextResponse.json({ 
      success: true,
      message: "Categoria, produtos e arquivos deletados com sucesso"
    });
  } catch (error) {
    console.error("Erro ao deletar categoria:", error);
    return NextResponse.json({ error: "Erro ao deletar categoria" }, { status: 500 });
  }
}
