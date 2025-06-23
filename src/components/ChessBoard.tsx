import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import ChessSquare from './ChessSquare';
import PrivateHints from './PrivateHints';
import { ChessPiece, BoardPosition, GameMode, PieceColor, PieceType } from '../types/chess';

interface ChessBoardProps {
  gameMode: GameMode;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ gameMode }) => {
  const [board, setBoard] = useState<(ChessPiece | null)[][]>([]);
  const [selectedSquare, setSelectedSquare] = useState<BoardPosition | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<BoardPosition[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<PieceColor>('white');
  const [moveTimer, setMoveTimer] = useState<number>(30);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [capturedPieces, setCapturedPieces] = useState<ChessPiece[]>([]);
  const [isCheck, setIsCheck] = useState<boolean>(false);
  const [gameMessage, setGameMessage] = useState<string>('');

  // Initialize the chess board
  useEffect(() => {
    initializeBoard();
  }, []);

  // Timer logic for real-time mode
  useEffect(() => {
    if (gameMode === 'realtime' && isTimerRunning) {
      const timer = setInterval(() => {
        setMoveTimer((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameMode, isTimerRunning, moveTimer]);

  const initializeBoard = () => {
    const newBoard: (ChessPiece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));
    
    // Place pawns
    for (let col = 0; col < 8; col++) {
      newBoard[1][col] = { type: 'pawn', color: 'black', id: `black-pawn-${col}`, hasMoved: false };
      newBoard[6][col] = { type: 'pawn', color: 'white', id: `white-pawn-${col}`, hasMoved: false };
    }

    // Place other pieces
    const pieceOrder: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
    
    for (let col = 0; col < 8; col++) {
      newBoard[0][col] = { type: pieceOrder[col], color: 'black', id: `black-${pieceOrder[col]}-${col}`, hasMoved: false };
      newBoard[7][col] = { type: pieceOrder[col], color: 'white', id: `white-${pieceOrder[col]}-${col}`, hasMoved: false };
    }

    setBoard(newBoard);
    setGameMessage(`${currentPlayer === 'white' ? 'White' : 'Black'} to move first! 🌸`);
    if (gameMode === 'realtime') {
      setIsTimerRunning(true);
    }
  };

  const handleTimeUp = () => {
    setCurrentPlayer(prev => prev === 'white' ? 'black' : 'white');
    setSelectedSquare(null);
    setPossibleMoves([]);
    setGameMessage('Time up! Turn switched ⏰');
  };

  const handleSquareClick = (row: number, col: number) => {
    const piece = board[row][col];
    
    if (selectedSquare) {
      const isValidMove = possibleMoves.some(move => move.row === row && move.col === col);
      
      if (isValidMove) {
        makeMove(selectedSquare, { row, col });
      } else {
        if (piece && piece.color === currentPlayer) {
          setSelectedSquare({ row, col });
          setPossibleMoves(calculatePossibleMoves(row, col, piece));
        } else {
          setSelectedSquare(null);
          setPossibleMoves([]);
        }
      }
    } else {
      if (piece && piece.color === currentPlayer) {
        setSelectedSquare({ row, col });
        setPossibleMoves(calculatePossibleMoves(row, col, piece));
      }
    }
  };

  const makeMove = (from: BoardPosition, to: BoardPosition) => {
    const newBoard = [...board];
    const piece = newBoard[from.row][from.col];
    
    if (piece) {
      // Capture piece if present
      const capturedPiece = newBoard[to.row][to.col];
      if (capturedPiece) {
        setCapturedPieces(prev => [...prev, capturedPiece]);
      }

      // Move piece
      newBoard[to.row][to.col] = { ...piece, hasMoved: true };
      newBoard[from.row][from.col] = null;
      
      setBoard(newBoard);
      setSelectedSquare(null);
      setPossibleMoves([]);
      setMoveCount(prev => prev + 1);
      
      // Check for check/checkmate
      const nextPlayer = currentPlayer === 'white' ? 'black' : 'white';
      const inCheck = isKingInCheck(newBoard, nextPlayer);
      setIsCheck(inCheck);
      
      if (inCheck) {
        setGameMessage(`Check! ${nextPlayer === 'white' ? 'White' : 'Black'} King is in danger! 👑⚠️`);
      } else {
        setGameMessage(`${nextPlayer === 'white' ? 'White' : 'Black'}'s turn ✨`);
      }
      
      // Switch turns
      if (gameMode !== 'realtime') {
        setCurrentPlayer(nextPlayer);
      } else {
        setMoveTimer(30);
      }
    }
  };

  const isKingInCheck = (boardState: (ChessPiece | null)[][], playerColor: PieceColor): boolean => {
    // Find the king
    let kingPos: BoardPosition | null = null;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = boardState[row][col];
        if (piece && piece.type === 'king' && piece.color === playerColor) {
          kingPos = { row, col };
          break;
        }
      }
    }
    
    if (!kingPos) return false;
    
    // Check if any opponent piece can attack the king
    const opponentColor = playerColor === 'white' ? 'black' : 'white';
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = boardState[row][col];
        if (piece && piece.color === opponentColor) {
          const moves = calculatePossibleMoves(row, col, piece, boardState);
          if (moves.some(move => move.row === kingPos!.row && move.col === kingPos!.col)) {
            return true;
          }
        }
      }
    }
    
    return false;
  };

  const calculatePossibleMoves = (row: number, col: number, piece: ChessPiece, boardState = board): BoardPosition[] => {
    const moves: BoardPosition[] = [];
    
    switch (piece.type) {
      case 'pawn':
        const direction = piece.color === 'white' ? -1 : 1;
        const startRow = piece.color === 'white' ? 6 : 1;
        
        // Forward move
        if (row + direction >= 0 && row + direction < 8 && !boardState[row + direction][col]) {
          moves.push({ row: row + direction, col });
          
          // Double move from start
          if (row === startRow && !boardState[row + 2 * direction][col]) {
            moves.push({ row: row + 2 * direction, col });
          }
        }
        
        // Diagonal captures
        for (const dcol of [-1, 1]) {
          const newRow = row + direction;
          const newCol = col + dcol;
          if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            const target = boardState[newRow][newCol];
            if (target && target.color !== piece.color) {
              moves.push({ row: newRow, col: newCol });
            }
          }
        }
        break;
      
      case 'rook':
        // Horizontal and vertical moves
        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        for (const [dr, dc] of directions) {
          for (let i = 1; i < 8; i++) {
            const newRow = row + i * dr;
            const newCol = col + i * dc;
            if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;
            
            const target = boardState[newRow][newCol];
            if (!target) {
              moves.push({ row: newRow, col: newCol });
            } else {
              if (target.color !== piece.color) {
                moves.push({ row: newRow, col: newCol });
              }
              break;
            }
          }
        }
        break;
        
      case 'bishop':
        // Diagonal moves
        const diagonals = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
        for (const [dr, dc] of diagonals) {
          for (let i = 1; i < 8; i++) {
            const newRow = row + i * dr;
            const newCol = col + i * dc;
            if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;
            
            const target = boardState[newRow][newCol];
            if (!target) {
              moves.push({ row: newRow, col: newCol });
            } else {
              if (target.color !== piece.color) {
                moves.push({ row: newRow, col: newCol });
              }
              break;
            }
          }
        }
        break;
        
      case 'queen':
        // Combine rook and bishop moves
        const queenDirections = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
        for (const [dr, dc] of queenDirections) {
          for (let i = 1; i < 8; i++) {
            const newRow = row + i * dr;
            const newCol = col + i * dc;
            if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;
            
            const target = boardState[newRow][newCol];
            if (!target) {
              moves.push({ row: newRow, col: newCol });
            } else {
              if (target.color !== piece.color) {
                moves.push({ row: newRow, col: newCol });
              }
              break;
            }
          }
        }
        break;
        
      case 'king':
        // One square in any direction
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const newRow = row + dr;
            const newCol = col + dc;
            if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
              const target = boardState[newRow][newCol];
              if (!target || target.color !== piece.color) {
                moves.push({ row: newRow, col: newCol });
              }
            }
          }
        }
        break;
        
      case 'knight':
        // L-shaped moves
        const knightMoves = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
        for (const [dr, dc] of knightMoves) {
          const newRow = row + dr;
          const newCol = col + dc;
          if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            const target = boardState[newRow][newCol];
            if (!target || target.color !== piece.color) {
              moves.push({ row: newRow, col: newCol });
            }
          }
        }
        break;
    }
    
    return moves;
  };

  return (
    <div className="space-y-6">
      {/* Turn Indicator */}
      <div className="text-center">
        <div className={`inline-flex items-center px-8 py-4 rounded-full border-2 backdrop-blur-sm shadow-lg ${
          currentPlayer === 'white' 
            ? 'bg-gradient-to-r from-rose-800/70 to-pink-800/70 border-rose-400/40 text-rose-100' 
            : 'bg-gradient-to-r from-purple-800/70 to-indigo-800/70 border-purple-400/40 text-purple-100'
        }`}>
          <div className={`w-5 h-5 rounded-full mr-4 animate-pulse shadow-lg ${
            currentPlayer === 'white' ? 'bg-rose-300' : 'bg-purple-300'
          }`}></div>
          <span className="text-xl font-bold tracking-wide">
            {currentPlayer === 'white' ? "👑 White Empire Reigns" : "⚔️ Black Rebellion Strikes"}
          </span>
          {isCheck && <span className="ml-3 text-red-300 font-bold animate-pulse">⚠️ UNDER SIEGE!</span>}
        </div>
        <p className="text-sm text-rose-200 mt-3 font-medium">{gameMessage}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Private Hints - Imperial War Council */}
        <div className="lg:col-span-1">
          <PrivateHints currentPlayer={currentPlayer} gameMode={gameMode} />
        </div>

        {/* Chess Board - The Battlefield */}
        <div className="lg:col-span-2">
          <Card className="bg-gradient-to-br from-rose-900/50 to-purple-900/50 backdrop-blur-sm border-rose-400/30 p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-300 via-pink-300 to-purple-300 bg-clip-text text-transparent tracking-wide">
                {gameMode === 'realtime' ? '⚡ Blitz Empire' : gameMode === 'ar' ? '🕶️ AR Dominion' : '♟️ Imperial Battlefield'}
              </h2>
              
              {gameMode === 'realtime' && (
                <div className={`px-6 py-3 rounded-lg font-bold border backdrop-blur-sm ${
                  moveTimer <= 10 
                    ? 'bg-red-900/70 text-red-200 border-red-400/40 animate-pulse' 
                    : 'bg-amber-900/70 text-amber-200 border-amber-400/40'
                }`}>
                  {moveTimer}s
                </div>
              )}
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-8 gap-0 border-3 border-rose-400/40 rounded-xl overflow-hidden bg-gradient-to-br from-rose-50 to-pink-50 shadow-2xl">
                {board.map((row, rowIndex) =>
                  row.map((piece, colIndex) => (
                    <ChessSquare
                      key={`${rowIndex}-${colIndex}`}
                      piece={piece}
                      isLight={(rowIndex + colIndex) % 2 === 0}
                      isSelected={selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex}
                      isPossibleMove={possibleMoves.some(move => move.row === rowIndex && move.col === colIndex)}
                      onClick={() => handleSquareClick(rowIndex, colIndex)}
                      gameMode={gameMode}
                    />
                  ))
                )}
              </div>
              
              {gameMode === 'ar' && (
                <div className="absolute inset-0 bg-gradient-to-t from-rose-400/10 to-purple-400/10 rounded-xl pointer-events-none animate-pulse">
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-rose-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    AR EMPIRE MODE
                  </div>
                </div>
              )}
            </div>

            {/* Empire Statistics */}
            <div className="mt-6 grid grid-cols-2 gap-6 text-center">
              <div className="bg-gradient-to-br from-rose-800/40 to-pink-800/40 backdrop-blur-sm rounded-lg p-4 border border-rose-400/30">
                <p className="text-rose-200 font-semibold mb-1">Moves Executed</p>
                <p className="text-3xl font-bold text-rose-100">{moveCount}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-800/40 to-indigo-800/40 backdrop-blur-sm rounded-lg p-4 border border-purple-400/30">
                <p className="text-purple-200 font-semibold mb-1">Conquered Pieces</p>
                <p className="text-3xl font-bold text-purple-100">{capturedPieces.length}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChessBoard;
