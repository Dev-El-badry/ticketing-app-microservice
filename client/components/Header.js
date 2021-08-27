import Link from 'next/link'

export default ({currentUser}) => {
  const links = [
    !currentUser && {
      title: "sign in",
      href: "/auth/signin"
    },
    !currentUser && {
      title: "sign up",
      href: "/auth/signup"
    },
    currentUser &&{
      title: "Sell tickets",
      href: "/"
    },
    currentUser &&{
      title: "my orders",
      href: "/orders"
    },
    currentUser &&{
      title: "sign out",
      href: "/auth/signout"
    }
  ].filter(link => link).map(link => {
    return (
      <li className="nav-item" key={link.title}>       
        <Link href={link.href}>
          <a className="nav-link" aria-current="page">{link.title}</a>
        </Link>
      </li>
    )
  });
  
  return <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link href="/">
              <a className="navbar-brand">GTX</a>
            </Link>

            <div className="d-flex">
              <div className="collapse navbar-collapse " id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  {links} 
                </ul>
              </div>
            </div>
          </div>
        </nav>;
};