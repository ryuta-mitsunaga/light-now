import type { Piece, PieceInfo } from '@/composables/useShogi';
import type { CellIndex } from './pieceRules';
import { useGikou } from '@/composables/useGikou';

const sfenPieceMap: { [key in Piece]: string } = {
  bishop: 'B',
  gold: 'G',
  king: 'K', // 先手の王
  king2: 'k', // 後手の王、SFENでは区別しないため同じ表記を使用
  knight: 'N',
  lance: 'L',
  pawn: 'P',
  rook: 'R',
  silver: 'S',
  prom_bishop: '+B',
  prom_rook: '+R',
  prom_knight: '+N',
  prom_lance: '+L',
  prom_pawn: '+P',
  prom_silver: '+S'
};

export type Board = (PieceInfo | undefined)[][];

// 持ち駒をSFEN形式で表記
function handPiecesToSfen(havingPiece: { black: PieceInfo[]; white: PieceInfo[] }): string {
  const pieceCounts = (pieces: PieceInfo[]): { [key: string]: number } => {
    return pieces.reduce(
      (acc, piece) => {
        const pieceChar = sfenPieceMap[piece.piece!]; // `piece!`を使用してundefinedではないことを保証
        acc[pieceChar] = (acc[pieceChar] || 0) + 1;
        return acc;
      },
      {} as { [key: string]: number }
    );
  };

  const formatPieces = (pieces: { [key: string]: number }): string => {
    return Object.entries(pieces)
      .map(([piece, count]) => `${count > 1 ? count : ''}${piece}`)
      .join('');
  };

  const blackPieces = formatPieces(pieceCounts(havingPiece.black));
  const whitePieces = formatPieces(pieceCounts(havingPiece.white));

  if (blackPieces.length === 0 && whitePieces.length === 0) return '-';

  return `${blackPieces.toLowerCase()}${whitePieces}`;
}

// 盤面、持ち駒、手番からSFENを生成
// http://shogidokoro.starfree.jp/usi.html

/**
 * 盤面、持ち駒、手番からSFENを生成
 *
 * sfenの形式
 * sfen lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1
 *
 * @param list
 * @param havingPiece
 * @param turn
 */
const generateSfen = (
  list: (CellIndex & PieceInfo)[],
  havingPiece: { black: PieceInfo[]; white: PieceInfo[] },
  turn: 'black' | 'white'
): string => {
  const gikouComposable = useGikou();

  // 上の行から順に左を1列目として数える
  const boardForSfen: { [key: number]: PieceInfo[] } = {};

  list.forEach((cell) => {
    if (!boardForSfen[cell.right]?.length) boardForSfen[cell.right] = [];
    boardForSfen[cell.right][cell.left] = cell;
  });

  const hand = handPiecesToSfen(havingPiece);

  const sfen: {
    board: string;
    turn: 'b' | 'w';
    hand: string;
    toString: () => string;
  } = {
    board: 'sfen ',
    turn: turn === 'black' ? 'w' : 'b',
    hand: hand,
    toString: () => {
      return `${sfen.board} ${sfen.turn} ${sfen.hand} 1`;
    }
  };

  Object.keys(boardForSfen).forEach((key) => {
    const rowNum = Number(key);

    let tempSfen = '';
    let blankCount = 0;

    boardForSfen[rowNum].reverse().forEach((cell, i) => {
      if (!cell) return;

      // 駒がない場合は空白の数をカウント
      if (!cell.piece) {
        blankCount++;

        // 9列目の場合は空白の数をsfenに追加
        if (i === 8) tempSfen += `${blankCount}/`;

        return;
      }

      if (blankCount > 0) {
        tempSfen += `${blankCount}`;
        blankCount = 0;
      }

      // 駒がある場合
      tempSfen += gikouComposable.convertPieceToSfen(cell);

      if (i === 8 && rowNum !== 9) tempSfen += '/';
    });

    sfen.board += tempSfen;
  });

  return sfen.toString();
};

const convertToCellsFromSfen = (sfen: string): (CellIndex & PieceInfo)[] => {
  const cells: (CellIndex & PieceInfo)[] = [];

  // sfen の文字を削除
  sfen = sfen.replace(/sfen /, '');

  const splittedSfen = sfen.split(' ')[0].split('/');

  splittedSfen.forEach((row, i) => {
    let right = 1;
    row
      .replace(/\//g, '')
      .split('')
      .forEach((cell) => {
        // 数字の文字列の場合はその数だけ空のマスを追加
        const toNumberCell = Number(cell);

        if (toNumberCell) {
          for (let j = 0; j < toNumberCell; j++) {
            cells.push({
              left: 9 - right + 1,
              right: i + 1,
              piece: undefined,
              isBlack: false
            });
            right++;
          }

          return;
        }

        // cellが数字でない場合は駒を追加
        // 小文字の場合は後手の駒
        cells.push({
          left: 9 - right + 1,
          right: i + 1,
          piece: Object.keys(sfenPieceMap).find((key) => {
            return sfenPieceMap[key as Piece] === cell.toUpperCase();
          }) as Piece,
          isBlack: cell === cell.toLowerCase()
        });

        right++;
      });
  });

  return cells;
};

export { generateSfen, convertToCellsFromSfen };
