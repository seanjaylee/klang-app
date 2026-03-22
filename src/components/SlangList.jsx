import React from 'react';

const SlangList = ({ slangs, onSelect }) => {
    return (
        <div className="slang-list-container">
            <h2 className="list-title">All Slangs</h2>
            <div className="list-grid">
                {slangs.map((slang, index) => (
                    <div key={slang.id} className="list-item" onClick={() => onSelect(index)}>
                        <div className="list-item-main">
                            <span className="list-korean">{slang.korean}</span>
                            <span className="list-romanization">{slang.romanization}</span>
                            {slang.theme && (
                                <span className="list-theme-badge">{slang.theme}</span>
                            )}
                        </div>
                        <p className="list-meaning">{slang.meaning}</p>
                    </div>
                ))}
            </div>
            <style>{`
        .slang-list-container {
            padding: 20px;
            width: 100%;
            max-width: 480px;
            margin: 0 auto;
        }
        .list-title {
            font-size: 1.5rem;
            margin-bottom: 20px;
            font-weight: 800;
        }
        .list-grid {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .list-item {
            background: white;
            padding: 16px;
            border-radius: 16px;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            border: 1px solid rgba(0,0,0,0.05);
        }
        .list-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        }
        .list-item-main {
            display: flex;
            align-items: baseline;
            gap: 8px;
            margin-bottom: 4px;
        }
        .list-korean {
            font-size: 1.25rem;
            font-weight: 800;
        }
        .list-romanization {
            font-size: 0.9rem;
            color: var(--color-primary);
            font-weight: 600;
        }
        .list-theme-badge {
            font-size: 0.65rem;
            font-weight: 700;
            color: var(--color-primary);
            background: rgba(255, 0, 127, 0.08);
            border: 1px solid rgba(255, 0, 127, 0.15);
            padding: 2px 8px;
            border-radius: 99px;
            letter-spacing: 0.04em;
            margin-left: auto;
            white-space: nowrap;
        }
        .list-meaning {
            font-size: 0.9rem;
            color: #666;
            line-height: 1.4;
        }
      `}</style>
        </div>
    );
};

export default SlangList;
