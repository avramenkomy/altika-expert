import Header from '../../components/Header/Header';


function MainLayout({ company, children }) {
  return (
    <>
      <Header company={company} />

      <main>{children}</main>
    </>
  )
}

export default MainLayout;
