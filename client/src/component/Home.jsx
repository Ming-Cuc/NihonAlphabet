import Link from "react-router-dom";

export default function Home() {
  return (
    <div className="home">
      <h1>Chọn bảng cần luyện</h1>      
      <div className="choices">
        <Link to="/quiz/hira" className="button">Hiragana</Link>
        <Link to="/quiz/kata" className="button">Katakana</Link>
      </div>
      <p className="hint">Mẹo: Gõ romaji (ví dụ: し → "shi" hoặc "si").</p>
    </div>
  );
}