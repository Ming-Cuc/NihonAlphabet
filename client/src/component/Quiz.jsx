import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchKana } from '../api'

// ✅ Chuẩn hóa chuỗi (xóa khoảng trắng, đổi về chữ thường)
function normalize(s) {
    return (s || '').trim().toLowerCase();
}

// ✅ Kiểm tra câu trả lời có đúng không
function isCorrect(answer, item) {
    const a = normalize(answer);         // đáp án người dùng nhập
    const main = normalize(item.romaji); // romaji chính xác
    const alts = (item.alts || []).map(normalize); // romaji thay thế (vd: shi/si)
    return a === main || alts.includes(a);
}

export default function Quiz() {
    const { type } = useParams(); // lấy param từ URL: 'hira' | 'kata'
    const [list, setList] = useState([]);      // danh sách kana lấy từ API
    const [answers, setAnswers] = useState({}); // câu trả lời của user (theo index)
    const [showResult, setShowResult] = useState(false); // đã bấm nộp bài chưa?
    const inputsRef = useRef([]); // mảng các ô input, để focus ô tiếp theo

    // ✅ Khi đổi loại bảng (hiragana/katakana), tải lại dữ liệu
    useEffect(() => {
        setShowResult(false);
        setAnswers({});
        fetchKana(type)
            .then(setList)
            .catch((e) => alert(e.message));
    }, [type]);

    // ✅ Tính điểm, chỉ chạy khi đã bấm "nộp bài"
    const score = useMemo(() => {
        if (!showResult) return null;
        const total = list.length;
        const correct = list.filter((it, idx) => isCorrect(answers[idx], it)).length;
        return { correct, total };
    }, [showResult, list, answers]);

    // ✅ Cập nhật câu trả lời khi user gõ vào input
    function handleChange(idx, value) {
        setAnswers((prev) => ({ ...prev, [idx]: value }));
    }

    // ✅ Nộp bài → hiện kết quả
    function handleSubmit(e) {
        e.preventDefault();
        setShowResult(true);
    }

    // ✅ Sau khi nhấn Enter → nhảy sang ô kế tiếp
    function focusNext(idx) {
        const el = inputsRef.current[idx + 1];
        if (el) el.focus();
    }

    return (
        <div>
            <h2 className="center">
                Luyện {type === 'hira' ? 'Hiragana' : 'Katakana'}
            </h2>

            <form className="quiz">
                {list.map((item, idx) => {
                    const correct = showResult && isCorrect(answers[idx], item);
                    const wrong = showResult && !correct && (answers[idx] ?? '').length > 0;

                    return (
                        <div key={idx} className={`row ${correct ? 'ok' : ''} ${wrong ? 'bad' : ''}`}>
                            {/* Hiện chữ kana to */}
                            <span className="kana">{item.kana}</span>

                            {/* Ô input để gõ romaji */}
                            <input
                                type="text"
                                value={answers[idx] || ''}
                                onChange={e => handleChange(idx, e.target.value)}
                                ref={el => inputsRef.current[idx] = el}
                                disabled={showResult} // sau khi nộp thì khóa input
                                onKeyDown={e => {
                                    if (e.key === 'Enter') focusNext(idx);
                                }}
                                autoComplete="off"
                            />

                            {/* Nếu đã nộp thì hiển thị kết quả ✔️ hoặc romaji đúng */}
                            {showResult && (
                                <span className="result">
                                    {correct ? '✔️' : item.romaji}
                                </span>
                            )}
                        </div>
                    );
                })}
            </form>
            {/* Nút nộp bài ra ngoài form */}
            {!showResult && (
                <button className="submit-btn" onClick={handleSubmit}>
                    Nộp bài
                </button>
            )}

            {/* Hiện điểm khi đã nộp */}
            {score && (
                <div className="score">
                    Bạn đúng {score.correct}/{score.total}
                </div>
            )}
        </div>
    );
}