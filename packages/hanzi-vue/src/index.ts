import { ref, onMounted, onUnmounted, watch, type Ref } from "vue";
import HanziWriter from "hanzi-writer";

export interface HanziWriterOptions {
  width?: number;
  height?: number;
  padding?: number;
  showOutline?: boolean;
  showCharacter?: boolean;
  strokeAnimationSpeed?: number;
  delayBetweenStrokes?: number;
  strokeColor?: string;
  outlineColor?: string;
  drawingColor?: string;
  radicalColor?: string;
  strokeWidth?: number;
  outlineWidth?: number;
  drawingWidth?: number;
  showHintAfterMisses?: number;
  highlightOnComplete?: boolean;
  highlightCompleteColor?: string;
}

export interface HanziWriterInstance {
  animateCharacter: () => void;
  animateStroke: (strokeNum: number, onComplete?: () => void) => void;
  animateStrokes: (strokeNums: number[], onComplete?: () => void) => void;
  cancelAnimation: () => void;
  showCharacter: () => void;
  hideCharacter: () => void;
  showOutline: () => void;
  hideOutline: () => void;
  showStrokeOrder: () => void;
  hideStrokeOrder: () => void;
  getCharacter: () => any;
  quiz: (options?: {
    onMistake?: (strokeData: any) => void;
    onCorrectStroke?: (strokeData: any) => void;
    onComplete?: () => void;
    highlightComplete?: boolean;
    highlightCompleteColor?: string;
    showCharacterAfterMisses?: number;
    showOutlineAfterMisses?: number;
    strokeAnimationSpeed?: number;
    delayBetweenStrokes?: number;
  }) => void;
  cancelQuiz: () => void;
  updateColor: (color: string) => void;
  updateStrokeColor: (strokeColor: string) => void;
  updateOutlineColor: (outlineColor: string) => void;
}

export function useHanziWriter(
  character: string | Ref<string>,
  containerRef: Ref<HTMLElement | null>,
  options: HanziWriterOptions = {},
) {
  const writer = ref<HanziWriterInstance | null>(null);
  const isLoading = ref(false);
  const error = ref<Error | null>(null);

  const defaultOptions: HanziWriterOptions = {
    width: 150,
    height: 150,
    padding: 20,
    showOutline: true,
    showCharacter: true,
    strokeAnimationSpeed: 1,
    delayBetweenStrokes: 500,
    strokeColor: "#333",
    outlineColor: "#DDD",
    drawingColor: "#333",
    highlightOnComplete: true,
    highlightCompleteColor: "#4ade80",
    ...options,
  };

  const initWriter = (char: string) => {
    if (!containerRef.value) return;

    try {
      isLoading.value = true;
      error.value = null;

      writer.value = HanziWriter.create(
        containerRef.value,
        char,
        defaultOptions,
      ) as any;

      writer.value?.animateCharacter();
      isLoading.value = false;
    } catch (e) {
      error.value = e as Error;
      isLoading.value = false;
    }
  };

  onMounted(() => {
    const char = typeof character === "string" ? character : character.value;
    if (char && containerRef.value) {
      initWriter(char);
    }
  });

  watch(
    () => (typeof character === "string" ? character : character.value),
    (newChar) => {
      if (newChar && containerRef.value) {
        initWriter(newChar);
      }
    },
  );

  onUnmounted(() => {
    writer.value = null;
  });

  return {
    writer,
    isLoading,
    error,
    animateCharacter: () => writer.value?.animateCharacter(),
    animateStroke: (strokeNum: number, onComplete?: () => void) =>
      writer.value?.animateStroke(strokeNum, onComplete),
    showCharacter: () => writer.value?.showCharacter(),
    hideCharacter: () => writer.value?.hideCharacter(),
    showOutline: () => writer.value?.showOutline(),
    hideOutline: () => writer.value?.hideOutline(),
    quiz: (quizOptions?: any) => writer.value?.quiz(quizOptions),
    cancelQuiz: () => writer.value?.cancelQuiz(),
  };
}
