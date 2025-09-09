import { Routes, Route, Link } from 'react-router-dom';
import Home from './component/Home';
import Quiz from './component/Quiz';

export default function App() {
  return (
    <div className='container'>
      <header className='header'>
        <Link to="/" className='brand'>Kana Quiz</Link>
      </header>
      <main>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/quiz/:type' element={<Quiz />} />
        </Routes>
      </main>
      <footer className="footer">Made with ❤ for Hiragana & Katakana</footer>
    </div >
  );
}