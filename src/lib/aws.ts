import AWS from 'aws-sdk';

/**
 * Configuração e validação de variáveis AWS
 * Valida variáveis obrigatórias antes de criar o client S3
 */

interface AwsConfig {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucket: string;
}

/**
 * Obtém e valida a configuração AWS do ambiente
 * @throws Error se alguma variável obrigatória não estiver configurada
 */
export function getAwsConfig(): AwsConfig {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION;
  const bucket = process.env.AWS_S3_BUCKET_PRODUCTS;

  if (!accessKeyId) {
    throw new Error(
      'AWS_ACCESS_KEY_ID não está configurado. Configure a variável de ambiente no arquivo .env'
    );
  }

  if (!secretAccessKey) {
    throw new Error(
      'AWS_SECRET_ACCESS_KEY não está configurado. Configure a variável de ambiente no arquivo .env'
    );
  }

  if (!region) {
    throw new Error(
      'AWS_REGION não está configurado. Configure a variável de ambiente no arquivo .env'
    );
  }

  if (!bucket) {
    throw new Error(
      'AWS_S3_BUCKET_PRODUCTS não está configurado. Configure a variável de ambiente no arquivo .env'
    );
  }

  return {
    accessKeyId,
    secretAccessKey,
    region,
    bucket,
  };
}

/**
 * Cria e retorna um client S3 configurado
 * Valida as variáveis de ambiente antes de criar o client
 * @throws Error se alguma variável obrigatória não estiver configurada
 */
export function createS3Client(): AWS.S3 {
  const config = getAwsConfig();

  return new AWS.S3({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    region: config.region,
  });
}

/**
 * Retorna o nome do bucket S3 configurado
 * @throws Error se AWS_S3_BUCKET_PRODUCTS não estiver configurado
 */
export function getS3Bucket(): string {
  const config = getAwsConfig();
  return config.bucket;
}
