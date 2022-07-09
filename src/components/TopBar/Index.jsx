import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { ALL_PRODUCTS_CATHEGORIES } from '../../graphql/queries/allProductsCathegories';
import { mappedProductsCathegoriesName } from './helpers';
import { STORAGE_URL } from '../../constants/environment';
import { menuItemsProperties } from './data';

const TopBar = () => {
  const blockName = 'top-bar';
  const { loading, error, data } = useQuery(ALL_PRODUCTS_CATHEGORIES);
  const productsCathegories = data?.productsCathegories;

  if (loading) return <h1>Loading...</h1>
  if (error) return <h1>Error</h1>

  console.log(mappedProductsCathegoriesName(productsCathegories[0].name))

  return (
    <nav className={blockName}>
      <div className={`${blockName}__logo`}>
        <Link to="/">
          <img src={`${STORAGE_URL}/images/logo.svg`} alt="Budoman logo" className={`${blockName}__logo-img`} />
        </Link>
      </div>
      <div className={`${blockName}__search-engine`}>
        <input type="text" className={`${blockName}__search-engine-input`} />
      </div>
      <div className={`${blockName}__login`}>
        <Link to="/login">
          Logowanie
        </Link>
      </div>
      <div className={`${blockName}__menu`}>
        <ul className={`${blockName}__menu-list`}>
          {
            menuItemsProperties.map(({ path, name }) => (
              <li className={`${blockName}__list-item`}>
                <Link to={path} className={`${blockName}__item-link`}>
                  {name}
                </Link>
              </li>
            ))
          }
        </ul>
      </div>
      <div className={`${blockName}__basket`}>
        <i className={`${blockName}__basket-icon icon-shop_basket`} />
        0,00 zł
      </div>
    </nav>
  )
};

export default TopBar;
