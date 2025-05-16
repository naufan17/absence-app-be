import cors, { CorsOptions } from "cors";
import config from "./config";

const corsOptions: CorsOptions = {
  origin: config.CorsOrigin,
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
  allowedHeaders: ['Origin', 'Content-Type', 'Content-Length', 'Authorization'],
  credentials: true,
  maxAge: 86400
};

export default cors(corsOptions);