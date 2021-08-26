import { Client } from "@notionhq/client";
import express from "express";

const app = express();
app.use(express.json);

const notion = new Client({
  auth: process.env.NEXT_PUBLIC_NOTION_ACCESS_TOKEN,
});

export default notion;
