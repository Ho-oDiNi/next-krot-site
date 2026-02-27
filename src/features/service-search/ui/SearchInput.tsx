type SearchInputProps = {
    value: string;
    onChange: (value: string) => void;
};

const SearchInput = ({ value, onChange }: SearchInputProps) => {
    return (
        <input
            type="search"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            name="service-search"
            className="w-full rounded-xl bg-white px-4 py-3 text-neutral-900 outline-none placeholder:text-sm placeholder:text-stone-300 sm:placeholder:text-base"
            placeholder="Поиск статьи..."
            aria-label="Поиск услуг и категорий"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
        />
    );
};

export default SearchInput;
