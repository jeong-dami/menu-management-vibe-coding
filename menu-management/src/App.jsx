import { NavLink, Outlet, Route, Routes } from 'react-router'
import './App.css'
import MenuDetail from './pages/MenuDetail.jsx'
import MenuForm from './pages/MenuForm.jsx'
import MenuList from './pages/MenuList.jsx'

function Layout() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="layout-inner header-inner">
          <NavLink className="brand type-headline1" to="/" aria-label="Menu Studio 홈">
            <span className="brand-mark" aria-hidden="true">
              M
            </span>
            <span>Menu Studio</span>
          </NavLink>

          <nav aria-label="주요 메뉴">
            <ul className="main-navigation">
              <li>
                <NavLink className="nav-link type-label1" to="/" end>
                  메뉴 목록
                </NavLink>
              </li>
              <li>
                <NavLink className="nav-link type-label1" to="/menus/new">
                  메뉴 등록
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="site-main layout-inner">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="layout-inner footer-inner">
          <span className="type-label2">© Menu Studio</span>
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<MenuList />} />
        <Route path="menus/new" element={<MenuForm />} />
        <Route path="menus/:menuCode/edit" element={<MenuForm />} />
        <Route path="menus/:menuCode" element={<MenuDetail />} />
      </Route>
    </Routes>
  )
}

export default App
