export type GameMode = 'classic' | 'realtime' | 'ar';
export type GameState = 'menu' | 'playing' | 'paused' | 'finished';
export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
export type PieceColor = 'white' | 'black';

export interface ChessPiece {
  type: PieceType;
  color: PieceColor;
  id: string;
  hasMoved?: boolean;
}

export interface BoardPosition {
  row: number;
  col: number;
}

export interface Move {
  from: BoardPosition;
  to: BoardPosition;
  piece: ChessPiece;
  timestamp: number;
}

export interface GameTimer {
  white: number;
  black: number;
  moveTimeLimit: number;
  isRunning: boolean;
}

export interface GameStats {
  movesCount: number;
  capturedPieces: ChessPiece[];
  gameTime: number;
  currentPlayer: PieceColor;
}
