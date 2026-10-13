import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { getCategories } from '../api/categories.js'
import { createMenu, getMenu, updateMenu } from '../api/menus.js'

const EMPTY_FORM = {
  menuName: '',
  menuPrice: '',
  categoryCode: '',
  orderableStatus: 'Y',
}

const validateForm = (form) => {
  const errors = {}
  const price = Number(form.menuPrice)

  if (!form.menuName.trim()) {
    errors.menuName = '메뉴 이름을 입력해 주세요.'
  }

  if (form.menuPrice === '') {
    errors.menuPrice = '가격을 입력해 주세요.'
  } else if (!Number.isInteger(price) || price < 0) {
    errors.menuPrice = '가격은 0 이상의 정수로 입력해 주세요.'
  }

  if (!form.categoryCode) {
    errors.categoryCode = '카테고리를 선택해 주세요.'
  }

  if (!['Y', 'N'].includes(form.orderableStatus)) {
    errors.orderableStatus = '판매 상태를 선택해 주세요.'
  }

  return errors
}

function MenuForm() {
  const { menuCode } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(menuCode)
  const [form, setForm] = useState(EMPTY_FORM)
  const [categories, setCategories] = useState([])
  const [fieldErrors, setFieldErrors] = useState({})
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    const loadForm = async () => {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const [categoryResult, menuResult] = await Promise.all([
          getCategories({ signal: controller.signal }),
          isEdit
            ? getMenu({ menuCode, signal: controller.signal })
            : Promise.resolve(null),
        ])
        const childCategories = (categoryResult?.categories ?? []).filter(
          (category) => category.refCategoryCode !== null,
        )

        setCategories(childCategories)

        if (isEdit) {
          const menu = menuResult?.menu
          const isChildCategory = childCategories.some(
            (category) => category.categoryCode === menu?.categoryCode,
          )

          setForm({
            menuName: menu?.menuName ?? '',
            menuPrice: menu?.menuPrice === undefined ? '' : String(menu.menuPrice),
            categoryCode: isChildCategory ? String(menu.categoryCode) : '',
            orderableStatus: menu?.orderableStatus === 'N' ? 'N' : 'Y',
          })
        } else {
          setForm(EMPTY_FORM)
        }
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

    loadForm()

    return () => controller.abort()
  }, [isEdit, menuCode])

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((currentForm) => ({ ...currentForm, [name]: value }))
    setFieldErrors((currentErrors) => ({ ...currentErrors, [name]: '' }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const errors = validateForm(form)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setErrorMessage('입력 내용을 확인해 주세요.')
      return
    }

    setIsSaving(true)
    setErrorMessage('')

    const menu = {
      menuName: form.menuName.trim(),
      menuPrice: Number(form.menuPrice),
      categoryCode: Number(form.categoryCode),
      orderableStatus: form.orderableStatus,
    }

    try {
      const result = isEdit
        ? await updateMenu({ menuCode, menu })
        : await createMenu({ menu })
      const savedMenu = result?.menu

      if (!savedMenu?.menuCode) {
        throw new Error('저장된 메뉴 정보를 확인할 수 없습니다.')
      }

      navigate(`/menus/${savedMenu.menuCode}`, { replace: true })
    } catch (error) {
      setErrorMessage(error.message)
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <p className="menu-list-state type-body1" role="status">
        메뉴 입력 화면을 준비하고 있습니다.
      </p>
    )
  }

  if (errorMessage && isEdit && !form.menuName) {
    return (
      <section className="detail-state menu-list-state error" role="alert">
        <strong className="type-headline1">{errorMessage}</strong>
        <Link className="detail-back type-label1" to="/">
          목록으로 돌아가기
        </Link>
      </section>
    )
  }

  const cancelTarget = isEdit ? `/menus/${menuCode}` : '/'

  return (
    <section className="menu-form-page" aria-labelledby="menu-form-title">
      <header className="page-heading">
        <p className="page-eyebrow type-label1">MENU MANAGEMENT</p>
        <h1 className="page-title type-title1" id="menu-form-title">
          {isEdit ? '메뉴 수정' : '메뉴 등록'}
        </h1>
        <p className="page-description type-body2">
          이름, 가격, 하위 카테고리와 판매 상태를 입력해 주세요.
        </p>
      </header>

      <form className="menu-form" noValidate onSubmit={handleSubmit}>
        {errorMessage && (
          <p className="form-message error type-body2" role="alert">
            {errorMessage}
          </p>
        )}

        <div className="form-grid">
          <label className="form-field" htmlFor="menu-name">
            <span className="form-label type-label1">메뉴 이름</span>
            <input
              className="form-control type-body1"
              id="menu-name"
              name="menuName"
              type="text"
              value={form.menuName}
              aria-invalid={Boolean(fieldErrors.menuName)}
              aria-describedby={fieldErrors.menuName ? 'menu-name-error' : undefined}
              onChange={handleChange}
            />
            {fieldErrors.menuName && (
              <span className="form-error type-caption1" id="menu-name-error">
                {fieldErrors.menuName}
              </span>
            )}
          </label>

          <label className="form-field" htmlFor="menu-price">
            <span className="form-label type-label1">가격</span>
            <input
              className="form-control type-body1"
              id="menu-price"
              name="menuPrice"
              type="number"
              min="0"
              step="1"
              value={form.menuPrice}
              aria-invalid={Boolean(fieldErrors.menuPrice)}
              aria-describedby={fieldErrors.menuPrice ? 'menu-price-error' : undefined}
              onChange={handleChange}
            />
            {fieldErrors.menuPrice && (
              <span className="form-error type-caption1" id="menu-price-error">
                {fieldErrors.menuPrice}
              </span>
            )}
          </label>

          <label className="form-field" htmlFor="menu-form-category">
            <span className="form-label type-label1">카테고리</span>
            <select
              className="form-control type-body1"
              id="menu-form-category"
              name="categoryCode"
              value={form.categoryCode}
              aria-invalid={Boolean(fieldErrors.categoryCode)}
              aria-describedby={
                fieldErrors.categoryCode ? 'menu-category-error' : 'menu-category-hint'
              }
              onChange={handleChange}
            >
              <option value="">하위 카테고리 선택</option>
              {categories.map((category) => (
                <option key={category.categoryCode} value={category.categoryCode}>
                  {category.refCategoryName} · {category.categoryName}
                </option>
              ))}
            </select>
            {fieldErrors.categoryCode ? (
              <span className="form-error type-caption1" id="menu-category-error">
                {fieldErrors.categoryCode}
              </span>
            ) : (
              <span className="form-hint type-caption1" id="menu-category-hint">
                메뉴는 하위 카테고리에 등록됩니다.
              </span>
            )}
          </label>

          <label className="form-field" htmlFor="orderable-status">
            <span className="form-label type-label1">판매 상태</span>
            <select
              className="form-control type-body1"
              id="orderable-status"
              name="orderableStatus"
              value={form.orderableStatus}
              aria-invalid={Boolean(fieldErrors.orderableStatus)}
              onChange={handleChange}
            >
              <option value="Y">판매 가능</option>
              <option value="N">판매 중지</option>
            </select>
          </label>
        </div>

        <div className="form-actions">
          <Link className="form-cancel type-label1" to={cancelTarget}>
            취소
          </Link>
          <button className="form-submit type-label1" type="submit" disabled={isSaving}>
            {isSaving ? '저장 중…' : isEdit ? '수정 저장' : '메뉴 등록'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default MenuForm
