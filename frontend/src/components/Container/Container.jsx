import './Container.scss';

function Container({ children, className = '', wide=false}) {
  const classes = [ 'container', wide && 'container--wide', className ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      {children}
    </div>
  )
}

export default Container;
