import React, { useState, useRef, useEffect } from 'react';

interface Option {
  id: string | number;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder: string;
  disabled?: boolean;
}

function SearchableSelect({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get the label of the current selected value
  const selectedLabel = options.find((opt) => opt.id === value)?.label || placeholder;

  // Update dropdown position when it opens and when scrolling
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const updatePosition = () => {
        const rect = buttonRef.current?.getBoundingClientRect();
        if (rect) {
          setDropdownPosition({
            top: rect.bottom,
            left: rect.left,
            width: rect.width,
          });
        }
      };

      // Update position immediately
      updatePosition();

      // Update position on scroll
      window.addEventListener('scroll', updatePosition, true);
      return () => window.removeEventListener('scroll', updatePosition, true);
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionId: string | number) => {
    onChange(optionId);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="searchable-select" ref={containerRef}>
      <button
        ref={buttonRef}
        type="button"
        className={`searchable-select-button ${isOpen ? 'open' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className="select-label" title={selectedLabel}>
          {selectedLabel}
        </span>
        <span className="select-arrow">
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M4.5 6.5L8 10l3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div
          className="searchable-select-dropdown"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
          }}
        >
          <div className="select-search-wrapper">
            <input
              type="text"
              className="select-search-input"
              placeholder={`Tìm kiếm...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>

          <div className="select-options">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`select-option ${value === option.id ? 'selected' : ''}`}
                  onClick={() => handleSelect(option.id)}
                  title={option.label}
                >
                  {option.label}
                </button>
              ))
            ) : (
              <div className="select-no-results">Không tìm thấy kết quả</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchableSelect;


