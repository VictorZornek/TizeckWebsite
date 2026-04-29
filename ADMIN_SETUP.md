# Sistema CRUD - Painel Administrativo

## Configuração Inicial

### 1. Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure as variáveis:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
MONGODB_URI=sua_string_de_conexao_mongodb
JWT_SECRET=sua_chave_secreta_jwt_aqui
AWS_ACCESS_KEY_ID=sua_aws_access_key
AWS_SECRET_ACCESS_KEY=sua_aws_secret_key
AWS_REGION=sa-east-1
AWS_S3_BUCKET_PRODUCTS=seu_bucket_s3
```

**⚠️ Segurança:**
- **NUNCA** commite o arquivo `.env` no Git
- Se credenciais forem expostas acidentalmente, rotacione-as imediatamente
- Use `.env.example` apenas como template, sem valores reais

### 2. Criar Usuário Admin

O usuário administrador deve ser criado manualmente no banco de dados MongoDB.
Certifique-se de usar bcrypt para hash da senha.

## Acesso ao Painel

1. Inicie o servidor: `npm run dev`
2. Acesse: `http://localhost:3000/admin/login`
3. Use as credenciais do usuário admin criado

## Funcionalidades

### Dashboard Principal
- `/admin/dashboard` - Página inicial do painel

### Gerenciamento de Categorias
- `/admin/categories` - CRUD completo de categorias
- Criar, editar, deletar categorias
- Upload de imagens para S3

### Gerenciamento de Produtos
- `/admin/products` - CRUD completo de produtos
- Criar, editar, deletar produtos
- Upload múltiplo de imagens para S3
- Especificações em formato JSON
- Vinculação com categorias

## Segurança

- Autenticação JWT com cookies httpOnly
- Middleware de proteção nas rotas `/admin/*`
- Senhas criptografadas com bcrypt
- Redirecionamento automático para login se não autenticado
- Validação de inputs com Zod
- Rate limiting no login
- Security headers configurados
- Validação de Origin para métodos mutantes

## Upload de Imagens

As imagens são enviadas automaticamente para o S3 configurado. Certifique-se de:
1. Ter um bucket S3 criado
2. Configurar as credenciais AWS corretas
3. Definir as permissões adequadas no bucket

## Estrutura de Dados

### Categoria
```json
{
  "name": "Nome da categoria",
  "description": "Descrição da categoria",
  "image": "URL da imagem",
  "activated": true
}
```

### Produto
```json
{
  "name": "Nome do produto",
  "description": "Descrição do produto",
  "category": "Nome da categoria",
  "images": ["url1", "url2"],
  "specifications": {
    "peso": "1kg",
    "dimensoes": "10x10x10cm"
  },
  "activated": true
}
```

## Próximos Passos

1. Configure suas credenciais no `.env` (use `.env.example` como base)
2. Crie o usuário admin no banco de dados
3. Comece a cadastrar suas categorias
4. Adicione seus produtos

O sistema está pronto para uso!