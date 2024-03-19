import { useState, useEffect } from 'react';
import axiosFetch from '@/Utils/fetch';
import styles from "@/styles/Search.module.scss";
import ReactPaginate from "react-paginate"; // for pagination
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";
import MovieCardLarge from '@/components/MovieCardLarge';
import Skeleton from 'react-loading-skeleton';
// import MoviePoster from '@/components/MoviePoster';


const dummyList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const SearchPage = ({ categoryType }: any) => {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalpages, setTotalpages] = useState(1);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async (mode: any) => {
      setLoading(true);
      setData([null, null, null, null, null, null, null, null, null, null])
      try {
        let data;
        if (mode) {
          data = await axiosFetch({ requestID: `searchMulti`, page: currentPage, query: query });
          // console.log();
          if (data.page > data.total_pages) {
            setCurrentPage(data.total_pages);
          }
          setTotalpages(data.total_pages > 500 ? 500 : data.total_pages);
        } else {
          data = await axiosFetch({ requestID: `trending` });
          setCurrentPage(1);
          setTotalpages(1);
        }
        setData(data.results);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (query?.length > 2) fetchData(true);
    if (query?.length === 0) fetchData(false);
  }, [query, currentPage]);

  return (
    <div className={styles.MoviePage}>
      {/* <h1>Search</h1> */}
      <div className={styles.InputWrapper}>
        <input type="text" className={styles.searchInput} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Please enter at least 3 characters to search..." />
      </div>
      {query.length > 2 ? <h1>showing result for <span>{query}</span></h1> : null}
      <div className={styles.movieList}>
        {
          data.map((ele: any) => {
            return (
              <MovieCardLarge data={ele} media_type={categoryType} />
            )
          })
        }
        {
          (query.length > 2 && data?.length === 0) ?
            <h1>No Data Found</h1>
            : null
        }
        {
          (query.length > 2 && data === undefined) ?
            dummyList.map((ele) => (
              <Skeleton className={styles.loading} />
            ))
            : null
        }
      </div>
      <ReactPaginate
        containerClassName={styles.pagination}
        pageClassName={styles.page_item}
        activeClassName={styles.paginateActive}
        onPageChange={(event) => {
          setCurrentPage(event.selected + 1);
          console.log({ event });
          if (currentPage > totalpages) { setCurrentPage(totalpages) }
          window.scrollTo(0, 0);
        }}
        pageCount={totalpages}
        breakLabel=" ... "
        previousLabel={
          <AiFillLeftCircle className={styles.paginationIcons} />
        }
        nextLabel={
          <AiFillRightCircle className={styles.paginationIcons} />
        }
      />;
    </div>
  )
}

export default SearchPage;