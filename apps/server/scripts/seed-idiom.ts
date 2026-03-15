#!/usr/bin/env node
import fs from "fs/promises";
import path from "path";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 原始成语数据类型
interface RawIdiom {
  word: string;
  pinyin?: string;
  derivation?: string;
  explanation?: string;
  example?: string;
  abbreviation?: string;
  synonyms?: string[];
  antonyms?: string[];
}

// 处理单个成语
function processIdiom(idiom: RawIdiom) {
  try {
    const word = idiom.word?.trim();
    if (!word) {
      return null;
    }

    // 处理拼音
    const pinyin = idiom.pinyin?.trim() || null;

    // 处理出处
    const derivation = idiom.derivation?.trim() || null;

    // 处理释义
    const explanation = idiom.explanation?.trim() || null;

    // 处理例句
    let example = null;
    if (idiom.example && idiom.example !== "无") {
      example = idiom.example.replace(/★.*$/, "").trim();
    }

    // 处理近义词和反义词（数据中可能没有，需要预留字段）
    const synonyms: string[] = [];
    const antonyms: string[] = [];

    return {
      word,
      pinyin,
      derivation,
      explanation,
      example,
      synonyms,
      antonyms,
    };
  } catch (err) {
    console.error(`处理成语失败: ${idiom.word}`, err);
    return null;
  }
}

// 批量插入
async function batchInsert(
  idioms: Prisma.IdiomCreateInput[],
  batchSize = 500,
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (let i = 0; i < idioms.length; i += batchSize) {
    const batch = idioms.slice(i, i + batchSize);
    try {
      const result = await prisma.idiom.createMany({
        data: batch,
        skipDuplicates: true,
      });
      success += result.count;
      if (i % 5000 === 0) {
        console.log(`  已处理 ${i}/${idioms.length}`);
      }
    } catch (err) {
      console.error(`批量插入失败，尝试逐条插入:`, err);
      for (const idiom of batch) {
        try {
          await prisma.idiom.create({ data: idiom });
          success++;
        } catch (insertErr) {
          if (
            !(insertErr instanceof Prisma.PrismaClientKnownRequestError) ||
            insertErr.code !== "P2002"
          ) {
            console.error(`插入失败 [${idiom.word}]:`, insertErr);
          }
          failed++;
        }
      }
    }
  }

  return { success, failed };
}

// 主函数
async function main() {
  try {
    console.log("开始导入成语数据...\n");

    // 数据文件路径
    const dataFile = path.join(
      __dirname,
      "..",
      "data/chinese-xinhua/data/idiom.json",
    );

    // 检查文件是否存在
    try {
      await fs.access(dataFile);
    } catch {
      console.error(`数据文件不存在: ${dataFile}`);
      process.exit(1);
    }

    // 读取数据
    console.log("读取数据文件...");
    const content = await fs.readFile(dataFile, "utf-8");
    const rawData: RawIdiom[] = JSON.parse(content);
    console.log(`共 ${rawData.length} 条记录`);

    // 检查已有数量
    const existingCount = await prisma.idiom.count();
    console.log(`数据库已有: ${existingCount}`);

    if (existingCount > 0) {
      console.log("数据库已有成语数据，跳过导入");
      return;
    }

    // 处理数据
    console.log("处理数据...");
    const idioms: Prisma.IdiomCreateInput[] = [];
    for (const idiom of rawData) {
      const processed = processIdiom(idiom);
      if (processed) {
        idioms.push(processed);
      }
    }
    console.log(`有效成语: ${idioms.length}`);

    // 批量插入
    console.log("开始插入数据库...");
    const result = await batchInsert(idioms);

    console.log(`\n导入完成: 成功 ${result.success}, 失败 ${result.failed}`);

    // 输出统计
    const total = await prisma.idiom.count();
    console.log(`总计: ${total} 个成语`);
  } catch (err) {
    console.error("导入过程出错:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
