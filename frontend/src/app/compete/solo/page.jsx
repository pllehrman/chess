// compete/solo/page.js
import ChessComponent from '../../../components/ChessComponent';

export default function SoloChessBoard() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <ChessComponent />
      </div>
    </div>
  );
}