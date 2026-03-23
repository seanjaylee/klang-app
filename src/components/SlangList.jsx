import React, { useState } from 'react';

const SlangList = ({ slangs, onSelect }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const categories = ['All', ...new Set(slangs.map(s => s.theme).filter(Boolean))];

    const filteredSlangs = slangs
        .map((slang, index) => ({ ...slang, originalIndex: index }))
        .filter(slang => selectedCategory === 'All' || slang.theme === selectedCategory);

    return (
        <div className="slang-list-container">
            <h2 className="list-title">All Slangs</h2>
            <div className="category-filter-wrap">
                {categories.map(cat => (
                    <button 
                        key={cat} 
                        className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            <div className="list-grid">
                {filteredSlangs.map((slang) => (
                    <div key={slang.id} className="list-item" onClick={() => onSelect(slang.originalIndex)}>
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
            margin-bottom: 12px;
            font-weight: 800;
        }
        .category-filter-wrap {
            display: flex;
            gap: 8px;
            overflow-x: auto;
            padding-bottom: 16px;
            margin-bottom: 4px;
            scrollbar-width: none; /* Firefox */
        }
        .category-filter-wrap::-webkit-scrollbar {
            display: none; /* Safari and Chrome */
        }
        .category-chip {
            padding: 8px 16px;
            border-radius: 99px;
            background: #fff;
            border: 1px solid #EBEBEB;
            font-size: 0.85rem;
            font-weight: 600;
            color: #777;
            white-space: nowrap;
            cursor: pointer;
            transition: all 0.2s;
        }
        .category-chip:hover {
            border-color: #ccc;
            color: #333;
        }
        .category-chip.active {
            background: var(--color-primary, #FF007F);
            color: #fff;
            border-color: var(--color-primary, #FF007F);
            box-shadow: 0 4px 12px rgba(255, 0, 127, 0.2);
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
