function MenuFilters({
  query,
  minPrice,
  categoryCode,
  categories,
  isCategoriesLoading,
  hasFilters,
  onSubmit,
  onCategoryChange,
  onReset,
}) {
  return (
    <section className="filter-panel" aria-label="메뉴 검색 및 필터">
      <form className="filter-form" onSubmit={onSubmit}>
        <label className="filter-field" htmlFor="menu-query">
          <span className="filter-label type-label2">메뉴 이름</span>
          <input
            className="filter-control type-body2"
            id="menu-query"
            name="q"
            type="search"
            defaultValue={query}
            key={`query-${query}`}
            placeholder="메뉴 이름으로 찾기"
          />
        </label>

        <label className="filter-field" htmlFor="minimum-price">
          <span className="filter-label type-label2">초과 가격</span>
          <input
            className="filter-control type-body2"
            id="minimum-price"
            name="minPrice"
            type="number"
            min="0"
            defaultValue={minPrice}
            key={`price-${minPrice}`}
            placeholder="예: 10000"
          />
        </label>

        <button className="filter-submit type-label1" type="submit">
          검색
        </button>
      </form>

      <div className="category-filter">
        <label className="filter-field" htmlFor="menu-category">
          <span className="filter-label type-label2">하위 카테고리</span>
          <select
            className="filter-control type-body2"
            id="menu-category"
            value={categoryCode}
            disabled={isCategoriesLoading}
            onChange={(event) => onCategoryChange(event.target.value)}
          >
            <option value="">전체 하위 카테고리</option>
            {categories.map((category) => (
              <option key={category.categoryCode} value={category.categoryCode}>
                {category.refCategoryName} · {category.categoryName}
              </option>
            ))}
          </select>
        </label>

        {hasFilters && (
          <button className="filter-reset type-label1" type="button" onClick={onReset}>
            조건 초기화
          </button>
        )}
      </div>
    </section>
  )
}

export default MenuFilters
