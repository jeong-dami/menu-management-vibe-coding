import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { deleteMenu, getMenu } from '../api/menus.js'

const priceFormatter = new Intl.NumberFormat('ko-KR')

function MenuDetail() {
  const { menuCode } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [menu, setMenu] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('')
  const backTarget = location.state?.from ?? '/'

  useEffect(() => {
    const controller = new AbortController()

    const loadMenu = async () => {
      try {
        const result = await getMenu({
          menuCode,
          signal: controller.signal,
        })
        setMenu(result?.menu ?? null)
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

    loadMenu()

    return () => controller.abort()
  }, [menuCode])

  const handleDelete = async () => {
    setIsDeleting(true)
    setDeleteErrorMessage('')

    try {
      await deleteMenu({ menuCode })
      navigate(backTarget, { replace: true })
    } catch (error) {
      setDeleteErrorMessage(error.message)
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <p className="menu-list-state type-body1" role="status">
        메뉴 정보를 불러오고 있습니다.
      </p>
    )
  }

  if (errorMessage || !menu) {
    return (
      <section className="detail-state menu-list-state error" role="alert">
        <strong className="type-headline1">
          {errorMessage || '메뉴 정보를 찾을 수 없습니다.'}
        </strong>
        <Link className="detail-back type-label1" to={backTarget}>
          목록으로 돌아가기
        </Link>
      </section>
    )
  }

  const isOrderable = menu.orderableStatus === 'Y'

  return (
    <article className="menu-detail" aria-labelledby="menu-detail-title">
      <header className="detail-heading">
        <div>
          <p className="page-eyebrow type-label1">MENU #{menu.menuCode}</p>
          <h1 className="detail-title type-title1" id="menu-detail-title">
            {menu.menuName}
          </h1>
        </div>
        <span
          className={`order-status type-label1 ${isOrderable ? 'available' : 'unavailable'}`}
        >
          {isOrderable ? '판매 가능' : '판매 중지'}
        </span>
      </header>

      <dl className="detail-information">
        <div className="detail-information-row">
          <dt className="type-label1">가격</dt>
          <dd className="detail-price type-heading2">
            {priceFormatter.format(menu.menuPrice)}원
          </dd>
        </div>
        <div className="detail-information-row">
          <dt className="type-label1">카테고리</dt>
          <dd className="type-body1">
            {menu.categoryName ?? '카테고리 정보 없음'}
            <span className="category-code type-caption1">
              CODE {menu.categoryCode}
            </span>
          </dd>
        </div>
      </dl>

      <div className="detail-actions">
        <Link className="detail-back type-label1" to={backTarget}>
          목록으로 돌아가기
        </Link>
        <div className="detail-management-actions">
          <Link
            className="detail-edit type-label1"
            to={`/menus/${menu.menuCode}/edit`}
          >
            메뉴 수정
          </Link>
          <button
            className="detail-delete type-label1"
            type="button"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            메뉴 삭제
          </button>
        </div>
      </div>

      {isDeleteDialogOpen && (
        <div className="dialog-backdrop">
          <section
            className="delete-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
          >
            <div className="delete-dialog-copy">
              <p className="page-eyebrow type-label2">DELETE MENU</p>
              <h2 className="delete-dialog-title type-heading1" id="delete-dialog-title">
                이 메뉴를 삭제할까요?
              </h2>
              <p
                className="delete-dialog-description type-body2"
                id="delete-dialog-description"
              >
                ‘{menu.menuName}’ 메뉴를 삭제하면 되돌릴 수 없습니다.
              </p>
            </div>

            {deleteErrorMessage && (
              <p className="form-message error type-body2" role="alert">
                {deleteErrorMessage}
              </p>
            )}

            <div className="delete-dialog-actions">
              <button
                className="dialog-cancel type-label1"
                type="button"
                disabled={isDeleting}
                autoFocus
                onClick={() => {
                  setDeleteErrorMessage('')
                  setIsDeleteDialogOpen(false)
                }}
              >
                취소
              </button>
              <button
                className="dialog-confirm type-label1"
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
              >
                {isDeleting ? '삭제 중…' : '삭제'}
              </button>
            </div>
          </section>
        </div>
      )}
    </article>
  )
}

export default MenuDetail
