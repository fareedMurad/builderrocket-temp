import Pagination from "react-bootstrap/Pagination";

function ProductPagination({
  currentPage,
  setCurrentPage,
  itemsPerPage,
  totalItems,
  handlePaginate,
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) {
      handlePaginate(currentPage - 1)
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      handlePaginate(currentPage + 1)
    }
  };
  return (
    <Pagination>
      <Pagination.Prev onClick={handlePrev} disabled={currentPage === 1} />
      {Array.from({ length: totalPages }, (_, index) => (
        <Pagination.Item
          activeLabel={false}
          key={index}
          active={currentPage === index + 1}
          onClick={() => setCurrentPage(index + 1)}
        >
          {index + 1}
        </Pagination.Item>
      ))}
      <Pagination.Next
        onClick={handleNext}
        disabled={currentPage === totalPages}
      />
    </Pagination>
  );
}

export default ProductPagination;
