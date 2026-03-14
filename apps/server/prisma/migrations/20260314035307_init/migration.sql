-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "pinyin" TEXT,
    "radical" TEXT,
    "strokes" INTEGER,
    "structure" TEXT,
    "explanation" TEXT,
    "words" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Idiom" (
    "id" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "pinyin" TEXT,
    "derivation" TEXT,
    "explanation" TEXT,
    "example" TEXT,
    "synonyms" TEXT[],
    "antonyms" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Idiom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Poem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "pinyin" TEXT,
    "difficulty" INTEGER,
    "tags" TEXT[],
    "dynasty" TEXT NOT NULL,
    "type" TEXT,
    "verses" TEXT[],
    "versePinyins" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Poem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Character_word_key" ON "Character"("word");

-- CreateIndex
CREATE INDEX "Character_word_idx" ON "Character"("word");

-- CreateIndex
CREATE UNIQUE INDEX "Idiom_word_key" ON "Idiom"("word");

-- CreateIndex
CREATE INDEX "Idiom_word_idx" ON "Idiom"("word");

-- CreateIndex
CREATE INDEX "Poem_title_idx" ON "Poem"("title");

-- CreateIndex
CREATE INDEX "Poem_author_idx" ON "Poem"("author");

-- CreateIndex
CREATE INDEX "Poem_dynasty_idx" ON "Poem"("dynasty");
