<template>
  <div class="d-flex flex-column shogi-board-outer">
    <div class="d-flex align-items-end justify-content-between">
      <ShogiGetPieceArea is-black :pieces="data.havingPiece.black" @select-piece="selectPiece" />
      <div class="text-end">
        <input type="button" class="btn btn-danger" value="退出" @click="leaveRoom" />
        <div
          class="bg-info rounded d-flex align-items-center justify-content-center text-white fw-bold mt-1"
          style="width: 100px; height: 50px"
        >
          {{ data.currentTurn === 'white' ? '先手' : '後手' }}
        </div>
      </div>
    </div>
    <div class="py-2 align-self-center">
      <div class="board-outline">
        <ShogiCell
          class="cell"
          v-for="(cellIndex, i) in currentCellIndexes"
          :key="i"
          :cell-index="cellIndex"
          :initial-position="i + 1"
          :from-best-move="
            data.bestMove?.from.left === cellIndex.left &&
            data.bestMove?.from.right === cellIndex.right
          "
          :to-best-move="
            data.bestMove?.to.left === cellIndex.left && data.bestMove?.to.right === cellIndex.right
          "
          @select="selectPiece($event, cellIndex)"
          :is-available="isAvailable(cellIndex)"
          ref="shogiCellRefs"
          @move-piece="movePiece(cellIndex)"
        />
      </div>

      <ConfirmModal message="成りますか" confirmLabel="はい" @confirmed="promote" />
    </div>
    <div class="d-flex justify-content-between align-items-end">
      <div>
        <button class="btn btn-warning" @click="getSfen">最善手</button>
      </div>
      <ShogiGetPieceArea
        :pieces="data.havingPiece.white"
        class="align-self-end"
        @select-piece="selectPiece"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import ShogiCell from '@/components/shogi/ShogiCell.vue';
import type { PieceInfo, MovePiece } from '@/composables/useShogi';
import {
  getPieceRule,
  singleMoves,
  isPromoted,
  type Moves,
  type CellIndex,
  isAvailableDrop
} from '@/services/shogi/pieceRules';
import ConfirmModal from '@/views/modals/ConfirmModal.vue';
import ShogiGetPieceArea from './ShogiGetPieceArea.vue';
import { computed, inject, nextTick, onUnmounted, ref } from 'vue';
import { useGikou } from '@/composables/useGikou';
import { customFetch } from '@/services/customFetch';
import { generateSfen, convertToCellsFromSfen, reverseSfen } from '@/services/shogi/boardToSfen';
import router from '@/router';
import { useActionCable } from '@/composables/useActionCable';
import type { useSelfUser } from '@/composables/useSelfUser';

const shogiCellRefs = ref<InstanceType<typeof ShogiCell>[]>([]);
const selfUser = inject<ReturnType<typeof useSelfUser>>('selfUserComposable');
const gikouComposable = useGikou();

const data = ref<{
  availableRangeCells: CellIndex[];
  // cellIndexがundefinedの場合は持ち駒を選択中
  selectingPiece: { pieceInfo: PieceInfo; cellIndex?: { left: number; right: number } } | undefined;
  confirmingPromoteCellRef: InstanceType<typeof ShogiCell> | undefined;
  havingPiece: {
    black: PieceInfo[];
    white: PieceInfo[];
  };
  currentCellIndexWithPieceInfoList: (CellIndex & PieceInfo)[];
  currentTurn: 'black' | 'white';
  bestMove: { from: CellIndex; to: CellIndex } | undefined;
}>({
  availableRangeCells: [],
  selectingPiece: undefined,
  confirmingPromoteCellRef: undefined,
  havingPiece: {
    black: [],
    white: []
  },
  currentCellIndexWithPieceInfoList: [],
  currentTurn: 'white',
  bestMove: undefined
});

const currentCellIndexes = ref<CellIndex[]>([]);

/** 先手番での駒の配置 */
const cellIndexes = () => {
  const indexes = [];
  for (let right = 1; right <= 9; right++) {
    for (let left = 9; left > 0; left--) {
      indexes.push({ left, right });
    }
  }

  currentCellIndexes.value = indexes;
};
cellIndexes();

/** 持ち駒にする */
const getPiece = (pieceInfo: PieceInfo) => {
  if (!pieceInfo.piece) return;

  const piece = (
    isPromoted(pieceInfo.piece) ? pieceInfo.piece.slice(5) : pieceInfo.piece
  ) as MovePiece;
  // 相手の持ち駒にする
  const isBlack = !pieceInfo.isBlack;

  data.value.havingPiece[pieceInfo.isBlack ? 'white' : 'black'].push({ piece, isBlack });
};

/** 駒が存在する移動不可なマスを取得する */
const getUnavailableCells = () => {
  const unavailableCells: { right: number; left: number; isBlack: boolean }[] = [];

  shogiCellRefs.value.forEach((cell) => {
    if (cell.pieceInfo.piece) {
      unavailableCells.push({ ...cell.$props.cellIndex, isBlack: cell.pieceInfo.isBlack });
    }
  });

  return unavailableCells;
};

const getSfen = async () => {
  setCurrentCellIndexWithPieceInfoList();

  data.value.bestMove = await gikouComposable.getBestMove(
    data.value.currentCellIndexWithPieceInfoList,
    data.value.havingPiece,
    data.value.currentTurn
  );
};

const selectPiece = (pieceInfo: PieceInfo, cellIndex?: CellIndex) => {
  const isMatchSelectingPiece =
    data.value.selectingPiece?.pieceInfo.piece === pieceInfo.piece &&
    data.value.selectingPiece?.pieceInfo.isBlack === pieceInfo.isBlack &&
    data.value.selectingPiece?.cellIndex?.left === cellIndex?.left &&
    data.value.selectingPiece?.cellIndex?.right === cellIndex?.right;

  // 選択の駒を選択した場合
  if (isMatchSelectingPiece) {
    data.value.selectingPiece = undefined;
    clearAvailableRangeCells();
    return;
  }

  // 持ち駒を選択時
  if (!cellIndex || (data.value.selectingPiece && !data.value.selectingPiece.cellIndex)) {
    if (data.value.selectingPiece) {
      // 選択中の駒を選択した場合
      if (data.value.selectingPiece.pieceInfo.piece === pieceInfo.piece) {
        data.value.selectingPiece = undefined;
        clearAvailableRangeCells();
        return;
      }

      // 打った場合
      clearAvailableRangeCells();

      movePiece(cellIndex as CellIndex);

      return (data.value.selectingPiece = undefined);
    } else {
      // 選択した場合
      data.value.selectingPiece = { pieceInfo };

      const unavailableCells = getUnavailableCells();

      data.value.availableRangeCells = currentCellIndexes.value
        .map((cellIndex) => {
          const isUnavailable = unavailableCells.some(
            (unavailableCell) =>
              unavailableCell.left === cellIndex.left && unavailableCell.right === cellIndex.right
          );

          if (!isUnavailable) return { left: cellIndex.left, right: cellIndex.right };
        })
        .filter(Boolean) as CellIndex[];

      return;
    }
  }

  if (isAvailable(cellIndex) && data.value.selectingPiece) {
    // 駒の移動可能範囲を選択時
    if (pieceInfo.piece) getPiece(pieceInfo);
    return movePiece(cellIndex);
  }

  const rule = getPieceRule(pieceInfo) as NonNullable<ReturnType<typeof getPieceRule>>;

  if (!rule && !pieceInfo.piece) return;

  clearAvailableRangeCells();

  data.value.selectingPiece = { pieceInfo, cellIndex };

  // 駒が存在し移動不可なマス
  const unavailableCells = getUnavailableCells();

  /** 駒の移動範囲をセット */
  const setAvailableRangeCellsForRule = (
    rule: NonNullable<ReturnType<typeof getPieceRule>>,
    pieceInfo: PieceInfo,
    cellIndex: CellIndex
  ) => {
    // 駒の移動可能範囲を取得
    Object.keys(rule.moves).forEach((key) => {
      const moveKey = key as keyof Moves;

      const move = rule.moves[moveKey];
      if (!move) return;

      setAvailableRangeCells(move, moveKey, cellIndex, pieceInfo);
    });
  };

  setAvailableRangeCellsForRule(rule, pieceInfo, cellIndex);

  // 全方向に１マスずつ確認し移動不可の場合はそれ以降のマスをavailableRangeCellsから除外する
  const filterAvailableRangeCells = () => {
    // knight用のフィルター
    if (data.value.selectingPiece?.pieceInfo.piece === 'knight') {
      const knightPieceMove = getPieceRule(pieceInfo)?.moves;

      const availableCellsForKnight = [
        {
          dx: cellIndex.left + (knightPieceMove?.frontLeft?.dx || 0),
          dy: cellIndex.right + (knightPieceMove?.frontLeft?.dy || 0)
        },
        {
          dx: cellIndex.left + (knightPieceMove?.frontRight?.dx || 0),
          dy: cellIndex.right + (knightPieceMove?.frontRight?.dy || 0)
        }
      ];

      const unavailableCellsForKnight = unavailableCells.filter((unavailableCell) =>
        availableCellsForKnight.some(
          (availableCellForKnight) =>
            unavailableCell.left === availableCellForKnight.dx &&
            unavailableCell.right === availableCellForKnight.dy
        )
      );

      data.value.availableRangeCells = data.value.availableRangeCells.filter(
        (availableRangeCell) => {
          return !unavailableCellsForKnight.some(
            (unavailableCellForKnight) =>
              availableRangeCell.left === unavailableCellForKnight.left &&
              availableRangeCell.right === unavailableCellForKnight.right &&
              unavailableCellForKnight.isBlack === pieceInfo.isBlack
          );
        }
      );

      return;
    }

    let isUnavailable = false;
    Object.keys(singleMoves).forEach((key) => {
      const move = singleMoves[key as keyof typeof singleMoves];

      isUnavailable = false;

      if (pieceInfo.isBlack) {
        move.dx *= -1;
        move.dy *= -1;
      }

      for (let i = 1; i <= 9; i++) {
        const left = cellIndex.left + move.dx * i;
        const right = cellIndex.right + move.dy * i;

        if (left < 1 || left > 9 || right < 1 || right > 9) return;

        if (isUnavailable) {
          data.value.availableRangeCells = data.value.availableRangeCells.filter(
            (availableRangeCell) =>
              !(availableRangeCell.left === left && availableRangeCell.right === right)
          );
          continue;
        }

        unavailableCells.some((unavailableCell) => {
          if (unavailableCell.left === left && unavailableCell.right === right) {
            if (pieceInfo.isBlack === unavailableCell.isBlack) {
              // 相手駒の場合進める（取得して）ためavailableRangeCellsから除外しない
              data.value.availableRangeCells = data.value.availableRangeCells.filter(
                (availableRangeCell) =>
                  !(availableRangeCell.left === left && availableRangeCell.right === right)
              );
            }

            isUnavailable = true;
            return true;
          }
        });
      }
    });
  };

  filterAvailableRangeCells();
};

const clearAvailableRangeCells = () => {
  data.value.availableRangeCells = [];
  data.value.bestMove = undefined;
};

const setAvailableRangeCells = (
  move: { dx: number; dy: number },
  key: keyof Moves,
  cellIndex: CellIndex,
  pieceInfo: PieceInfo
) => {
  const pushAvailableRangeCells = (left: number, right: number) => {
    if (left < 1 || left > 9 || right < 1 || right > 9) return;

    const availableRangeCells = {
      left,
      right
    };

    data.value.availableRangeCells.push(availableRangeCells);
  };

  if (pieceInfo.piece === 'knight') {
    const left = cellIndex.left + move.dx;
    const right = cellIndex.right + move.dy;

    pushAvailableRangeCells(left, right);

    return;
  }

  if (pieceInfo.piece === 'lance') {
    for (let i = 1; i <= Math.abs(move.dy); i++) {
      const left = cellIndex.left - move.dx;
      const right = pieceInfo.isBlack ? cellIndex.right + i : cellIndex.right - i;

      pushAvailableRangeCells(left, right);
    }

    return;
  }

  if (pieceInfo.piece === 'bishop' || pieceInfo.piece === 'prom_bishop') {
    if (key === 'frontLeft') {
      for (let i = 1; i <= Math.abs(move.dx); i++) {
        const left = cellIndex.left - i;
        const right = pieceInfo.isBlack ? cellIndex.right - i : cellIndex.right + i;

        pushAvailableRangeCells(left, right);
      }
    }

    if (key === 'frontRight') {
      for (let i = 1; i <= Math.abs(move.dx); i++) {
        const left = cellIndex.left + i;
        const right = pieceInfo.isBlack ? cellIndex.right - i : cellIndex.right + i;

        pushAvailableRangeCells(left, right);
      }
    }

    if (key === 'rearLeft') {
      for (let i = 1; i <= Math.abs(move.dx); i++) {
        const left = cellIndex.left - i;
        const right = pieceInfo.isBlack ? cellIndex.right + i : cellIndex.right - i;

        pushAvailableRangeCells(left, right);
      }
    }

    if (key === 'rearRight') {
      for (let i = 1; i <= Math.abs(move.dx); i++) {
        const left = cellIndex.left + i;
        const right = pieceInfo.isBlack ? cellIndex.right + i : cellIndex.right - i;

        pushAvailableRangeCells(left, right);
      }
    }

    if (pieceInfo.piece === 'prom_bishop') {
      const left = cellIndex.left + move.dx;
      const right = cellIndex.right + move.dy;

      pushAvailableRangeCells(left, right);
    }

    return;
  }

  if (pieceInfo.piece === 'rook' || pieceInfo.piece === 'prom_rook') {
    if (key === 'front') {
      for (let i = 1; i <= Math.abs(move.dy); i++) {
        const left = cellIndex.left;
        const right = pieceInfo.isBlack ? cellIndex.right - i : cellIndex.right + i;

        pushAvailableRangeCells(left, right);
      }
    }

    if (key === 'right') {
      for (let i = 1; i <= Math.abs(move.dx); i++) {
        const left = cellIndex.left + i;
        const right = pieceInfo.isBlack ? cellIndex.right : cellIndex.right;

        pushAvailableRangeCells(left, right);
      }
    }

    if (key === 'rear') {
      for (let i = 1; i <= Math.abs(move.dy); i++) {
        const left = cellIndex.left;
        const right = pieceInfo.isBlack ? cellIndex.right + i : cellIndex.right - i;

        pushAvailableRangeCells(left, right);
      }
    }

    if (key === 'left') {
      for (let i = 1; i <= Math.abs(move.dx); i++) {
        const left = cellIndex.left - i;
        const right = pieceInfo.isBlack ? cellIndex.right : cellIndex.right;

        pushAvailableRangeCells(left, right);
      }
    }

    if (pieceInfo.piece === 'prom_rook') {
      const left = cellIndex.left + move.dx;
      const right = cellIndex.right + move.dy;

      pushAvailableRangeCells(left, right);
    }

    return;
  }

  const left = cellIndex.left + move.dx;
  const right = cellIndex.right + move.dy;

  pushAvailableRangeCells(left, right);
};

const isAvailable = (cellIndex: CellIndex) => {
  return data.value.availableRangeCells.some((cell) => {
    return cell.left === cellIndex.left && cell.right === cellIndex.right;
  });
};

const setCurrentCellIndexWithPieceInfoList = () => {
  data.value.currentCellIndexWithPieceInfoList = shogiCellRefs.value.map((cell) => {
    return {
      left: cell.$props.cellIndex.left,
      right: cell.$props.cellIndex.right,
      piece: cell.pieceInfo.piece,
      isBlack: cell.pieceInfo.isBlack
    };
  });
};

const roomId = computed(() => router.currentRoute.value.params.roomId as unknown as number);

const setTurn = (turn?: 'black' | 'white') => {
  if (turn) return (data.value.currentTurn = turn);

  data.value.currentTurn = data.value.currentTurn === 'black' ? 'white' : 'black';
};

/** 盤上の状況をsfen形式で保存する */
const addSfenLog = () => {
  const sfen = generateSfen(
    data.value.currentCellIndexWithPieceInfoList,
    data.value.havingPiece,
    data.value.currentTurn
  );
  console.log(`/shogi/room/${roomId.value}/log`);
  customFetch(`/shogi/room/${roomId.value}/log`, 'post', JSON.stringify({ sfen }));
};

const setBoard = (sfen: string) => {
  const { cells, turn, havingPiece } = convertToCellsFromSfen(sfen);

  setTurn(turn);
  data.value.havingPiece = havingPiece;

  cells.forEach((cell) => {
    shogiCellRefs.value.some((shogiCell) => {
      if (
        shogiCell.$props.cellIndex.left === cell.left &&
        shogiCell.$props.cellIndex.right === cell.right
      ) {
        shogiCell.setState(cell.piece, cell.isBlack);
        return true;
      }
    });
  });
};

const getLatestLog = () => {
  customFetch(`/shogi/room/${roomId.value}/log/latest`, 'get').then((res) => {
    if (!res) return;

    const sfen = (res as { data: { sfen: string } }).data?.sfen;

    if (!sfen) return;

    setBoard(sfen);
  });
};

getLatestLog();

type ReceiveData = { sfen: string; userId: number };

const connectCallable = {
  connected: () => {
    console.log('connected');
  },
  disconnected: () => {
    console.log('disconnected');
  },
  received: (data: ReceiveData) => {
    if (data.sfen && data.userId !== selfUser?.state.value?.id) {
      setBoard(reverseSfen(data.sfen));
    }
  }
};

const actionCable = useActionCable('ShogiChannel', roomId.value, connectCallable);

onUnmounted(() => {
  actionCable?.channel.unsubscribe();
});

const movePiece = (cellIndex: { right: number; left: number }) => {
  // 持ち駒を打った場合
  if (data.value.selectingPiece && !data.value.selectingPiece.cellIndex) {
    setCurrentCellIndexWithPieceInfoList();

    const isAvailableDropResult = isAvailableDrop(
      data.value.currentCellIndexWithPieceInfoList,
      data.value.selectingPiece.pieceInfo as NonNullable<
        PieceInfo & { piece: Exclude<MovePiece, 'king' | 'king2'> }
      >,
      cellIndex
    );

    if (!isAvailableDropResult) return;

    setTurn();
    addSfenLog();

    shogiCellRefs.value.some((cell) => {
      if (
        cell.$props.cellIndex.left === cellIndex.left &&
        cell.$props.cellIndex.right === cellIndex.right &&
        data.value.selectingPiece
      ) {
        cell.setState(
          data.value.selectingPiece.pieceInfo.piece as NonNullable<PieceInfo['piece']>,
          data.value.selectingPiece.pieceInfo.isBlack
        );

        return true;
      }
    });

    // 持ち駒から打った駒を１枚削除
    const removeIndex = data.value.havingPiece[
      data.value.selectingPiece?.pieceInfo.isBlack ? 'black' : 'white'
    ].findIndex(
      (piece) =>
        piece.piece === data.value.selectingPiece?.pieceInfo.piece &&
        piece.isBlack === data.value.selectingPiece?.pieceInfo.isBlack
    );

    if (removeIndex !== -1) {
      data.value.havingPiece[
        data.value.selectingPiece?.pieceInfo.isBlack ? 'black' : 'white'
      ].splice(removeIndex, 1);
    }
  }

  const availableCell = data.value.availableRangeCells.find(
    (availableRangeCell) =>
      availableRangeCell.left === cellIndex.left && availableRangeCell.right === cellIndex.right
  );

  const selectingPiece = data.value.selectingPiece;

  if (!availableCell || !selectingPiece || !selectingPiece.pieceInfo.piece) return;

  setTurn();

  shogiCellRefs.value.forEach((cell) => {
    if (
      cell.$props.cellIndex.left === availableCell.left &&
      cell.$props.cellIndex.right === availableCell.right &&
      data.value.selectingPiece
    ) {
      cell.setState(
        selectingPiece.pieceInfo.piece as NonNullable<PieceInfo['piece']>,
        selectingPiece.pieceInfo.isBlack
      );

      const isAvailablePromote = cell.confirmPromote(
        data.value.selectingPiece.cellIndex as CellIndex,
        cellIndex
      );

      if (isAvailablePromote) {
        data.value.confirmingPromoteCellRef = cell;
      }
    }

    if (
      cell.$props.cellIndex.left === selectingPiece.cellIndex?.left &&
      cell.$props.cellIndex.right === selectingPiece.cellIndex?.right
    ) {
      cell.setState(undefined, false);
    }
  });

  data.value.selectingPiece = undefined;
  clearAvailableRangeCells();

  setCurrentCellIndexWithPieceInfoList();
  addSfenLog();
};

const promote = () => {
  data.value.confirmingPromoteCellRef?.promote();

  setCurrentCellIndexWithPieceInfoList();
  addSfenLog();
};

const leaveRoom = () => {
  actionCable.channel.unsubscribe();

  router.push('/shogi/rooms');
};
</script>

<style scoped>
.board-outline {
  border: 1px solid black;

  display: grid;
  grid-template-columns: repeat(9, 50px);
}

.shogi-board-outer {
  width: 450px;
  height: 800px;
}

.cell {
  border: 0.5px solid black;
}
</style>
