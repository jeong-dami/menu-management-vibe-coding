function Pagination({
  currentPage,
  totalPages,
  isFirst,
  isLast,
  onPageChange,
}) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  if (totalPages <= 1) {
    return null
  }

  return (
    <nav className="pagination" aria-label="메뉴 목록 페이지">
      <button
        className="page-button type-label1"
        type="button"
        disabled={isFirst}
        onClick={() => onPageChange(currentPage - 1)}
      >
        이전
      </button>

      <ol className="page-numbers">
        {pages.map((page) => (
          <li key={page}>
            <button
              className="page-button type-label1"
              type="button"
              aria-current={page === currentPage ? 'page' : undefined}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          </li>
        ))}
      </ol>

      <button
        className="page-button type-label1"
        type="button"
        disabled={isLast}
        onClick={() => onPageChange(currentPage + 1)}
      >
        다음
      </button>
    </nav>
  )
}

export default Pagination
