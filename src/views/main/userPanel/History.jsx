import React, { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from '@apollo/client';
import { GET_ORDERS } from 'graphql/queries/order.js';
import { formatTimestamp } from 'utils/helpers.js';
import LoadingModal from 'components/modals/LoadingModal.jsx';
import ErrorModal from 'components/modals/ErrorModal.jsx';
import Pagination from 'components/Pagination.jsx';

const History = () => {
  const blockName = 'history';
  const quantityPerPage = 5;
  const { loggedUserId } = useSelector((store) => store.user);
  const [activePage, setActivePage] = useState(0);
  const [fetchingOrdersError, setFetchingOrdersError] = useState(false);
  const { loading, data } = useQuery(
    GET_ORDERS,
    {
      variables: { input: { userId: loggedUserId, pagination: { page: activePage, quantityPerPage } } },
      onError: () => setFetchingOrdersError(true)
    }
  );

  const handlePaginationOnChange = (pageNumber) => setActivePage(pageNumber - 1);

  return (
    <div className={blockName}>
      <h1 className={`${blockName}__header`}>Historia zamówień</h1>
      {
        data && (
          <Fragment>
            <table className={`${blockName}__table`}>
              <thead>
                <tr className={`${blockName}__table-row`}>
                  <td className={`${blockName}__table-col ${blockName}__table-col--thead`}>Numer zamówienia</td>
                  <td className={`${blockName}__table-col ${blockName}__table-col--thead`}>Cena całkowita</td>
                  <td className={`${blockName}__table-col ${blockName}__table-col--thead`}>Data zakupu</td>
                </tr>
              </thead>
              <tbody>
                {
                  data.orders.orders.map(({ id, totalPrice, createdAt }) => (
                    <tr className={`${blockName}__table-row`}>
                      <td className={`${blockName}__table-col`}>{id}</td>
                      <td className={`${blockName}__table-col`}>{totalPrice} zł</td>
                      <td className={`${blockName}__table-col`}>{formatTimestamp(createdAt)}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
            <Pagination
              activePage={activePage}
              onChange={handlePaginationOnChange}
              itemsQuantity={data.orders.allOrdersQuantity}
              quantityPerPage={quantityPerPage}
            />
          </Fragment>
        )
      }
      { loading && <LoadingModal info="Trwa pobieranie historii twoich zamówień" /> }
      <ErrorModal
        isOpen={fetchingOrdersError}
        handleOnClose={() => setFetchingOrdersError(false)}
        info="Niestety nie udało się pobrać historii twoich zamówień."
      />
    </div>
  );
};

export default History;
