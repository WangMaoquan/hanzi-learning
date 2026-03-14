#!/usr/bin/env node
import fs from "fs/promises";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 导入汉字数据
async function importCharacters() {
  try {
    console.log("导入汉字数据...");

    const wordData = await fs.readFile(
      path.join(process.cwd(), "data/chinese-xinhua/data/word.json"),
      "utf-8",
    );
    const words = JSON.parse(wordData);

    let count = 0;
    for (const word of words) {
      try {
        await prisma.character.create({
          data: {
            word: word.word,
            pinyin: word.pinyin,
            radical: word.radicals,
            strokes: word.strokes ? parseInt(word.strokes) : null,
            structure: word.structure,
            explanation: word.explanation,
            words: word.words || [],
          },
        });
        count++;
        if (count % 100 === 0) {
          console.log(`已导入 ${count} 个汉字...`);
        }
      } catch (err) {
        if (err.code !== "P2002") {
          console.error("导入汉字出错:", word.word, err.message);
        }
      }
    }
    console.log(`汉字数据导入完成，共导入 ${count} 个`);
  } catch (err) {
    console.error("导入汉字数据失败:", err.message);
  }
}

// 导入成语数据
async function importIdioms() {
  try {
    console.log("导入成语数据...");

    const idiomData = await fs.readFile(
      path.join(process.cwd(), "data/chinese-xinhua/data/idiom.json"),
      "utf-8",
    );
    const idioms = JSON.parse(idiomData);

    let count = 0;
    for (const idiom of idioms) {
      try {
        await prisma.idiom.create({
          data: {
            word: idiom.word,
            pinyin: idiom.pinyin,
            derivation: idiom.derivation,
            explanation: idiom.explanation,
            example: idiom.example,
            synonyms: idiom.synonyms || [],
            antonyms: idiom.antonyms || [],
          },
        });
        count++;
        if (count % 100 === 0) {
          console.log(`已导入 ${count} 个成语...`);
        }
      } catch (err) {
        if (err.code !== "P2002") {
          console.error("导入成语出错:", idiom.word, err.message);
        }
      }
    }
    console.log(`成语数据导入完成，共导入 ${count} 个`);
  } catch (err) {
    console.error("导入成语数据失败:", err.message);
  }
}

// 导入古诗数据
async function importPoems() {
  try {
    console.log("导入古诗数据...");

    let count = 0;

    const poetryDir = path.join(process.cwd(), "data/chinese-poetry/json");
    const files = await fs.readdir(poetryDir);

    for (const file of files) {
      if (!file.endsWith(".json")) continue;

      const content = await fs.readFile(path.join(poetryDir, file), "utf-8");
      const poems = JSON.parse(content);

      for (const poem of poems) {
        try {
          let dynasty = "";
          if (file.includes("tang")) dynasty = "唐";
          else if (file.includes("song")) dynasty = "宋";
          else if (file.includes("yuan")) dynasty = "元";
          else if (file.includes("ming")) dynasty = "明";
          else if (file.includes("qing")) dynasty = "清";

          await prisma.poem.create({
            data: {
              title: poem.title,
              author: poem.author,
              content: poem.paragraphs || [],
              dynasty: dynasty,
              type: poem.type || "",
            },
          });
          count++;
        } catch (err) {
          if (err.code !== "P2002") {
            console.error("导入古诗出错:", poem.title, err.message);
          }
        }
      }
    }

    console.log(`古诗数据导入完成，共导入 ${count} 首`);
  } catch (err) {
    console.error("导入古诗数据失败:", err.message);
  }
}

async function main() {
  try {
    console.log("开始导入数据...");

    await importCharacters();
    await importIdioms();
    await importPoems();

    console.log("数据导入完成！");
  } catch (err) {
    console.error("导入过程出错:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
