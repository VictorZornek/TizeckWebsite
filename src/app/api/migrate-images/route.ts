import { NextResponse } from "next/server";
import { connectMongo } from "@/database/db";
import Products from "@/database/models/Product";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export async function POST() {
  try {
    await connectMongo();
    const products = await Products.find({});

    const results = [];

    for (const product of products) {
      const newImages: string[] = [];

      for (const imageUrl of product.images) {
        try {
          const url = new URL(imageUrl);
          const oldKey = decodeURIComponent(url.pathname.substring(1));

          if (oldKey.includes('/')) {
            newImages.push(imageUrl);
            continue;
          }

          const newKey = `${product.category}/${product._id}/${oldKey}`;

          await s3.copyObject({
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            CopySource: `${process.env.AWS_S3_BUCKET_NAME}/${oldKey}`,
            Key: newKey,
          }).promise();

          await s3.deleteObject({
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: oldKey,
          }).promise();

          const newUrl = imageUrl.replace(oldKey, newKey);
          newImages.push(newUrl);
        } catch (error) {
          console.error(`Erro ao migrar imagem ${imageUrl}:`, error);
          newImages.push(imageUrl);
        }
      }

      await Products.findByIdAndUpdate(product._id, { images: newImages });

      results.push({
        productId: product._id,
        productName: product.name,
        migratedImages: newImages.length,
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Migração concluída",
      results 
    });
  } catch (error) {
    console.error("Erro na migração:", error);
    return NextResponse.json({ error: "Erro na migração" }, { status: 500 });
  }
}
