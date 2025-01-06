import express from "express";
import cors from "cors";
import axios from "axios";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Corrigir caminhos no ESM (Node.js não suporta `__dirname` diretamente)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregar OpenAPI JSON
const openapiPath = path.join(__dirname, "openapi.json");
const openapiSpec = JSON.parse(fs.readFileSync(openapiPath, "utf-8"));

// Configurar Express
const app = express();
app.use(cors());
app.use(express.json());

// Definir a URL da API real do Keitaro
const KEITARO_API_BASE_URL = "https://go.betvera.info";

// Servir Swagger UI para visualizar as rotas
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

// Middleware Global: Redirecionar Todas as Requisições para a API do Keitaro
app.use(async (req, res, next) => {
  try {
    // Obter o caminho e método da requisição
    const routePath = req.path;
    const method = req.method.toLowerCase();

    // Verificar se a rota existe no OpenAPI
    // if (
    //   !openapiSpec.paths[routePath] ||
    //   !openapiSpec.paths[routePath][method]
    // ) {
    //   return res.status(404).json({ error: "Rota não encontrada no OpenAPI" });
    // }

    // Construir a URL para a API do Keitaro

    const keitaroUrl = `${KEITARO_API_BASE_URL}${routePath}`;

    // console.log("teste =>", keitaroUrl)
    // Enviar requisição para a API real do Keitaro
    const keitaroResponse = await axios(keitaroUrl, {
      method: req.method,
      data: req.body,
      headers: {
        ...req.headers,
        host: undefined,
        "Api-Key": "fd54c3e353c0a26e767217829b0121d2",
      }, // Remove host para evitar conflitos
    });

    // Retornar resposta da API do Keitaro
    return res.status(keitaroResponse.status).json(keitaroResponse.data);
  } catch (error) {
    console.error(error)
    console.error("❌ Erro ao redirecionar requisição:", error.message);
    return res
      .status(500)
      .json({ error: "Erro ao conectar com a API do Keitaro" });
  }
});

// ✅ Iniciar servidor
const PORT = 3333;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📚 Swagger docs at http://localhost:${PORT}/docs`);
  // console.log(openapiSpec);
});
