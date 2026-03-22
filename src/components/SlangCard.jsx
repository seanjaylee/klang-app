import React from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';

/* ─── Theme → accent color map ─────────────────────────── */
const THEME_COLORS = {
  '트렌드 & 라이프스타일': { bg: '#FFF0F7', color: '#FF007F', border: '#FFB3D9' },
  '방송/연예': { bg: '#FFF4E6', color: '#FF8C00', border: '#FFCC88' },
  '직장인/일상': { bg: '#F0F4FF', color: '#4361EE', border: '#A3B4FF' },
  '게임/커뮤니티': { bg: '#F0FFF4', color: '#2D9C57', border: '#90E0AB' },
  '인터넷 밈/신조어': { bg: '#F5F0FF', color: '#7B2FBE', border: '#C9A8FF' },
  'Z세대 트렌드': { bg: '#E6FFFE', color: '#0A9396', border: '#80D5D3' },
  '감정/반응 표현': { bg: '#FFF8E1', color: '#E6A817', border: '#FFD97D' },
};
const DEFAULT_COLOR = { bg: '#F5F5F5', color: '#888', border: '#DDD' };

const SlangCard = ({ slang }) => {
  const accent = THEME_COLORS[slang.theme] || DEFAULT_COLOR;

  return (
    <div className="sc-card">

      {/* ── ① Theme badge ── */}
      {slang.theme && (
        <div
          className="sc-theme"
          style={{ background: accent.bg, color: accent.color, borderColor: accent.border }}
        >
          {slang.theme}
        </div>
      )}

      {/* ── ② Korean word + Romanization ── */}
      <div className="sc-hero">
        <h1 className="sc-korean" style={{ color: accent.color }}>{slang.korean}</h1>
        <p className="sc-roman">{slang.romanization}</p>
      </div>

      {/* ── ③ One-line meaning ── */}
      <div className="sc-meaning-wrap">
        <p className="sc-meaning">{slang.meaning}</p>
      </div>

      {/* ── ④ Divider ── */}
      <div className="sc-divider" />

      {/* ── ⑤ Info rows: Context + Origin ── */}
      <div className="sc-info">
        {slang.context && (
          <div className="sc-row">
            <span className="sc-label">Context</span>
            <p className="sc-value">{slang.context}</p>
          </div>
        )}
        {slang.origin && (
          <div className="sc-row">
            <span className="sc-label">Origin</span>
            <p className="sc-value">{slang.origin}</p>
          </div>
        )}
      </div>

      {/* ── ⑥ Usage example bubble ── */}
      {slang.usageExample?.kr && (
        <div className="sc-example" style={{ borderLeftColor: accent.color }}>
          <span className="sc-example-tag" style={{ color: accent.color }}>Example</span>
          <p className="sc-example-kr">{slang.usageExample.kr}</p>
          {slang.usageExample.en && (
            <p className="sc-example-en">{slang.usageExample.en}</p>
          )}
        </div>
      )}

      {/* ── ⑦ Namu-wiki link ── */}
      {slang.namuWikiLink && (
        <a
          className="sc-wiki"
          href={slang.namuWikiLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: accent.color }}
        >
          <FaExternalLinkAlt style={{ fontSize: '0.65rem' }} />
          Learn more on Namu Wiki
        </a>
      )}

      <style>{`
        /* ── Card shell ── */
        .sc-card {
          background: #fff;
          border-radius: 28px;
          padding: 22px 20px 18px;
          box-shadow: 0 8px 40px -8px rgba(0,0,0,0.13);
          border: 1px solid rgba(0,0,0,0.04);
          display: flex;
          flex-direction: column;
          gap: 0;
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
        }

        /* ── Theme badge ── */
        .sc-theme {
          display: inline-flex;
          align-self: flex-start;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          padding: 3px 10px;
          border-radius: 99px;
          border: 1px solid;
          margin-bottom: 16px;
        }

        /* ── Hero block ── */
        .sc-hero {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          margin-bottom: 10px;
        }
        .sc-korean {
          font-size: 2.8rem;
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.04em;
          margin-bottom: 5px;
        }
        .sc-roman {
          font-size: 0.9rem;
          font-weight: 600;
          color: #aaa;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* ── Meaning ── */
        .sc-meaning-wrap {
          margin-bottom: 16px;
        }
        .sc-meaning {
          font-size: 1rem;
          font-weight: 500;
          line-height: 1.6;
          color: #333;
        }

        /* ── Divider ── */
        .sc-divider {
          height: 1px;
          background: #f0f0f0;
          margin-bottom: 14px;
        }

        /* ── Info rows ── */
        .sc-info {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 10px 12px;
          align-items: start;
          margin-bottom: 14px;
        }
        .sc-row {
          display: contents;
        }
        .sc-label {
          font-size: 0.65rem;
          font-weight: 800;
          color: #bbb;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding-top: 2px;
          white-space: nowrap;
        }
        .sc-value {
          font-size: 0.88rem;
          color: #444;
          line-height: 1.6;
        }

        /* ── Example bubble ── */
        .sc-example {
          background: #FAFAFA;
          border-left: 3px solid;
          border-radius: 0 14px 14px 0;
          padding: 12px 14px;
          margin-bottom: 16px;
        }
        .sc-example-tag {
          display: block;
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 5px;
        }
        .sc-example-kr {
          font-size: 0.92rem;
          font-weight: 600;
          color: #222;
          line-height: 1.55;
          margin-bottom: 3px;
        }
        .sc-example-en {
          font-size: 0.8rem;
          color: #888;
          font-style: italic;
          line-height: 1.45;
        }

        /* ── Wiki link ── */
        .sc-wiki {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.75rem;
          font-weight: 600;
          text-decoration: none;
          opacity: 0.65;
          transition: opacity 0.2s;
          align-self: center;
        }
        .sc-wiki:hover { opacity: 1; }
      `}</style>
    </div>
  );
};

export default SlangCard;
