import { isPromote, type CellIndex } from '@/services/shogi/pieceRules';
import { Modal } from 'bootstrap';
import { computed, ref, type Ref } from 'vue';

export type MovePiece =
  | 'bishop'
  | 'gold'
  | 'king'
  | 'king2'
  | 'knight'
  | 'lance'
  | 'pawn'
  | 'rook'
  | 'silver';
export type PromotedPiece =
  | 'prom_knight'
  | 'prom_lance'
  | 'prom_pawn'
  | 'prom_silver'
  | 'prom_bishop'
  | 'prom_rook';

export type Piece = MovePiece | PromotedPiece;

export type PieceInfo = {
  piece: Piece | undefined;
  isBlack: boolean;
};

export const useShogi = (initialPosition: number) => {
  const data = ref<{
    piece: Piece | undefined;
    isPromoted: boolean;
    isBlack: boolean;
    checkingPromote: boolean;
  }>({
    piece: undefined,
    isPromoted: false,
    isBlack: false,
    checkingPromote: false
  });

  const setData = () => {
    switch (true) {
      case [1, 9].includes(initialPosition):
        data.value.piece = 'lance';
        data.value.isBlack = true;
        data.value.isPromoted = false;
        break;
      case [73, 81].includes(initialPosition):
        data.value.piece = 'lance';
        data.value.isBlack = false;
        data.value.isPromoted = false;
        break;
      case [2, 8].includes(initialPosition):
        data.value.piece = 'knight';
        data.value.isBlack = true;
        data.value.isPromoted = false;
        break;
      case [74, 80].includes(initialPosition):
        data.value.piece = 'knight';
        data.value.isBlack = false;
        data.value.isPromoted = false;
        break;
      case [3, 7].includes(initialPosition):
        data.value.piece = 'silver';
        data.value.isBlack = true;
        data.value.isPromoted = false;
        break;
      case [75, 79].includes(initialPosition):
        data.value.piece = 'silver';
        data.value.isBlack = false;
        data.value.isPromoted = false;
        break;
      case [4, 6].includes(initialPosition):
        data.value.piece = 'gold';
        data.value.isBlack = true;
        data.value.isPromoted = false;
        break;
      case [76, 78].includes(initialPosition):
        data.value.piece = 'gold';
        data.value.isBlack = false;
        data.value.isPromoted = false;
        break;
      case [11].includes(initialPosition):
        data.value.piece = 'rook';
        data.value.isBlack = true;
        data.value.isPromoted = false;
        break;
      case [71].includes(initialPosition):
        data.value.piece = 'rook';
        data.value.isBlack = false;
        data.value.isPromoted = false;
        break;
      case [5].includes(initialPosition):
        data.value.piece = 'king';
        data.value.isBlack = true;
        data.value.isPromoted = false;
        break;
      case [77].includes(initialPosition):
        data.value.piece = 'king2';
        data.value.isBlack = false;
        data.value.isPromoted = false;
        break;

      case [17].includes(initialPosition):
        data.value.piece = 'bishop';
        data.value.isBlack = true;
        data.value.isPromoted = false;
        break;
      case [65].includes(initialPosition):
        data.value.piece = 'bishop';
        data.value.isBlack = false;
        data.value.isPromoted = false;
        break;
      case [19, 20, 21, 22, 23, 24, 25, 26, 27].includes(initialPosition):
        data.value.piece = 'pawn';
        data.value.isBlack = true;
        data.value.isPromoted = false;
        break;
      case [55, 56, 57, 58, 59, 60, 61, 62, 63].includes(initialPosition):
        data.value.piece = 'pawn';
        data.value.isBlack = false;
        data.value.isPromoted = false;
        break;
    }
  };
  setData();

  const pieceInfo = computed(() => {
    if (
      data.value.isPromoted &&
      ['knight', 'lance', 'pawn', 'silver'].includes(data.value.piece || '')
    ) {
      return {
        piece: `prom_${data.value.piece}` as PromotedPiece,
        isBlack: data.value.isBlack
      };
    }

    return {
      piece: data.value.piece,
      isBlack: data.value.isBlack
    };
  });

  const setState = (piece: Piece | undefined, isBlack: boolean) => {
    data.value.piece = piece;
    data.value.isBlack = isBlack;
  };

  const confirmPromote = (fromCellIndex: CellIndex, toCellIndex: CellIndex) => {
    if (!data.value.piece || !isPromote(pieceInfo.value, fromCellIndex, toCellIndex)) return false;

    data.value.checkingPromote = true;

    const modal = new Modal('#confirmModal');

    modal.show();

    return true;
  };

  const promote = () => {
    const promotedPiece: PromotedPiece = `prom_${data.value.piece}` as PromotedPiece;

    setState(promotedPiece, data.value.isBlack);

    data.value.checkingPromote = false;
  };

  return {
    data,
    pieceInfo,
    setState,
    promote,
    confirmPromote
  };
};
