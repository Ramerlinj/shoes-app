function ItemsHeader() {
  return (
    <nav className="">
      <ul className="list-none flex justify-around">
        <li className="">
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/products">Products</a>
        </li>
        <li>
          <a href="/about">About Us</a>
        </li>
        <li>
          <a href="/contact">Contact</a>
        </li>
      </ul>
    </nav>
  );
}

export default ItemsHeader;
