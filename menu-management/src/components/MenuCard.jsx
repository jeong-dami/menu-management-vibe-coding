import { Link, useLocation } from 'react-router'

const priceFormatter = new Intl.NumberFormat('ko-KR')

function MenuCard({ menu }) {
  const location = useLocation()
  const isOrderable = menu.orderableStatus === 'Y'
  const categoryName = menu.categoryName ?? '카테고리 정보 없음'
  const returnTo = `${location.pathname}${location.search}`

  return (
    <Link
      className="menu-card-link"
      to={`/menus/${menu.menuCode}`}
      state={{ from: returnTo }}
      aria-label={`${menu.menuName} 상세 보기`}
    >
      <article className="menu-card">
        <div className="menu-card-header">
          <span className="menu-code type-caption1">MENU #{menu.menuCode}</span>
          <span
            className={`order-status type-label2 ${isOrderable ? 'available' : 'unavailable'}`}
          >
            {isOrderable ? '판매 가능' : '판매 중지'}
          </span>
        </div>

        <h2 className="menu-name type-headline1">{menu.menuName}</h2>

        <dl className="menu-information">
          <div className="menu-information-row">
            <dt className="type-label2">가격</dt>
            <dd className="menu-price type-body1">
              {priceFormatter.format(menu.menuPrice)}원
            </dd>
          </div>
          <div className="menu-information-row">
            <dt className="type-label2">카테고리</dt>
            <dd className="type-body2">
              {categoryName}
              <span className="category-code type-caption1">
                CODE {menu.categoryCode}
              </span>
            </dd>
          </div>
        </dl>
      </article>
    </Link>
  )
}

export default MenuCard
