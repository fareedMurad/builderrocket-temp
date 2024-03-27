import { useState } from "react";
import Pagination from "react-bootstrap/Pagination";

function ProductPagination({ handlePaginate, pageIndex, pageCount, pageSize }) {
  const [currentPage, setCurrentPage] = useState(pageIndex ?? 1);
  const totalPages = Math.ceil(pageCount / 50);

  const handlePrev = () => {
    if (currentPage > 1) {
      handlePaginate(currentPage - 1);
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      handlePaginate(currentPage + 1);
    }
  };

  const renderPageItem = (index) => {
    const page = index + 1;
    const active = currentPage === page;
    return (
      <Pagination.Item
        activeLabel={false}
        key={index}
        active={active}
        onClick={() => {
          setCurrentPage(page);
          handlePaginate(page);
        }}
      >
        {page}
      </Pagination.Item>
    );
  };
  return (
    <Pagination>
      <Pagination.Prev onClick={handlePrev} disabled={currentPage === 1} />
      {Array.from({ length: 10 < totalPages ? 10 : totalPages }, (_, index) =>
        renderPageItem(index)
      )}
      {10 < totalPages ? (
        <>
          <Pagination.Ellipsis />
          {renderPageItem(totalPages - 2)}
          {renderPageItem(totalPages - 1)}
          {renderPageItem(totalPages)}
        </>
      ) : null}

      <Pagination.Next
        onClick={handleNext}
        disabled={currentPage === totalPages}
      />
    </Pagination>
  );
}

export default ProductPagination;
