import { ProductCard } from '../../components/ProductCard';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { HeadingLevel } from '../../types/HeadingLevel';
import { Title } from '../../components/Title';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Product } from '../../types/Product';
import { useCallback, useEffect, useState } from 'react';
import { SortBy } from '../../types/SortBy';
import { PerPage } from '../../types/PerPage';
import classNames from 'classnames';
import { Loader } from '../../components/Loader';
import { getAllProducts } from '../../api/products';

export const CategoryPage = () => {
  const [sortBy, setSortBy] = useState(SortBy.new);
  const [perPage, setPerPage] = useState(PerPage.all);
  const [isOpenSortBy, setIsOpenSortBy] = useState(false);
  const [isOpenPerPage, setIsOpenPerPage] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const path = location.pathname.replace('/', '');
  const [productsFromServer, setProductsFromServer] = useState([]);
  const products = productsFromServer.filter(
    (product: Product) => product.category === path,
  );
  const productsCount = products.length;

  useEffect(() => {
    const itemsPerPage = searchParams.get('perPage');
    const sortParam = searchParams.get('sort');
    const page = searchParams.get('page');

    if (sortParam && (sortParam as SortBy) !== sortBy) {
      setSortBy((sortParam as SortBy) || SortBy.new);
    }

    if (itemsPerPage && (itemsPerPage as PerPage) !== perPage) {
      setPerPage(itemsPerPage as PerPage);
    }

    const params = new URLSearchParams(searchParams);

    if (itemsPerPage === PerPage.all) {
      params.delete('perPage');
    }

    if (page === '1') {
      params.delete('page');
    }

    setSearchParams(params);
    setIsOpenSortBy(false);
    setIsOpenPerPage(false);
  }, [perPage, searchParams, setSearchParams, sortBy]);

  const handleProductsLoad = useCallback(() => {
    setIsLoading(true);
    getAllProducts()
      .then(response => {
        return setProductsFromServer(
          response.filter((product: Product) => product.category === path),
        );
      })
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, [path]);

  useEffect(() => {
    setError(false);
    handleProductsLoad();
  }, [handleProductsLoad, path]);

  const categoryTitle = () => {
    switch (path) {
      case 'phones':
        return 'Phones';
      case 'tablets':
        return 'Tablets';
      case 'accessories':
        return 'Accessories';
      default:
        return 'Best gadgets ever';
    }
  };

  const handleSortBy = (sort: string) => {
    setSortBy(sort as SortBy);
    const params = new URLSearchParams(searchParams);

    params.set('sort', sort);
    setSearchParams(params);
    setIsOpenSortBy(false);
  };

  const handleSortByDropdown = () => {
    setIsOpenSortBy(!isOpenSortBy);
  };

  const handlePerPage = (amount: string) => {
    setPerPage(amount as PerPage);
    const params = new URLSearchParams(searchParams);

    params.set('perPage', amount);
    params.delete('page');
    setSearchParams(params);
    setIsOpenPerPage(false);
  };

  const handlePerPageDropdown = () => {
    setIsOpenPerPage(!isOpenPerPage);
  };

  switch (sortBy) {
    case SortBy.new:
      products.sort((a: Product, b: Product) => b.year - a.year);
      break;
    case SortBy.title:
      products.sort((a: Product, b: Product) => a.name.localeCompare(b.name));
      break;
    case SortBy.cheap:
      products.sort((a: Product, b: Product) => a.price - b.price);
      break;
    default:
      break;
  }

  let itemsPerPage = 0;

  switch (perPage) {
    case PerPage.all:
      itemsPerPage = 32;
      break;
    case PerPage.items16:
      itemsPerPage = 16;
      break;
    case PerPage.items8:
      itemsPerPage = 8;
      break;
    case PerPage.items4:
      itemsPerPage = 4;
      break;
  }

  const page = searchParams.get('page');
  const currentPage = page ? +page : 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const productsToShow = products.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const showPagination = products.length > itemsPerPage;

  const generatePageLink = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);

    params.set('page', pageNumber.toString());

    return `${location.pathname}?${params.toString()}`;
  };

  const getPaginationRange = () => {
    const range = [];
    const maxLinks = 4;

    let start = Math.max(1, currentPage - Math.floor(maxLinks / 2));
    const end = Math.min(totalPages, start + maxLinks - 1);

    if (end - start + 1 < maxLinks) {
      start = Math.max(1, end - maxLinks + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  };

  const paginationRange = getPaginationRange();

  return (
    <main>
      <Breadcrumbs />
      <Title level={HeadingLevel.h2}>{categoryTitle()}</Title>
      <p className="subtitle">{productsCount} models</p>

      {Boolean(productsToShow.length) && !error && (
        <>
          <div className="filters">
            <div className="filters__group">
              <label htmlFor="sortBy" className="filters__group__label">
                Sort by
              </label>
              <div
                className={classNames('select', {
                  'select--open': isOpenSortBy,
                })}
                id="sortBy"
                onClick={handleSortByDropdown}
              >
                <div className="select__input">{sortBy}</div>
                {isOpenSortBy ? (
                  <img
                    src="./img/icons/arrow-top.svg"
                    alt="Up arrow"
                    className="select__arrow"
                  />
                ) : (
                  <img
                    src="./img/icons/arrow-down.svg"
                    alt="Down arrow"
                    className="select__arrow"
                  />
                )}
              </div>
              {isOpenSortBy && (
                <ul className="select-dropdown">
                  <li
                    className="select-dropdown__item"
                    onClick={() => handleSortBy(SortBy.new)}
                  >
                    {SortBy.new}
                  </li>
                  <li
                    className="select-dropdown__item"
                    onClick={() => handleSortBy(SortBy.title)}
                  >
                    {SortBy.title}
                  </li>
                  <li
                    className="select-dropdown__item"
                    onClick={() => handleSortBy(SortBy.cheap)}
                  >
                    {SortBy.cheap}
                  </li>
                </ul>
              )}
            </div>
            <div className="filters__group">
              <label htmlFor="perPage" className="filters__group__label">
                Items on page
              </label>
              <div
                className={classNames('select', {
                  'select--open': isOpenPerPage,
                })}
                id="perPage"
                onClick={handlePerPageDropdown}
              >
                <div className="select__input">{perPage}</div>
                {isOpenPerPage ? (
                  <img
                    src="./img/icons/arrow-top.svg"
                    alt="Up arrow"
                    className="select__arrow"
                  />
                ) : (
                  <img
                    src="./img/icons/arrow-down.svg"
                    alt="Down arrow"
                    className="select__arrow"
                  />
                )}
              </div>
              {isOpenPerPage && (
                <ul className="select-dropdown">
                  <li
                    className="select-dropdown__item"
                    onClick={() => handlePerPage(PerPage.all)}
                  >
                    32
                  </li>
                  <li
                    className="select-dropdown__item"
                    onClick={() => handlePerPage(PerPage.items16)}
                  >
                    16
                  </li>
                  <li
                    className="select-dropdown__item"
                    onClick={() => handlePerPage(PerPage.items8)}
                  >
                    8
                  </li>
                  <li
                    className="select-dropdown__item"
                    onClick={() => handlePerPage(PerPage.items4)}
                  >
                    4
                  </li>
                </ul>
              )}
            </div>
          </div>
          <div className="products">
            {productsToShow.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
          {showPagination && (
            <div className="pagination">
              <Link
                to={generatePageLink(
                  currentPage - 1 < 1 ? currentPage : currentPage - 1,
                )}
                className={classNames(
                  'pagination__item pagination__arrow-fon',
                  {
                    'pagination__item--disabled': currentPage === 1,
                  },
                )}
              >
                {currentPage === 1 ? (
                  <img
                    src="./img/icons/arrow-left.svg"
                    alt="Left arrow"
                    className="pagination__arrow"
                  />
                ) : (
                  <img
                    src="./img/icons/arrow-left-white.svg"
                    alt="Left arrow"
                    className="pagination__arrow"
                  />
                )}
              </Link>
              {paginationRange.map(pageNumber => (
                <Link
                  key={pageNumber}
                  to={generatePageLink(pageNumber)}
                  className={classNames('pagination__page pagination__item', {
                    'pagination__page--active': currentPage === pageNumber,
                  })}
                >
                  {pageNumber}
                </Link>
              ))}
              <Link
                to={generatePageLink(
                  currentPage + 1 > totalPages ? currentPage : currentPage + 1,
                )}
                className={classNames(
                  'pagination__item pagination__arrow-fon',
                  {
                    'pagination__item--disabled': currentPage === totalPages,
                  },
                )}
              >
                {currentPage === totalPages ? (
                  <img
                    src="./img/icons/arrow-right.svg"
                    alt="Right arrow"
                    className="pagination__arrow"
                  />
                ) : (
                  <img
                    src="./img/icons/arrow-right-white.svg"
                    alt="Right arrow"
                    className="pagination__arrow"
                  />
                )}
              </Link>
            </div>
          )}
        </>
      )}

      {Boolean(!productsToShow.length) && !isLoading && (
        <Title level={HeadingLevel.h3}>{`There are no ${path} yet`}</Title>
      )}

      {Boolean(!productsToShow.length) && isLoading && <Loader />}

      {Boolean(!productsToShow.length) && error && (
        <>
          <Title level={HeadingLevel.h3}>Something went wrong</Title>
          <button
            onClick={() => {
              setError(false);
              handleProductsLoad();
            }}
            className="reload-button"
          >
            Reload
          </button>
        </>
      )}
    </main>
  );
};
