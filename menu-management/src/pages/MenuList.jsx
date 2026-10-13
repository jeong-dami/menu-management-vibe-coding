import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { getCategories } from '../api/categories.js'
import { getMenuPage, searchMenusByPrice } from '../api/menus.js'
import MenuCard from '../components/MenuCard.jsx'
import MenuFilters from '../components/MenuFilters.jsx'
import Pagination from '../components/Pagination.jsx'

const PAGE_SIZE = 10
const FILTER_SOURCE_SIZE = 1000

const parsePage = (value) => {
  const page = Number(value)

  return Number.isInteger(page) && page >= 1 ? page : 1
}

function MenuList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [menus, setMenus] = useState([])
  const [categories, setCategories] = useState([])
  const [pageInfo, setPageInfo] = useState({
    number: 1,
    totalPages: 0,
    totalElements: 0,
    first: true,
    last: true,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const query = searchParams.get('q')?.trim() ?? ''
  const categoryCode = searchParams.get('category') ?? ''
  const minPrice = searchParams.get('minPrice') ?? ''
  const page = parsePage(searchParams.get('page'))
  const numericMinPrice = Number(minPrice)
  const hasPriceFilter =
    minPrice !== '' && Number.isFinite(numericMinPrice) && numericMinPrice >= 0
  const hasFilters = Boolean(query || categoryCode || hasPriceFilter)

  useEffect(() => {
    const controller = new AbortController()

    const loadCategories = async () => {
      try {
        const result = await getCategories({ signal: controller.signal })
        const childCategories = (result?.categories ?? []).filter(
          (category) => category.refCategoryCode !== null,
        )

        setCategories(childCategories)
      } catch (error) {
        if (error.name !== 'CanceledError') {
          setErrorMessage(error.message)
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsCategoriesLoading(false)
        }
      }
    }

    loadCategories()

    return () => controller.abort()
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    const loadMenus = async () => {
      setIsLoading(true)
      setErrorMessage('')

      try {
        if (!hasFilters) {
          const result = await getMenuPage({
            page,
            signal: controller.signal,
          })

          setMenus(result?.content ?? [])
          setPageInfo({
            number: result?.number ?? page,
            totalPages: result?.totalPages ?? 0,
            totalElements: result?.totalElements ?? 0,
            first: result?.first ?? page === 1,
            last: result?.last ?? true,
          })
          return
        }

        const result = hasPriceFilter
          ? await searchMenusByPrice({
              menuPrice: numericMinPrice,
              signal: controller.signal,
            })
          : await getMenuPage({
              page: 1,
              size: FILTER_SOURCE_SIZE,
              signal: controller.signal,
            })

        const sourceMenus = hasPriceFilter
          ? (result?.menus ?? [])
          : (result?.content ?? [])
        const normalizedQuery = query.toLocaleLowerCase('ko-KR')
        const filteredMenus = sourceMenus.filter((menu) => {
          const matchesQuery = normalizedQuery
            ? menu.menuName.toLocaleLowerCase('ko-KR').includes(normalizedQuery)
            : true
          const matchesCategory = categoryCode
            ? String(menu.categoryCode) === categoryCode
            : true

          return matchesQuery && matchesCategory
        })
        const totalPages = Math.ceil(filteredMenus.length / PAGE_SIZE)
        const lastPage = Math.max(totalPages, 1)

        if (page > lastPage) {
          const nextParams = new URLSearchParams(window.location.search)
          nextParams.set('page', String(lastPage))
          setSearchParams(nextParams, { replace: true })
          return
        }

        const startIndex = (page - 1) * PAGE_SIZE
        setMenus(filteredMenus.slice(startIndex, startIndex + PAGE_SIZE))
        setPageInfo({
          number: page,
          totalPages,
          totalElements: filteredMenus.length,
          first: page === 1,
          last: page >= totalPages,
        })
      } catch (error) {
        if (error.name !== 'CanceledError') {
          setErrorMessage(error.message)
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadMenus()

    return () => controller.abort()
  }, [categoryCode, hasFilters, hasPriceFilter, numericMinPrice, page, query, setSearchParams])

  const updateSearchParams = (updates) => {
    const nextParams = new URLSearchParams(searchParams)

    for (const [key, value] of Object.entries(updates)) {
      if (value === '') {
        nextParams.delete(key)
      } else {
        nextParams.set(key, String(value))
      }
    }

    setSearchParams(nextParams)
  }

  const handleSearch = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    updateSearchParams({
      q: String(formData.get('q') ?? '').trim(),
      minPrice: String(formData.get('minPrice') ?? '').trim(),
      page: 1,
    })
  }

  const handleCategoryChange = (nextCategoryCode) => {
    updateSearchParams({ category: nextCategoryCode, page: 1 })
  }

  const handleReset = () => {
    setSearchParams({ page: '1' })
  }

  const handlePageChange = (nextPage) => {
    updateSearchParams({ page: nextPage })
  }

  return (
    <section className="menu-list-page" aria-labelledby="menu-list-title">
      <header className="page-heading">
        <p className="page-eyebrow type-label1">MENU MANAGEMENT</p>
        <h1 className="page-title type-title1" id="menu-list-title">
          메뉴 목록
        </h1>
        <p className="page-description type-body2">
          {hasFilters
            ? `조건에 맞는 메뉴 ${pageInfo.totalElements}개`
            : `등록된 메뉴 ${pageInfo.totalElements}개`}
        </p>
      </header>

      <MenuFilters
        query={query}
        minPrice={minPrice}
        categoryCode={categoryCode}
        categories={categories}
        isCategoriesLoading={isCategoriesLoading}
        hasFilters={hasFilters}
        onSubmit={handleSearch}
        onCategoryChange={handleCategoryChange}
        onReset={handleReset}
      />

      {isLoading && (
        <p className="menu-list-state type-body1" role="status">
          메뉴를 불러오고 있습니다.
        </p>
      )}

      {!isLoading && errorMessage && (
        <p className="menu-list-state error type-body1" role="alert">
          {errorMessage}
        </p>
      )}

      {!isLoading && !errorMessage && menus.length === 0 && (
        <div className="menu-list-state" role="status">
          <strong className="type-headline1">조건에 맞는 메뉴가 없습니다.</strong>
          {hasFilters && (
            <button className="empty-reset type-label1" type="button" onClick={handleReset}>
              모든 조건 지우기
            </button>
          )}
        </div>
      )}

      {!isLoading && !errorMessage && menus.length > 0 && (
        <ul className="menu-grid">
          {menus.map((menu) => (
            <li key={menu.menuCode}>
              <MenuCard menu={menu} />
            </li>
          ))}
        </ul>
      )}

      {!isLoading && !errorMessage && menus.length > 0 && (
        <Pagination
          currentPage={pageInfo.number}
          totalPages={pageInfo.totalPages}
          isFirst={pageInfo.first}
          isLast={pageInfo.last}
          onPageChange={handlePageChange}
        />
      )}
    </section>
  )
}

export default MenuList
