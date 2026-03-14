#!/usr/bin/env node
import fs from "fs/promises";
import path from "path";
import { PrismaClient } from "@prisma/client";
import {
  toSimplified,
  estimateDifficulty,
  getPinyin,
  getVersePinyins,
  generateTags,
} from "./utils";

const prisma = new PrismaClient();

// 分类配置
const CATEGORIES = [
  { name: "全唐诗", dynasty: "唐", dynastyEn: "tang", prefix: "poet.tang" },
  {
    name: "全唐诗",
    dynasty: "宋",
    dynastyEn: "song-poetry",
    prefix: "poet.song",
  }, // 宋诗
  { name: "宋词", dynasty: "宋", dynastyEn: "song", prefix: "ci.song" },
  { name: "元曲", dynasty: "元", dynastyEn: "yuan", prefix: "yuanqu" },
  { name: "诗经", dynasty: "先秦", dynastyEn: "xianqin", prefix: "shijing" },
  { name: "楚辞", dynasty: "先秦", dynastyEn: "xianqin", prefix: "chuci" },
  { name: "论语", dynasty: "先秦", dynastyEn: "xianqin", prefix: "lunyu" },
];

// 获取目录下的数据文件
async function getDataFiles(
  categoryDir: string,
  prefix: string,
): Promise<string[]> {
  const files = await fs.readdir(categoryDir);
  // 精确匹配前缀
  console.log(`  前缀: ${prefix}, 检查目录: ${categoryDir}`);
  console.log(`  目录中的部分文件: ${files.slice(0, 10).join(", ")}`);
  const matched = files.filter(
    (f) => f === prefix + ".json" || f.startsWith(prefix + "."),
  );
  console.log(`  匹配到的文件数量: ${matched.length}`);
  return matched;
}

// 统计数据文件中的条目数量
async function countDataItems(
  categoryDir: string,
  files: string[],
): Promise<number> {
  let total = 0;
  for (const file of files) {
    try {
      const content = await fs.readFile(path.join(categoryDir, file), "utf-8");
      const data = JSON.parse(content);
      total += Array.isArray(data) ? data.length : 1;
    } catch (err) {
      console.error(`读取文件失败: ${file}`, err);
    }
  }
  return total;
}

// 检查数据库中已有数量
async function getDbCount(dynastyEn: string): Promise<number> {
  return prisma.poem.count({ where: { dynasty: dynastyEn } });
}

// 清空指定分类的数据
async function clearCategory(dynastyEn: string): Promise<void> {
  await prisma.poem.deleteMany({ where: { dynasty: dynastyEn } });
}

// 处理单首古诗
function processPoem(
  poem: {
    author?: string;
    paragraphs?: string[];
    title?: string;
    rhythmic?: string;
    content?: string[]; // 诗经、楚辞使用 content
    chapter?: string; // 诗经
    section?: string; // 诗经、楚辞
  },
  dynasty: string,
  dynastyEn: string,
) {
  try {
    const title = toSimplified(poem.title || "");
    const author = toSimplified(poem.author || "");
    // 诗经、楚辞使用 content 字段，其他使用 paragraphs
    const paragraphs = (poem.paragraphs || poem.content || []).map((p) =>
      toSimplified(p),
    );

    if (paragraphs.length === 0) {
      return null;
    }

    const contentStr = paragraphs.join("\n");
    const type = poem.rhythmic ? toSimplified(poem.rhythmic) : null;
    // 诗经有 chapter/section
    const chapter = poem.chapter ? toSimplified(poem.chapter) : null;
    const section = poem.section ? toSimplified(poem.section) : null;
    const finalTitle = type ? `${type}·${title}` : title;

    const pinyinStr = getPinyin(paragraphs.join(" "));
    const versePinyins = paragraphs.map((p) => getVersePinyins(p));
    const difficulty = estimateDifficulty(paragraphs);
    const tags = generateTags(dynasty, author);

    return {
      title: finalTitle,
      author: author,
      content: contentStr,
      pinyin: pinyinStr,
      difficulty: difficulty,
      tags: tags,
      dynasty: dynastyEn,
      type: type || section || chapter, // 诗经用 section 作为 type
      verses: paragraphs,
      versePinyins: versePinyins,
    };
  } catch (err) {
    return null;
  }
}

// 批量插入
async function batchInsert(poems: any[], batchSize = 500) {
  for (let i = 0; i < poems.length; i += batchSize) {
    const batch = poems.slice(i, i + batchSize);
    try {
      await prisma.poem.createMany({ data: batch, skipDuplicates: true });
    } catch (err) {
      // 逐条插入作为后备
      for (const poem of batch) {
        try {
          await prisma.poem.create({ data: poem });
        } catch {
          // 忽略重复错误
        }
      }
    }
  }
}

// 导入单个分类
async function importCategory(category: (typeof CATEGORIES)[0]) {
  // 数据在 apps/server/data/ 目录下
  const serverDir = path.join(__dirname, "..");
  const categoryDir = path.join(
    serverDir,
    "data/chinese-poetry",
    category.name,
  );

  // 检查目录是否存在
  try {
    await fs.access(categoryDir);
  } catch {
    console.log(`  目录不存在: ${category.name}, 跳过`);
    return;
  }

  // 获取数据文件
  const files = await getDataFiles(categoryDir, category.prefix);
  if (files.length === 0) {
    console.log(`  没有找到数据文件: ${category.name}, 跳过`);
    return;
  }

  // 统计数据条目数量
  const dataCount = await countDataItems(categoryDir, files);
  console.log(`  数据源数量: ${dataCount}`);

  // 检查数据库已有数量
  const dbCount = await getDbCount(category.dynastyEn);
  console.log(`  数据库已有: ${dbCount}`);

  // 如果数量一致，跳过
  if (dbCount === dataCount) {
    console.log(`  数量一致，跳过导入`);
    return;
  }

  // 数量不一致，清空并重新导入
  console.log(`  开始处理...`);
  await clearCategory(category.dynastyEn);

  // 先收集所有处理后的数据
  const allPoems: any[] = [];
  for (const file of files) {
    try {
      const content = await fs.readFile(path.join(categoryDir, file), "utf-8");
      const poems = JSON.parse(content);

      // 统一处理：无论单个对象还是数组都转为数组
      const poemArray = Array.isArray(poems) ? poems : [poems];

      for (const poem of poemArray) {
        const processedPoem = processPoem(
          poem,
          category.dynasty,
          category.dynastyEn,
        );
        if (processedPoem) {
          allPoems.push(processedPoem);
        }
      }
      console.log(`  处理文件: ${file} (累计 ${allPoems.length})`);
    } catch (err) {
      console.error(`  读取文件失败: ${file}`, err);
    }
  }

  console.log(`  共处理 ${allPoems.length} 首，开始批量插入...`);

  // 批量插入
  await batchInsert(allPoems, 500);

  console.log(`  ${category.name} 导入完成: ${allPoems.length} 首`);
}

// 主函数
async function main() {
  try {
    console.log("开始导入古诗数据...\n");

    for (const category of CATEGORIES) {
      console.log(`\n处理分类: ${category.name}`);
      await importCategory(category);
    }

    console.log("\n=== 导入完成 ===");

    // 输出统计
    const total = await prisma.poem.count();
    console.log(`总计: ${total} 首`);

    const byDynasty = await prisma.poem.groupBy({
      by: ["dynasty"],
      _count: true,
    });
    byDynasty.forEach((d) => {
      console.log(`  ${d.dynasty}: ${d._count}`);
    });
  } catch (err) {
    console.error("导入过程出错:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
