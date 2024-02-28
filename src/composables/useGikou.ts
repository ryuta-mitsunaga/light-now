import { generateSfen } from '@/services/shogi/boardToSfen';
import type { CellIndex } from '@/services/shogi/pieceRules';
import type { Piece, PieceInfo } from './useShogi';

export const useGikou = () => {
  // 最善手を変換する関数
  function convertBestMoveToCoordinates(bestMove: string): { from: CellIndex; to: CellIndex } {
    // 横座標のアルファベットを数値に変換するための基準
    const fileMap: { [key: string]: number } = {
      a: 1,
      b: 2,
      c: 3,
      d: 4,
      e: 5,
      f: 6,
      g: 7,
      h: 8,
      i: 9
    };

    // 最善手の文字列を解析
    const [fromX, fromY, toX, toY] = bestMove.split('');
    console.log(fromX, fromY, toX, toY);
    const fromRight = fileMap[fromY]; // '7g'の'g'など
    const fromLeft = parseInt(fromX, 10);
    const toRight = fileMap[toY]; // '7f'の'f'など
    const toLeft = parseInt(toX, 10);

    return {
      from: { left: fromLeft, right: fromRight },
      to: { left: toLeft, right: toRight }
    };
  }

  const convertPieceToSfen = (piece: PieceInfo): string => {
    const pieceMap: { [key in Piece]: string } = {
      pawn: 'P',
      lance: 'L',
      knight: 'N',
      silver: 'S',
      gold: 'G',
      bishop: 'B',
      rook: 'R',
      king: 'K',
      king2: 'K',
      prom_pawn: '+P',
      prom_lance: '+L',
      prom_knight: '+N',
      prom_silver: '+S',
      prom_bishop: '+B',
      prom_rook: '+R'
    };

    const pieceChar = pieceMap[piece.piece!];

    return piece.isBlack ? pieceChar.toLowerCase() : pieceChar;
  };

  const getBestMove = async (
    currentCellIndexWithPieceInfoList: (CellIndex & PieceInfo)[],
    havingPiece: { black: []; white: [] },
    turn: 'black' | 'white'
  ): Promise<{ from: CellIndex; to: CellIndex }> => {
    const sfen = generateSfen(currentCellIndexWithPieceInfoList, havingPiece, turn);

    console.log(sfen);

    const params = new URLSearchParams();
    params.append('position', sfen);
    params.append('byoyomi', '10000');

    const res = await fetch(`/api?${params.toString()}`, {
      credentials: 'include',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const resToJson = await res.json();

    console.log(resToJson);

    return convertBestMoveToCoordinates(resToJson.bestmove);
  };

  return { getBestMove, convertPieceToSfen };
};
