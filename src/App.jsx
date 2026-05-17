import { useState, useEffect, useRef, useCallback } from "react";

const SAMPLE_QUIZZES = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    category: "Programming",
    duration: 10,
    questions: [
      { id: 1, text: "Which keyword declares a block-scoped variable?", options: ["var", "let", "function", "const"], correct: 1 },
      { id: 2, text: "What does `typeof null` return?", options: ["'null'", "'undefined'", "'object'", "'boolean'"], correct: 2 },
      { id: 3, text: "Which method adds an element to the end of an array?", options: ["push()", "pop()", "shift()", "unshift()"], correct: 0 },
      { id: 4, text: "What is the output of `0 == '0'`?", options: ["false", "true", "undefined", "TypeError"], correct: 1 },
      { id: 5, text: "Which loop always executes at least once?", options: ["for", "while", "do...while", "for...of"], correct: 2 },
    ],
    attempts: 142, topScore: 100, avgScore: 74,
  },
  {
    id: 2,
    title: "World Geography",
    category: "General Knowledge",
    duration: 8,
    questions: [
      { id: 1, text: "What is the capital of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Brisbane"], correct: 2 },
      { id: 2, text: "Which is the longest river in the world?", options: ["Amazon", "Nile", "Yangtze", "Mississippi"], correct: 1 },
      { id: 3, text: "Which country has the most natural lakes?", options: ["Russia", "USA", "Canada", "Brazil"], correct: 2 },
      { id: 4, text: "Mount Everest is located in which mountain range?", options: ["Andes", "Alps", "Rockies", "Himalayas"], correct: 3 },
      { id: 5, text: "What is the smallest country in the world?", options: ["Monaco", "San Marino", "Vatican City", "Liechtenstein"], correct: 2 },
    ],
    attempts: 98, topScore: 100, avgScore: 68,
  },
  {
    id: 3,
    title: "Basic Science",
    category: "Science",
    duration: 12,
    questions: [
      { id: 1, text: "What is the chemical symbol for Gold?", options: ["Go", "Gd", "Au", "Ag"], correct: 2 },
      { id: 2, text: "How many bones are in the adult human body?", options: ["196", "206", "216", "226"], correct: 1 },
      { id: 3, text: "Which planet is known as the Red Planet?", options: ["Venus", "Jupiter", "Mars", "Saturn"], correct: 2 },
      { id: 4, text: "What is the speed of light (approx)?", options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"], correct: 0 },
      { id: 5, text: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi apparatus"], correct: 2 },
    ],
    attempts: 211, topScore: 100, avgScore: 82,
  },
];

const LEADERBOARD = [
  { rank: 1, name: "Arjun Sharma", score: 98, quizzes: 24, streak: 7 },
  { rank: 2, name: "Priya Patel", score: 96, quizzes: 31, streak: 12 },
  { rank: 3, name: "Rahul Gupta", score: 94, quizzes: 18, streak: 5 },
  { rank: 4, name: "Sneha Iyer", score: 91, quizzes: 22, streak: 3 },
  { rank: 5, name: "Karthik Nair", score: 89, quizzes: 15, streak: 8 },
  { rank: 6, name: "Divya Menon", score: 87, quizzes: 19, streak: 2 },
  { rank: 7, name: "You", score: 85, quizzes: 3, streak: 1, isUser: true },
];

const ANALYTICS = {
  totalAttempts: 451,
  avgScore: 74,
  completionRate: 88,
  topCategory: "Science",
  weeklyData: [42, 58, 71, 65, 89, 74, 92],
  categoryData: [
    { name: "Programming", value: 38 },
    { name: "General Knowledge", value: 27 },
    { name: "Science", value: 35 },
  ],
  scoreDistribution: [8, 12, 18, 22, 25, 15],
};

function getRank(score) {
  if (score >= 90) return { label: "Outstanding", color: "#7c3aed" };
  if (score >= 75) return { label: "Proficient", color: "#059669" };
  if (score >= 60) return { label: "Satisfactory", color: "#d97706" };
  return { label: "Needs Improvement", color: "#dc2626" };
}

function CertificateModal({ result, quiz, onClose }) {
  const certRef = useRef(null);
  const date = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const rank = getRank(result.percentage);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 24 }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: 8, maxWidth: 680, width: "100%", boxShadow: "0 24px 80px rgba(0,0,0,0.25)" }}>
        <div ref={certRef} style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)", borderRadius: 14, padding: "48px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "radial-gradient(circle at 20% 20%, rgba(167,139,250,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(196,181,253,0.1) 0%, transparent 50%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: 16, left: 16, right: 16, bottom: 16, border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, pointerEvents: "none" }} />
          <div style={{ color: "#a78bfa", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", marginBottom: 16, fontWeight: 600 }}>Certificate of Achievement</div>
          <div style={{ width: 56, height: 56, background: "rgba(167,139,250,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 28 }}>🏆</div>
          <div style={{ color: "rgba(196,181,253,0.7)", fontSize: 13, marginBottom: 8 }}>This certifies that</div>
          <div style={{ color: "#fff", fontSize: 28, fontWeight: 700, marginBottom: 8, fontFamily: "Georgia, serif" }}>Learner</div>
          <div style={{ color: "rgba(196,181,253,0.7)", fontSize: 13, marginBottom: 20 }}>has successfully completed</div>
          <div style={{ color: "#c4b5fd", fontSize: 20, fontWeight: 600, marginBottom: 20 }}>{quiz.title}</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 40, marginBottom: 24 }}>
            <div>
              <div style={{ color: "#a78bfa", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>Score</div>
              <div style={{ color: "#fff", fontSize: 24, fontWeight: 700 }}>{result.percentage}%</div>
            </div>
            <div>
              <div style={{ color: "#a78bfa", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>Grade</div>
              <div style={{ color: "#fff", fontSize: 24, fontWeight: 700 }}>{rank.label}</div>
            </div>
            <div>
              <div style={{ color: "#a78bfa", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>Date</div>
              <div style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginTop: 4 }}>{date}</div>
            </div>
          </div>
          <div style={{ color: "rgba(167,139,250,0.5)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>QuizMaster Platform • Verified Achievement</div>
        </div>
        <div style={{ display: "flex", gap: 12, padding: "16px 8px 8px" }}>
          <button onClick={onClose} style={{ flex: 1, padding: "10px 0", border: "1px solid #e5e7eb", borderRadius: 10, background: "#fff", cursor: "pointer", fontSize: 14, color: "#374151" }}>Close</button>
          <button onClick={() => { alert("In a real app, this would download your certificate as PDF!"); }} style={{ flex: 2, padding: "10px 0", border: "none", borderRadius: 10, background: "linear-gradient(135deg, #7c3aed, #6d28d9)", cursor: "pointer", fontSize: 14, color: "#fff", fontWeight: 600 }}>⬇ Download Certificate</button>
        </div>
      </div>
    </div>
  );
}

function ResultScreen({ result, quiz, onRetry, onHome }) {
  const [showCert, setShowCert] = useState(false);
  const rank = getRank(result.percentage);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (result.percentage / 100) * circumference;

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7ff", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      {showCert && <CertificateModal result={result} quiz={quiz} onClose={() => setShowCert(false)} />}
      <div style={{ maxWidth: 520, width: "100%" }}>
        <div style={{ background: "#fff", borderRadius: 24, padding: "40px 32px", boxShadow: "0 4px 24px rgba(124,58,237,0.08)", textAlign: "center", marginBottom: 16 }}>
          <svg width="130" height="130" style={{ marginBottom: 20 }}>
            <circle cx="65" cy="65" r="54" fill="none" stroke="#ede9fe" strokeWidth="8" />
            <circle cx="65" cy="65" r="54" fill="none" stroke={rank.color} strokeWidth="8"
              strokeDasharray={circumference} strokeDashoffset={offset}
              strokeLinecap="round" transform="rotate(-90 65 65)"
              style={{ transition: "stroke-dashoffset 1s ease" }} />
            <text x="65" y="60" textAnchor="middle" fontSize="28" fontWeight="700" fill={rank.color}>{result.percentage}%</text>
            <text x="65" y="78" textAnchor="middle" fontSize="12" fill="#6b7280">Score</text>
          </svg>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#1f2937", marginBottom: 4 }}>{rank.label}!</div>
          <div style={{ color: "#6b7280", fontSize: 14, marginBottom: 28 }}>
            You answered {result.correct} out of {result.total} questions correctly
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 28 }}>
            {[
              { label: "Correct", value: result.correct, color: "#059669", bg: "#ecfdf5" },
              { label: "Wrong", value: result.wrong, color: "#dc2626", bg: "#fef2f2" },
              { label: "Time", value: `${result.timeUsed}s`, color: "#7c3aed", bg: "#f5f3ff" },
            ].map(s => (
              <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: "12px 8px" }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
          {result.percentage >= 60 && (
            <button onClick={() => setShowCert(true)} style={{ width: "100%", padding: "12px 0", background: "linear-gradient(135deg, #7c3aed, #6d28d9)", border: "none", borderRadius: 12, color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", marginBottom: 12 }}>
              🏆 View Certificate
            </button>
          )}
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={onRetry} style={{ flex: 1, padding: "11px 0", border: "1.5px solid #7c3aed", borderRadius: 12, background: "#fff", color: "#7c3aed", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Retry Quiz</button>
            <button onClick={onHome} style={{ flex: 1, padding: "11px 0", border: "none", borderRadius: 12, background: "#f3f4f6", color: "#374151", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Home</button>
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 20, padding: "24px 28px", boxShadow: "0 4px 24px rgba(124,58,237,0.06)" }}>
          <div style={{ fontWeight: 600, color: "#1f2937", marginBottom: 16, fontSize: 15 }}>Question Review</div>
          {quiz.questions.map((q, i) => {
            const userAns = result.answers[i];
            const isCorrect = userAns === q.correct;
            return (
              <div key={q.id} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: i < quiz.questions.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
                  <span style={{ fontSize: 16 }}>{isCorrect ? "✅" : "❌"}</span>
                  <span style={{ fontSize: 14, color: "#374151", flex: 1 }}>{q.text}</span>
                </div>
                <div style={{ marginLeft: 24, fontSize: 13 }}>
                  {!isCorrect && userAns !== undefined && <div style={{ color: "#dc2626" }}>Your answer: {q.options[userAns]}</div>}
                  {!isCorrect && <div style={{ color: "#059669" }}>Correct: {q.options[q.correct]}</div>}
                  {isCorrect && <div style={{ color: "#059669" }}>{q.options[q.correct]}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function QuizScreen({ quiz, onFinish }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(quiz.duration * 60);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const startTime = useRef(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timer); submitQuiz(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const submitQuiz = useCallback(() => {
    const totalTime = Math.floor((Date.now() - startTime.current) / 1000);
    const correct = quiz.questions.filter((q, i) => answers[i] === q.correct).length;
    const wrong = Object.keys(answers).length - correct;
    onFinish({
      correct, wrong,
      total: quiz.questions.length,
      percentage: Math.round((correct / quiz.questions.length) * 100),
      timeUsed: totalTime,
      answers,
    });
  }, [answers, quiz, onFinish]);

  const handleSelect = (idx) => { if (!confirmed) setSelected(idx); };
  const handleConfirm = () => {
    if (selected === null) return;
    setAnswers(prev => ({ ...prev, [current]: selected }));
    setConfirmed(true);
  };
  const handleNext = () => {
    if (current < quiz.questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(answers[current + 1] ?? null);
      setConfirmed(answers[current + 1] !== undefined);
    } else {
      submitQuiz();
    }
  };

  const q = quiz.questions[current];
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const progress = ((current) / quiz.questions.length) * 100;
  const isLow = timeLeft < 60;

  const optionColors = (idx) => {
    if (!confirmed) {
      return selected === idx
        ? { bg: "#ede9fe", border: "#7c3aed", text: "#4c1d95" }
        : { bg: "#fff", border: "#e5e7eb", text: "#374151" };
    }
    if (idx === q.correct) return { bg: "#ecfdf5", border: "#059669", text: "#065f46" };
    if (idx === selected && idx !== q.correct) return { bg: "#fef2f2", border: "#dc2626", text: "#7f1d1d" };
    return { bg: "#fff", border: "#e5e7eb", text: "#9ca3af" };
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7ff", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #ede9fe", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontWeight: 700, color: "#1f2937", fontSize: 15 }}>{quiz.title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: isLow ? "#fef2f2" : "#f5f3ff", padding: "6px 14px", borderRadius: 20, border: `1px solid ${isLow ? "#fca5a5" : "#ddd6fe"}` }}>
          <span style={{ fontSize: 16 }}>{isLow ? "⏰" : "⏱"}</span>
          <span style={{ fontWeight: 700, fontSize: 15, color: isLow ? "#dc2626" : "#7c3aed", fontVariantNumeric: "tabular-nums" }}>
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </span>
        </div>
      </div>
      <div style={{ height: 4, background: "#ede9fe" }}>
        <div style={{ height: "100%", background: "#7c3aed", width: `${progress}%`, transition: "width 0.3s ease" }} />
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "32px 16px" }}>
        <div style={{ maxWidth: 600, width: "100%" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
            {quiz.questions.map((_, i) => (
              <div key={i} onClick={() => { setCurrent(i); setSelected(answers[i] ?? null); setConfirmed(answers[i] !== undefined); }}
                style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, cursor: "pointer",
                  background: answers[i] !== undefined ? "#7c3aed" : i === current ? "#ede9fe" : "#f3f4f6",
                  color: answers[i] !== undefined ? "#fff" : i === current ? "#7c3aed" : "#6b7280",
                  border: i === current ? "2px solid #7c3aed" : "2px solid transparent" }}>
                {i + 1}
              </div>
            ))}
          </div>
          <div style={{ background: "#fff", borderRadius: 20, padding: "28px 28px 24px", boxShadow: "0 4px 24px rgba(124,58,237,0.07)", marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: "#7c3aed", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>
              Question {current + 1} of {quiz.questions.length}
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#1f2937", lineHeight: 1.5, marginBottom: 24 }}>{q.text}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {q.options.map((opt, idx) => {
                const c = optionColors(idx);
                return (
                  <div key={idx} onClick={() => handleSelect(idx)}
                    style={{ padding: "13px 16px", borderRadius: 12, border: `1.5px solid ${c.border}`, background: c.bg, color: c.text, cursor: confirmed ? "default" : "pointer", display: "flex", alignItems: "center", gap: 12, transition: "all 0.15s ease", fontSize: 14, fontWeight: 500 }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", border: `2px solid ${c.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, background: selected === idx || (confirmed && idx === q.correct) ? c.border : "transparent", color: selected === idx || (confirmed && idx === q.correct) ? "#fff" : c.border }}>
                      {confirmed && idx === q.correct ? "✓" : confirmed && idx === selected && idx !== q.correct ? "✗" : String.fromCharCode(65 + idx)}
                    </div>
                    {opt}
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {!confirmed ? (
              <button onClick={handleConfirm} disabled={selected === null}
                style={{ flex: 1, padding: "13px 0", background: selected !== null ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : "#e5e7eb", border: "none", borderRadius: 12, color: selected !== null ? "#fff" : "#9ca3af", fontWeight: 600, fontSize: 15, cursor: selected !== null ? "pointer" : "not-allowed" }}>
                Confirm Answer
              </button>
            ) : (
              <button onClick={handleNext}
                style={{ flex: 1, padding: "13px 0", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", border: "none", borderRadius: 12, color: "#fff", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>
                {current < quiz.questions.length - 1 ? "Next Question →" : "View Results →"}
              </button>
            )}
            {!confirmed && (
              <button onClick={submitQuiz} style={{ padding: "13px 20px", background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 12, color: "#6b7280", fontWeight: 500, fontSize: 14, cursor: "pointer" }}>
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateQuiz({ onSave, onCancel }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General Knowledge");
  const [duration, setDuration] = useState(10);
  const [questions, setQuestions] = useState([{ text: "", options: ["", "", "", ""], correct: 0 }]);

  const addQuestion = () => setQuestions(q => [...q, { text: "", options: ["", "", "", ""], correct: 0 }]);
  const removeQuestion = (i) => setQuestions(q => q.filter((_, idx) => idx !== i));
  const updateQuestion = (i, field, val) => setQuestions(q => q.map((item, idx) => idx === i ? { ...item, [field]: val } : item));
  const updateOption = (qi, oi, val) => setQuestions(q => q.map((item, idx) => idx === qi ? { ...item, options: item.options.map((o, j) => j === oi ? val : o) } : item));

  const handleSave = () => {
    if (!title.trim() || questions.some(q => !q.text.trim() || q.options.some(o => !o.trim()))) {
      alert("Please fill in all fields before saving.");
      return;
    }
    onSave({ id: Date.now(), title, category, duration, questions: questions.map((q, i) => ({ ...q, id: i + 1 })), attempts: 0, topScore: 0, avgScore: 0 });
  };

  return (
    <div style={{ padding: "24px 16px", maxWidth: 680, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button onClick={onCancel} style={{ padding: "8px 16px", border: "1.5px solid #e5e7eb", borderRadius: 10, background: "#fff", cursor: "pointer", fontSize: 14 }}>← Back</button>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1f2937" }}>Create New Quiz</h2>
      </div>
      <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 4px 20px rgba(124,58,237,0.07)", marginBottom: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Quiz Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter quiz title..." style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 14, background: "#fff" }}>
              {["General Knowledge", "Programming", "Science", "Mathematics", "History", "Language"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Duration: {duration} min</label>
            <input type="range" min={2} max={60} value={duration} onChange={e => setDuration(+e.target.value)} style={{ width: "100%" }} />
          </div>
        </div>
      </div>
      {questions.map((q, qi) => (
        <div key={qi} style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 4px 20px rgba(124,58,237,0.07)", marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span style={{ fontWeight: 700, color: "#7c3aed", fontSize: 13 }}>Question {qi + 1}</span>
            {questions.length > 1 && <button onClick={() => removeQuestion(qi)} style={{ background: "#fef2f2", border: "none", color: "#dc2626", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: 12 }}>Remove</button>}
          </div>
          <input value={q.text} onChange={e => updateQuestion(qi, "text", e.target.value)} placeholder="Enter question text..." style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 14, marginBottom: 12, outline: "none", boxSizing: "border-box" }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {q.options.map((opt, oi) => (
              <div key={oi} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="radio" name={`correct-${qi}`} checked={q.correct === oi} onChange={() => updateQuestion(qi, "correct", oi)} style={{ accentColor: "#7c3aed" }} />
                <input value={opt} onChange={e => updateOption(qi, oi, e.target.value)} placeholder={`Option ${String.fromCharCode(65 + oi)}`} style={{ flex: 1, padding: "8px 12px", border: `1.5px solid ${q.correct === oi ? "#7c3aed" : "#e5e7eb"}`, borderRadius: 8, fontSize: 13, outline: "none" }} />
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 8 }}>● Select the correct answer</div>
        </div>
      ))}
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={addQuestion} style={{ flex: 1, padding: "12px 0", background: "#f5f3ff", border: "1.5px dashed #c4b5fd", borderRadius: 12, color: "#7c3aed", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>+ Add Question</button>
        <button onClick={handleSave} style={{ flex: 2, padding: "12px 0", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", border: "none", borderRadius: 12, color: "#fff", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>Save & Publish Quiz</button>
      </div>
    </div>
  );
}

function Leaderboard() {
  return (
    <div style={{ padding: "0 16px" }}>
      <div style={{ background: "linear-gradient(135deg,#4c1d95,#6d28d9)", borderRadius: 20, padding: "28px 24px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -20, top: -20, width: 120, height: 120, background: "rgba(255,255,255,0.06)", borderRadius: "50%" }} />
        <div style={{ fontSize: 28, marginBottom: 8 }}>🏆</div>
        <div style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>Leaderboard</div>
        <div style={{ color: "#c4b5fd", fontSize: 13, marginTop: 4 }}>Top performers this month</div>
      </div>
      <div style={{ background: "#fff", borderRadius: 20, padding: "8px 0", boxShadow: "0 4px 24px rgba(124,58,237,0.07)" }}>
        {LEADERBOARD.map((entry) => (
          <div key={entry.rank} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", background: entry.isUser ? "#f5f3ff" : "transparent", borderLeft: entry.isUser ? "3px solid #7c3aed" : "3px solid transparent" }}>
            <div style={{ width: 32, textAlign: "center", fontSize: entry.rank <= 3 ? 20 : 14, fontWeight: 700, color: entry.rank === 1 ? "#f59e0b" : entry.rank === 2 ? "#6b7280" : entry.rank === 3 ? "#d97706" : "#9ca3af" }}>
              {entry.rank <= 3 ? ["🥇", "🥈", "🥉"][entry.rank - 1] : entry.rank}
            </div>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: entry.isUser ? "#7c3aed" : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: entry.isUser ? "#fff" : "#4b5563", flexShrink: 0 }}>
              {entry.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: entry.isUser ? "#7c3aed" : "#1f2937", fontSize: 14 }}>{entry.name} {entry.isUser && <span style={{ fontSize: 11, background: "#ede9fe", color: "#7c3aed", padding: "2px 8px", borderRadius: 10, marginLeft: 4 }}>You</span>}</div>
              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{entry.quizzes} quizzes • {entry.streak} day streak 🔥</div>
            </div>
            <div style={{ fontWeight: 700, fontSize: 18, color: "#1f2937" }}>{entry.score}<span style={{ fontSize: 12, color: "#6b7280", fontWeight: 400 }}>%</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Analytics() {
  const maxWeekly = Math.max(...ANALYTICS.weeklyData);
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const maxScore = Math.max(...ANALYTICS.scoreDistribution);
  const scoreLabels = ["0-19", "20-39", "40-59", "60-74", "75-89", "90-100"];
  const scoreColors = ["#fca5a5", "#fdba74", "#fcd34d", "#6ee7b7", "#5eead4", "#7c3aed"];

  return (
    <div style={{ padding: "0 16px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Total Attempts", value: ANALYTICS.totalAttempts, icon: "📊", color: "#7c3aed", bg: "#f5f3ff" },
          { label: "Avg Score", value: `${ANALYTICS.avgScore}%`, icon: "🎯", color: "#059669", bg: "#ecfdf5" },
          { label: "Completion Rate", value: `${ANALYTICS.completionRate}%`, icon: "✅", color: "#d97706", bg: "#fef3c7" },
          { label: "Top Category", value: ANALYTICS.topCategory, icon: "🌟", color: "#0284c7", bg: "#e0f2fe" },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 16, padding: "16px 14px" }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "#fff", borderRadius: 20, padding: 20, boxShadow: "0 4px 20px rgba(124,58,237,0.07)", marginBottom: 16 }}>
        <div style={{ fontWeight: 700, color: "#1f2937", fontSize: 15, marginBottom: 16 }}>Weekly Activity</div>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 100 }}>
          {ANALYTICS.weeklyData.map((v, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: "100%", background: "linear-gradient(to top,#7c3aed,#a78bfa)", borderRadius: "6px 6px 0 0", height: `${(v / maxWeekly) * 80}px`, minHeight: 6 }} />
              <div style={{ fontSize: 11, color: "#9ca3af" }}>{days[i]}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "#fff", borderRadius: 20, padding: 20, boxShadow: "0 4px 20px rgba(124,58,237,0.07)", marginBottom: 16 }}>
        <div style={{ fontWeight: 700, color: "#1f2937", fontSize: 15, marginBottom: 16 }}>Score Distribution</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {ANALYTICS.scoreDistribution.map((v, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 11, color: "#6b7280", width: 44, textAlign: "right" }}>{scoreLabels[i]}</div>
              <div style={{ flex: 1, height: 20, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(v / maxScore) * 100}%`, background: scoreColors[i], borderRadius: 4, transition: "width 0.6s ease" }} />
              </div>
              <div style={{ fontSize: 11, color: "#6b7280", width: 20 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "#fff", borderRadius: 20, padding: 20, boxShadow: "0 4px 20px rgba(124,58,237,0.07)" }}>
        <div style={{ fontWeight: 700, color: "#1f2937", fontSize: 15, marginBottom: 16 }}>Category Breakdown</div>
        {ANALYTICS.categoryData.map((c, i) => {
          const colors = ["#7c3aed", "#059669", "#d97706"];
          return (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#374151", marginBottom: 6 }}>
                <span>{c.name}</span><span style={{ fontWeight: 600 }}>{c.value}%</span>
              </div>
              <div style={{ height: 8, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${c.value}%`, background: colors[i], borderRadius: 4 }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("home");
  const [quizzes, setQuizzes] = useState(SAMPLE_QUIZZES);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [creating, setCreating] = useState(false);

  if (creating) return <CreateQuiz onSave={(q) => { setQuizzes(prev => [...prev, q]); setCreating(false); }} onCancel={() => setCreating(false)} />;
  if (activeQuiz && !quizResult) return <QuizScreen quiz={activeQuiz} onFinish={(r) => setQuizResult(r)} />;
  if (activeQuiz && quizResult) return <ResultScreen result={quizResult} quiz={activeQuiz} onRetry={() => setQuizResult(null)} onHome={() => { setActiveQuiz(null); setQuizResult(null); }} />;

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7ff", paddingBottom: 80 }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #ede9fe", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#7c3aed,#4c1d95)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📝</div>
          <span style={{ fontWeight: 800, fontSize: 17, color: "#1f2937" }}>QuizMaster</span>
        </div>
        <button onClick={() => setCreating(true)} style={{ padding: "7px 16px", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", border: "none", borderRadius: 20, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>+ Create Quiz</button>
      </div>

      <div style={{ padding: "20px 16px" }}>
        {tab === "home" && (
          <>
            <div style={{ background: "linear-gradient(135deg,#3730a3,#6d28d9,#7c3aed)", borderRadius: 20, padding: "28px 24px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: -30, bottom: -30, width: 150, height: 150, background: "rgba(255,255,255,0.07)", borderRadius: "50%" }} />
              <div style={{ color: "#c4b5fd", fontSize: 13, marginBottom: 6 }}>Welcome back! 👋</div>
              <div style={{ color: "#fff", fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Ready to test your knowledge?</div>
              <div style={{ color: "#a5b4fc", fontSize: 13 }}>{quizzes.length} quizzes available • Compete globally</div>
            </div>
            <div style={{ fontWeight: 700, color: "#1f2937", fontSize: 16, marginBottom: 14 }}>Available Quizzes</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {quizzes.map(quiz => {
                const catColors = { "Programming": { bg: "#ede9fe", text: "#7c3aed" }, "General Knowledge": { bg: "#e0f2fe", text: "#0284c7" }, "Science": { bg: "#ecfdf5", text: "#059669" }, "Mathematics": { bg: "#fef3c7", text: "#d97706" }, "History": { bg: "#fce7f3", text: "#db2777" }, "Language": { bg: "#fff1f2", text: "#e11d48" } };
                const cc = catColors[quiz.category] || { bg: "#f3f4f6", text: "#6b7280" };
                return (
                  <div key={quiz.id} style={{ background: "#fff", borderRadius: 18, padding: "18px 18px 16px", boxShadow: "0 4px 16px rgba(124,58,237,0.06)", border: "1px solid #ede9fe" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div style={{ flex: 1, paddingRight: 12 }}>
                        <div style={{ fontWeight: 700, color: "#1f2937", fontSize: 16, marginBottom: 4 }}>{quiz.title}</div>
                        <span style={{ background: cc.bg, color: cc.text, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 10 }}>{quiz.category}</span>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: 22, fontWeight: 800, color: "#7c3aed" }}>{quiz.questions.length}</div>
                        <div style={{ fontSize: 11, color: "#9ca3af" }}>questions</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
                      {[
                        { icon: "⏱", label: `${quiz.duration} min` },
                        { icon: "👥", label: `${quiz.attempts} attempts` },
                        { icon: "📈", label: `${quiz.avgScore}% avg` },
                      ].map(s => (
                        <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#6b7280" }}>
                          <span>{s.icon}</span><span>{s.label}</span>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => { setActiveQuiz(quiz); setQuizResult(null); }}
                      style={{ width: "100%", padding: "11px 0", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", border: "none", borderRadius: 12, color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                      Start Quiz →
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
        {tab === "leaderboard" && <Leaderboard />}
        {tab === "analytics" && <Analytics />}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #ede9fe", display: "flex", padding: "6px 0 10px" }}>
        {[
          { id: "home", icon: "🏠", label: "Home" },
          { id: "leaderboard", icon: "🏆", label: "Leaders" },
          { id: "analytics", icon: "📊", label: "Analytics" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "6px 0" }}>
            <span style={{ fontSize: 22 }}>{t.icon}</span>
            <span style={{ fontSize: 11, fontWeight: tab === t.id ? 700 : 400, color: tab === t.id ? "#7c3aed" : "#9ca3af" }}>{t.label}</span>
            {tab === t.id && <div style={{ width: 20, height: 3, background: "#7c3aed", borderRadius: 2, marginTop: 1 }} />}
          </button>
        ))}
      </div>
    </div>
  );
}
