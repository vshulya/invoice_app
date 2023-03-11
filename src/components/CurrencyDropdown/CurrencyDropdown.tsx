import React from "react";

type CurrencyDropdownProps = {
  options: { value: string; label: string; shortLabel: string }[];
  setSelectedLabel: (label: string) => void;
};

function CurrencyDropdown({
  options,
  setSelectedLabel
}: CurrencyDropdownProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLabel(event.target.value);
  };

  return (
    <main className="container">
      <section className="currency__section">
        <select onChange={handleChange}>
          {options.map((option) => (
            <option key={option.value} value={option.shortLabel}>
              {option.label}
            </option>
          ))}
        </select>
      </section>
    </main>
  );
}

export default CurrencyDropdown;
