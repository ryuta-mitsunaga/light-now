import type { Piece, PieceInfo, PromotedPiece } from '@/composables/useShogi';

const forward = { dx: 0, dy: -1 };
const right = { dx: -1, dy: 0 };
const rear = { dx: 0, dy: 1 };
const left = { dx: 1, dy: 0 };
const frontLeft = { dx: 1, dy: -1 };
const frontRight = { dx: -1, dy: -1 };
const rearLeft = { dx: 1, dy: 1 };
const rearRight = { dx: -1, dy: 1 };

export const singleMoves = {
  forward,
  right,
  rear,
  left,
  frontLeft,
  frontRight,
  rearLeft,
  rearRight
};

export type CellIndex = { left: number; right: number };

export type Moves = {
  front?: { dx: number; dy: number };
  rear?: { dx: number; dy: number };
  left?: { dx: number; dy: number };
  right?: { dx: number; dy: number };
  frontLeft?: { dx: number; dy: number };
  frontRight?: { dx: number; dy: number };
  rearLeft?: { dx: number; dy: number };
  rearRight?: { dx: number; dy: number };
};

/**
 * 駒の動きを定義
 *
 * 後手番からみた駒の動きは、dx, dyの符号を逆にする
 */
const pieceRules: { [key in Piece]: { moves: Moves } } = {
  gold: {
    moves: {
      front: { dx: 0, dy: -1 },
      frontLeft: { dx: 1, dy: -1 },
      frontRight: { dx: -1, dy: -1 },
      left: { dx: 1, dy: 0 },
      right: { dx: -1, dy: 0 },
      rear: { dx: 0, dy: 1 }
    }
  },
  silver: {
    moves: {
      front: { dx: 0, dy: -1 },
      frontLeft: { dx: 1, dy: -1 },
      frontRight: { dx: -1, dy: -1 },
      rearLeft: { dx: 1, dy: 1 },
      rearRight: { dx: -1, dy: 1 }
    }
  },
  prom_silver: {
    moves: {
      front: { dx: 0, dy: -1 },
      frontLeft: { dx: 1, dy: -1 },
      frontRight: { dx: -1, dy: -1 },
      rear: { dx: 0, dy: 1 },
      left: { dx: 1, dy: 0 },
      right: { dx: -1, dy: 0 }
    }
  },
  knight: {
    moves: {
      frontLeft: { dx: 1, dy: -2 },
      frontRight: { dx: -1, dy: -2 }
    }
  },
  prom_knight: {
    moves: {
      front: { dx: 0, dy: -1 },
      frontLeft: { dx: 1, dy: -1 },
      frontRight: { dx: -1, dy: -1 },
      rearLeft: { dx: 1, dy: 1 },
      rearRight: { dx: -1, dy: 1 }
    }
  },
  lance: {
    moves: {
      front: { dx: 0, dy: -8 }
    }
  },
  prom_lance: {
    moves: {
      front: { dx: 0, dy: -1 },
      frontLeft: { dx: 1, dy: -1 },
      frontRight: { dx: -1, dy: -1 },
      rearLeft: { dx: 1, dy: 1 },
      rearRight: { dx: -1, dy: 1 }
    }
  },
  pawn: {
    moves: {
      front: { dx: 0, dy: -1 }
    }
  },
  prom_pawn: {
    moves: {
      front: { dx: 0, dy: -1 },
      frontLeft: { dx: 1, dy: -1 },
      frontRight: { dx: -1, dy: -1 },
      left: { dx: 1, dy: 0 },
      right: { dx: -1, dy: 0 },
      rear: { dx: 0, dy: 1 }
    }
  },
  rook: {
    moves: {
      front: { dx: 0, dy: -8 },
      rear: { dx: 0, dy: 8 },
      left: { dx: 8, dy: 0 },
      right: { dx: -8, dy: 0 }
    }
  },
  prom_rook: {
    moves: {
      front: { dx: 0, dy: -8 },
      rear: { dx: 0, dy: 8 },
      left: { dx: 8, dy: 0 },
      right: { dx: -8, dy: 0 },
      frontLeft: { dx: 1, dy: -1 },
      frontRight: { dx: -1, dy: -1 },
      rearLeft: { dx: 1, dy: 1 },
      rearRight: { dx: -1, dy: 1 }
    }
  },
  bishop: {
    moves: {
      frontLeft: { dx: 8, dy: -8 },
      frontRight: { dx: -8, dy: -8 },
      rearLeft: { dx: 8, dy: 8 },
      rearRight: { dx: -8, dy: 8 }
    }
  },
  prom_bishop: {
    moves: {
      front: { dx: 0, dy: -1 },
      rear: { dx: 0, dy: 1 },
      left: { dx: 1, dy: 0 },
      right: { dx: -1, dy: 0 },
      frontLeft: { dx: 8, dy: -8 },
      frontRight: { dx: -8, dy: -8 },
      rearLeft: { dx: 8, dy: 8 },
      rearRight: { dx: -8, dy: 8 }
    }
  },
  king: {
    moves: {
      front: { dx: 0, dy: -1 },
      rear: { dx: 0, dy: 1 },
      left: { dx: 1, dy: 0 },
      right: { dx: -1, dy: 0 },
      frontLeft: { dx: 1, dy: -1 },
      frontRight: { dx: -1, dy: -1 },
      rearLeft: { dx: 1, dy: 1 },
      rearRight: { dx: -1, dy: 1 }
    }
  },
  king2: {
    moves: {
      front: { dx: 0, dy: -1 },
      rear: { dx: 0, dy: 1 },
      left: { dx: 1, dy: 0 },
      right: { dx: -1, dy: 0 },
      frontLeft: { dx: 1, dy: -1 },
      frontRight: { dx: -1, dy: -1 },
      rearLeft: { dx: 1, dy: 1 },
      rearRight: { dx: -1, dy: 1 }
    }
  }
};

const getPieceRule = (pieceInfo: PieceInfo) => {
  if (!pieceInfo.piece) return;

  const rule = pieceRules[pieceInfo.piece];

  // 後手番の場合、動きを逆にする
  return pieceInfo.isBlack
    ? {
        ...rule,
        moves: Object.fromEntries(
          Object.entries(rule.moves).map(([key, value]) => [
            key,
            { dx: value.dx ? -value.dx : 0, dy: value.dy ? -value.dy : 0 }
          ])
        )
      }
    : rule;
};

/** 移動した駒が成れるかどうかを判定する */
const isPromote = (pieceInfo: PieceInfo, fromCellIndex: CellIndex, toCellIndex: CellIndex) => {
  // 相手陣地の3マス目に入っている場合
  const isPromoteArea = pieceInfo.isBlack ? toCellIndex.right >= 7 : toCellIndex.right <= 3;
  const isPastPromoteArea = pieceInfo.isBlack ? fromCellIndex.right >= 7 : fromCellIndex.right <= 3;
  const isAvailablePromote =
    pieceInfo.piece === 'pawn' ||
    pieceInfo.piece === 'lance' ||
    pieceInfo.piece === 'knight' ||
    pieceInfo.piece === 'silver' ||
    pieceInfo.piece === 'rook' ||
    pieceInfo.piece === 'bishop';

  return (isPromoteArea || isPastPromoteArea) && isAvailablePromote;
};

/** 成駒かどうかを判定する */
const isPromoted = (piece: Piece) => piece.startsWith('prom_');

/** 駒を打てるかどうかを判定する */
const isAvailableDrop = (
  currentCellIndexWithPieceInfoList: (CellIndex & PieceInfo)[],
  dropPieceInfo: PieceInfo & {
    piece: NonNullable<Exclude<Piece, PromotedPiece | 'king' | 'king2'>>;
  },
  dropToCellIndex: CellIndex
) => {
  // ２歩の判定
  const isNotDuplicatePawn = () => {
    if (dropPieceInfo.piece !== 'pawn') return true;

    // 同じ筋に歩があるかどうか
    return !currentCellIndexWithPieceInfoList.some(
      (currentCellIndexWithPieceInfo) =>
        currentCellIndexWithPieceInfo.left === dropToCellIndex.left &&
        currentCellIndexWithPieceInfo.piece === 'pawn' &&
        currentCellIndexWithPieceInfo.isBlack === dropPieceInfo.isBlack
    );
  };

  // 次のターン移動できるかどうか
  const isMoveNextTurn = () => {
    const rule = getPieceRule(dropPieceInfo);

    if (!rule) return false;

    let result = false;

    const isOverCell = (cellIndex: CellIndex) => {
      return cellIndex.left > 9 || cellIndex.left < 1 || cellIndex.right > 9 || cellIndex.right < 1;
    };

    // 相手の駒が存在する場合
    const existsOpponentPiece = (
      currentCellIndexWithPieceInfo: (typeof currentCellIndexWithPieceInfoList)[number],
      nextCellIndex: CellIndex
    ) => {
      return (
        currentCellIndexWithPieceInfo.left === nextCellIndex.left &&
        currentCellIndexWithPieceInfo.right === nextCellIndex.right &&
        currentCellIndexWithPieceInfo.isBlack !== dropPieceInfo.isBlack
      );
    };

    // 駒が存在しないかどうか
    const existsPiece = (
      currentCellIndexWithPieceInfo: (typeof currentCellIndexWithPieceInfoList)[number],
      nextCellIndex: CellIndex
    ) => {
      return (
        currentCellIndexWithPieceInfo.left === nextCellIndex.left &&
        currentCellIndexWithPieceInfo.right === nextCellIndex.right &&
        !currentCellIndexWithPieceInfo.piece
      );
    };

    if (['rook', 'bishop', 'lance'].includes(dropPieceInfo.piece)) {
      Object.keys(rule.moves).forEach((key) => {
        if (result) return;

        const move = rule.moves[key as keyof Moves];

        if (!move) return;
        const singleMove = singleMoves[key as keyof typeof singleMoves];

        let i = 1;

        while (i < 9) {
          if (result || (i === 2 && !result)) break;

          const nextCellIndex = {
            left: dropToCellIndex.left + (dropPieceInfo.isBlack ? singleMove.dx : -singleMove.dx),
            right: dropToCellIndex.right + (dropPieceInfo.isBlack ? singleMove.dy : -singleMove.dy)
          };

          if (isOverCell(nextCellIndex)) {
            break;
          }

          result = currentCellIndexWithPieceInfoList.some(
            (currentCellIndexWithPieceInfo) =>
              existsOpponentPiece(currentCellIndexWithPieceInfo, nextCellIndex) ||
              existsPiece(currentCellIndexWithPieceInfo, nextCellIndex)
          );

          i++;
        }
      });

      return result;
    }

    Object.keys(rule.moves).forEach((key) => {
      if (result) return;

      const move = rule.moves[key as keyof Moves];

      if (!move) return;

      const nextCellIndex = {
        left: dropToCellIndex.left + move.dx,
        right: dropToCellIndex.right + move.dy
      };

      if (isOverCell(nextCellIndex)) {
        return (result = false);
      }

      result = currentCellIndexWithPieceInfoList.some(
        (currentCellIndexWithPieceInfo) =>
          existsOpponentPiece(currentCellIndexWithPieceInfo, nextCellIndex) ||
          existsPiece(currentCellIndexWithPieceInfo, nextCellIndex)
      );
    });

    return result;
  };

  // // 打ち歩詰めの判定
  // const isCheckmateNext = () => {
  //   if (dropPieceInfo.piece !== 'pawn') return false;

  //   const opponentsKing = dropPieceInfo.isBlack ? 'king2' : 'king';
  //   const nextCellIndex = {
  //     left: dropToCellIndex.left,
  //     right: dropToCellIndex.right + (dropPieceInfo.isBlack ? 1 : -1)
  //   };

  //   // 相手の玉の位置を取得
  //   const kingCellIndex = currentCellIndexWithPieceInfoList.find(
  //     (currentCellIndexWithPieceInfo) => currentCellIndexWithPieceInfo.piece === opponentsKing
  //   );

  //   return (
  //     nextCellIndex.left === kingCellIndex?.left && nextCellIndex.right === kingCellIndex?.right
  //   );
  // };

  let result = true;

  if (!isNotDuplicatePawn()) {
    console.log('２歩です');
    result = false;
  }

  if (!isMoveNextTurn()) {
    console.log('次のターン移動できません');
    result = false;
  }

  return result;
};

export { getPieceRule, isPromote, isPromoted, isAvailableDrop };
