#!/usr/bin/env node
import fs from "fs/promises";
import path from "path";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 原始汉字数据类型
interface RawCharacter {
  word: string;
  oldword?: string;
  strokes?: string;
  pinyin?: string;
  radicals?: string;
  explanation?: string;
  more?: string;
}

// 按汉字分组数据
function groupByWord(data: RawCharacter[]): Map<string, RawCharacter[]> {
  const groups = new Map<string, RawCharacter[]>();
  for (const char of data) {
    const word = char.word?.trim();
    if (!word || word.length !== 1) continue;

    if (!groups.has(word)) {
      groups.set(word, []);
    }
    groups.get(word)!.push(char);
  }
  return groups;
}

// 处理单个汉字（支持多音字）
function processCharacter(
  chars: RawCharacter[],
): Prisma.CharacterCreateInput | null {
  try {
    if (chars.length === 0) return null;

    const word = chars[0].word?.trim();
    if (!word) return null;

    // 去重并整理拼音和笔画
    const pinyinSet = new Set<string>();
    const strokeSet = new Set<number>();
    const pinyinMap: Record<string, number> = {};

    for (const c of chars) {
      // 处理拼音（去掉声调数字）
      const pinyin = c.pinyin?.replace(/\d/g, "").trim();
      if (pinyin) {
        pinyinSet.add(pinyin);
        // 笔画数
        if (c.strokes) {
          const strokes = parseInt(c.strokes, 10);
          if (!isNaN(strokes)) {
            pinyinMap[pinyin] = strokes;
            strokeSet.add(strokes);
          }
        }
      }
    }

    const pinyins = Array.from(pinyinSet).sort();
    const pinyin = pinyins.join(","); // 主拼音字段存储所有拼音
    const strokes = strokeSet.size === 1 ? Array.from(strokeSet)[0] : null; // 单笔画用 strokes
    const strokeMap = Object.keys(pinyinMap).length > 0 ? pinyinMap : null; // 多音字用 strokeMap

    // 处理部首（取第一个）
    const radical = chars[0].radicals?.trim() || null;

    // 处理释义（取第一个有释义的）
    let explanation: string | null = null;
    for (const c of chars) {
      if (c.explanation) {
        explanation = c.explanation.split("\n")[0]?.trim() || null;
        if (explanation) break;
      }
    }

    // 生成组词（简单处理：从释义中提取常见词）
    const words: string[] = [];
    for (const c of chars) {
      if (c.explanation) {
        const matches = c.explanation.match(
          /[\u4e00-\u9fa5]{2,4}(?=[好坏了事人])/g,
        );
        if (matches) {
          words.push(...new Set(matches.slice(0, 5)));
        }
      }
    }

    return {
      word,
      pinyin,
      pinyins: pinyins.length > 1 ? pinyin : undefined, // 多音字才存储 pinyins
      radical,
      strokes,
      strokeMap: Object.keys(pinyinMap).length > 1 ? pinyinMap : undefined, // 多音字才存储 strokeMap
      structure: null,
      explanation,
      words: [...new Set(words)].slice(0, 10),
    };
  } catch (err) {
    console.error(`处理汉字失败: ${chars[0].word}`, err);
    return null;
  }
}

// 批量插入
async function batchInsert(
  characters: Prisma.CharacterCreateInput[],
  batchSize = 500,
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  // 清空现有数据
  console.log("清空现有汉字数据...");
  await prisma.character.deleteMany();

  for (let i = 0; i < characters.length; i += batchSize) {
    const batch = characters.slice(i, i + batchSize);
    try {
      const result = await prisma.character.createMany({
        data: batch,
      });
      success += result.count;
      if (i % 5000 === 0) {
        console.log(`  已处理 ${i}/${characters.length}`);
      }
    } catch (err) {
      console.error(`批量插入失败:`, err);
      // 逐条插入作为后备
      for (const char of batch) {
        try {
          await prisma.character.create({ data: char });
          success++;
        } catch (insertErr) {
          console.error(`插入失败 [${char.word}]:`, insertErr);
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
    console.log("开始导入汉字数据（支持多音字）...\n");

    // 数据文件路径
    const dataFile = path.join(
      __dirname,
      "..",
      "data/chinese-xinhua/data/word.json",
    );

    // 读取数据
    console.log("读取数据文件...");
    const content = await fs.readFile(dataFile, "utf-8");
    const rawData: RawCharacter[] = JSON.parse(content);
    console.log(`共 ${rawData.length} 条记录`);

    // 按汉字分组
    console.log("按汉字分组...");
    const groups = groupByWord(rawData);
    console.log(`共 ${groups.size} 个不同汉字`);

    // 统计多音字
    let multiPinyinCount = 0;
    for (const chars of groups.values()) {
      if (chars.length > 1) multiPinyinCount++;
    }
    console.log(`其中多音字: ${multiPinyinCount} 个`);

    // 处理数据
    console.log("处理数据...");
    const characters: Prisma.CharacterCreateInput[] = [];
    for (const [word, chars] of groups) {
      const processed = processCharacter(chars);
      if (processed) {
        characters.push(processed);
      }
    }
    console.log(`有效汉字: ${characters.length}`);

    // 批量插入
    console.log("开始插入数据库...");
    const result = await batchInsert(characters);

    console.log(`\n导入完成: 成功 ${result.success}, 失败 ${result.failed}`);

    // 输出统计
    const total = await prisma.character.count();
    console.log(`总计: ${total} 个汉字`);

    // 验证多音字
    const multiChar = await prisma.character.count({
      where: { pinyins: { not: null } },
    });
    console.log(`多音字: ${multiChar} 个`);
  } catch (err) {
    console.error("导入过程出错:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
