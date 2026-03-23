import { useState, useEffect } from 'react';
import { FaSyncAlt, FaShareAlt, FaList, FaTimes, FaPlus, FaCheck } from 'react-icons/fa';
import { Analytics } from '@vercel/analytics/react';
import SlangCard from './components/SlangCard';
import SlangList from './components/SlangList';
import slangs from './data/slang.json';
import { supabase } from './lib/supabaseClient';

/* ── Seed requests so there's always activity showing ── */
const SEED_REQUESTS = [
  { id: 1, slang: '억까', reason: 'I keep seeing this in Korean football communities. I think it means forcing criticism on someone?', time: '2 min ago' },
  { id: 2, slang: '금사빠', reason: 'My friend said she is a 금사빠 and got a new boyfriend. What does it mean? 😂', time: '11 min ago' },
  { id: 3, slang: '알잘딱깔센', reason: 'My senior at work said "do it 알잘딱깔센" — I had no idea what they meant!', time: '34 min ago' },
  { id: 4, slang: '쩐다', reason: 'Seems similar to 대박 but with a different nuance. What\'s the difference?', time: '1 hour ago' },
  { id: 5, slang: '빼박캔트', reason: 'Saw it in comment sections multiple times. Is it different from 빼박?', time: '2 hours ago' },
];

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState('card');
  const [showModal, setShowModal] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [requests, setRequests] = useState(SEED_REQUESTS);
  const [form, setForm] = useState({ slang: '', reason: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      const { data, error } = await supabase
        .from('slang_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (!error && data && data.length > 0) {
        const formattedData = data.map(req => {
          const date = new Date(req.created_at);
          const diffStr = (Date.now() - date.getTime() < 86400000) ? '오늘' : date.toLocaleDateString();
          return {
            id: req.id,
            slang: req.slang,
            reason: req.reason,
            time: diffStr
          };
        });
        setRequests(formattedData);
      }
    };
    
    fetchRequests();
  }, []);

  const nextSlang = () => {
    let next;
    do { next = Math.floor(Math.random() * slangs.length); }
    while (next === currentIndex && slangs.length > 1);
    setCurrentIndex(next);
  };

  /* ── Share: copy URL to clipboard ── */
  const handleShare = async () => {
    const slang = slangs[currentIndex];
    const url = `${window.location.origin}${window.location.pathname}?slang=${encodeURIComponent(slang.korean)}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  };

  /* ── Submit slang request ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.slang.trim()) return;
    
    const slangVal = form.slang.trim();
    const reasonVal = form.reason.trim();
    const optimisticReq = {
      id: Date.now(),
      slang: slangVal,
      reason: reasonVal,
      time: '방금 전',
    };
    
    // Optimistic UI update
    setRequests(prev => [optimisticReq, ...prev]);

    // Insert to Supabase DB (silently fails if not configured, which is fine for fallback)
    await supabase.from('slang_requests').insert([
      { slang: slangVal, reason: reasonVal }
    ]);

    setSubmitted(true);
    setForm({ slang: '', reason: '' });
    setTimeout(() => { setSubmitted(false); setShowModal(false); }, 1800);
  };

  const toggleView = () => setViewMode(v => v === 'card' ? 'list' : 'card');

  return (
    <div className="app">

      {/* ════ HEADER ════ */}
      <header className="a-header">
        <h1 className="a-logo">Klang</h1>
        <button className="a-icon-btn" onClick={toggleView} aria-label="toggle view">
          {viewMode === 'card' ? <FaList /> : <FaTimes />}
        </button>
      </header>

      {/* ════ MAIN ════ */}
      <main className="a-main">
        {viewMode === 'list' ? (
          <SlangList slangs={slangs} onSelect={(i) => { setCurrentIndex(i); setViewMode('card'); }} />
        ) : (
          <>
            {/* Card */}
            <div className="a-card-wrap animate-in" key={currentIndex}>
              <SlangCard slang={slangs[currentIndex]} />
            </div>

            {/* ── Community requests feed ── */}
            <section className="a-feed">
              <div className="a-feed-header">
                <span className="a-feed-title">🙋 Slang Requests</span>
                <span className="a-feed-sub">What people want to learn</span>
              </div>
              <div className="a-feed-list">
                {requests.slice(0, 5).map(r => (
                  <div key={r.id} className="a-feed-item">
                    <div className="a-feed-top">
                      <span className="a-feed-slang">{r.slang}</span>
                      <span className="a-feed-time">{r.time}</span>
                    </div>
                    {r.reason && <p className="a-feed-reason">"{r.reason}"</p>}
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      {/* ════ FOOTER (card mode only) ════ */}
      {viewMode === 'card' && (
        <footer className="a-footer">
          {/* Share → copy URL */}
          <button className="a-btn a-btn-ghost" onClick={handleShare} aria-label="share">
            {shareToast ? <FaCheck style={{ color: '#2D9C57' }} /> : <FaShareAlt />}
          </button>

          {/* + Request */}
          <button className="a-btn a-btn-plus" onClick={() => setShowModal(true)} aria-label="request slang">
            <FaPlus />
          </button>

          {/* Next */}
          <button className="a-btn a-btn-primary" onClick={nextSlang} aria-label="next">
            <FaSyncAlt />
          </button>
        </footer>
      )}

      {/* ════ SHARE TOAST ════ */}
      {shareToast && (
        <div className="a-toast">
          🔗 Link copied to clipboard!
        </div>
      )}

      {/* ════ REQUEST MODAL ════ */}
      {showModal && (
        <div className="a-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="a-modal">
            {submitted ? (
              <div className="a-modal-done">
                <div className="a-modal-done-icon">✅</div>
                <p className="a-modal-done-text">Request received!<br />We'll review and add it soon 😊</p>
              </div>
            ) : (
              <>
                <div className="a-modal-top">
                  <div>
                    <h2 className="a-modal-title">Request a Slang</h2>
                    <p className="a-modal-desc">Tell us what you want to learn</p>
                  </div>
                  <button className="a-modal-close" onClick={() => setShowModal(false)}><FaTimes /></button>
                </div>

                <form onSubmit={handleSubmit} className="a-form">
                  <div className="a-field">
                    <label className="a-field-label">Slang *</label>
                    <input
                      className="a-input"
                      placeholder="e.g. 억까, 금사빠..."
                      value={form.slang}
                      onChange={e => setForm(f => ({ ...f, slang: e.target.value }))}
                      maxLength={30}
                      required
                    />
                  </div>
                  <div className="a-field">
                    <label className="a-field-label">Where did you see it? (optional)</label>
                    <textarea
                      className="a-textarea"
                      placeholder="Describe where and how it was used..."
                      value={form.reason}
                      onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                      maxLength={200}
                      rows={3}
                    />
                  </div>
                  <button type="submit" className="a-submit">Send Request</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        /* ── Layout ── */
        .app {
          max-width: 480px;
          margin: 0 auto;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #F6F7F9;
          position: relative;
        }

        /* ── Header ── */
        .a-header {
          padding: 18px 20px 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 10;
          background: #F6F7F9;
        }
        .a-logo {
          font-size: 1.7rem;
          font-weight: 900;
          letter-spacing: -0.05em;
          color: #111;
        }
        .a-icon-btn {
          width: 38px; height: 38px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%;
          font-size: 1.1rem;
          color: #555;
          transition: background 0.15s;
        }
        .a-icon-btn:hover { background: rgba(0,0,0,0.06); }

        /* ── Main ── */
        .a-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding-bottom: 110px;
        }

        /* ── Card wrapper ── */
        .a-card-wrap {
          padding: 8px 16px 0;
        }
        .animate-in {
          animation: cardIn 0.45s cubic-bezier(0.23, 1, 0.32, 1) both;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(18px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ── Community Feed ── */
        .a-feed {
          margin: 20px 16px 0;
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 2px 16px rgba(0,0,0,0.05);
          border: 1px solid rgba(0,0,0,0.04);
        }
        .a-feed-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 16px 10px;
          border-bottom: 1px solid #F0F0F0;
        }
        .a-feed-title {
          font-size: 0.82rem;
          font-weight: 800;
          color: #222;
        }
        .a-feed-sub {
          font-size: 0.72rem;
          color: #bbb;
        }
        .a-feed-list {
          display: flex;
          flex-direction: column;
          divide-y: 1px solid #f5f5f5;
        }
        .a-feed-item {
          padding: 11px 16px;
          border-bottom: 1px solid #F7F7F7;
        }
        .a-feed-item:last-child { border-bottom: none; }
        .a-feed-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3px;
        }
        .a-feed-slang {
          font-size: 0.88rem;
          font-weight: 700;
          color: #111;
        }
        .a-feed-time {
          font-size: 0.68rem;
          color: #ccc;
        }
        .a-feed-reason {
          font-size: 0.78rem;
          color: #888;
          line-height: 1.45;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ── Footer ── */
        .a-footer {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          max-width: 480px;
          margin: 0 auto;
          padding: 16px 28px 36px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(to top, #F6F7F9 70%, transparent);
          pointer-events: none;
        }
        .a-btn {
          width: 58px; height: 58px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.25rem;
          box-shadow: 0 6px 20px rgba(0,0,0,0.10);
          pointer-events: auto;
          transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
        }
        .a-btn:active { transform: scale(0.88); }
        .a-btn-ghost {
          background: #fff;
          color: #555;
        }
        .a-btn-plus {
          background: #fff;
          color: #FF007F;
          font-size: 1.1rem;
          border: 2px solid rgba(255,0,127,0.15);
        }
        .a-btn-primary {
          background: #FF007F;
          color: #fff;
          font-size: 1.4rem;
          box-shadow: 0 8px 24px rgba(255,0,127,0.35);
        }

        /* ── Toast ── */
        .a-toast {
          position: fixed;
          bottom: 110px;
          left: 50%; transform: translateX(-50%);
          background: #111;
          color: #fff;
          font-size: 0.82rem;
          font-weight: 600;
          padding: 10px 20px;
          border-radius: 99px;
          white-space: nowrap;
          z-index: 100;
          animation: toastIn 0.3s ease;
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        /* ── Modal overlay ── */
        .a-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: flex-end;
          z-index: 200;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        /* ── Modal sheet ── */
        .a-modal {
          width: 100%;
          max-width: 480px;
          margin: 0 auto;
          background: #fff;
          border-radius: 28px 28px 0 0;
          padding: 24px 20px 40px;
          animation: slideUp 0.35s cubic-bezier(0.23,1,0.32,1);
          min-height: 200px;
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        .a-modal-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }
        .a-modal-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #111;
          margin-bottom: 3px;
        }
        .a-modal-desc {
          font-size: 0.8rem;
          color: #aaa;
        }
        .a-modal-close {
          color: #bbb;
          font-size: 1rem;
          padding: 4px;
        }

        /* ── Form ── */
        .a-form { display: flex; flex-direction: column; gap: 14px; }
        .a-field { display: flex; flex-direction: column; gap: 5px; }
        .a-field-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #555;
          letter-spacing: 0.03em;
        }
        .a-input, .a-textarea {
          border: 1.5px solid #EBEBEB;
          border-radius: 14px;
          padding: 12px 14px;
          font-size: 0.95rem;
          font-family: inherit;
          color: #111;
          outline: none;
          transition: border-color 0.2s;
          resize: none;
          background: #FAFAFA;
        }
        .a-input:focus, .a-textarea:focus {
          border-color: #FF007F;
          background: #fff;
        }
        .a-submit {
          background: #FF007F;
          color: #fff;
          font-size: 0.95rem;
          font-weight: 700;
          padding: 14px;
          border-radius: 14px;
          margin-top: 4px;
          transition: opacity 0.2s;
          font-family: inherit;
        }
        .a-submit:hover { opacity: 0.88; }

        /* ── Done state ── */
        .a-modal-done {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 30px 0 10px;
          gap: 12px;
        }
        .a-modal-done-icon { font-size: 2.5rem; }
        .a-modal-done-text {
          font-size: 0.95rem;
          font-weight: 600;
          color: #333;
          text-align: center;
          line-height: 1.6;
        }
      `}</style>
      <Analytics />
    </div>
  );
}

export default App;
