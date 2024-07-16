import React from "react";
import ReactPaginate from "react-paginate";

const Pagination = ({ pageCount, onPageChange }) => {
    return (
        <ReactPaginate
            className="pagination justify-content-center gap-4 my-4"
            nextLabel="Siguiente"
            previousLabel="Anterior"
            nextClassName="btn btn-primary"
            previousLinkClassName="text-white"
            nextLinkClassName="text-white"
            previousClassName="btn btn-primary"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            activeClassName="active"
            onPageChange={onPageChange}
            pageCount={pageCount}
        />
    );
};

export default Pagination;

