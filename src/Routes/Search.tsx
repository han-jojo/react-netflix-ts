import { useEffect, useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { useQuery } from "react-query";
import { useLocation } from "react-router";
import { useHistory, useRouteMatch } from "react-router-dom";
import { getSearch, IGetSearch } from "../api";
import { makeImagePath } from "../utils";
import MovieSlideComponent from "../Components/SearchMovieComponent";
import SearchTvSeriesComponent from "../Components/SearchTvSerieseComponent";

const Wrapper = styled.div`
  overflow-x: hidden;
  padding: 0 0 60px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const GroupSection = styled.main`
  margin-top: 150px;
`;

const SlideGroup = styled.section`
  padding: 0 15px;
  margin-bottom: 3rem;
`;

const SlideTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1em;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 34px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  font-size: 15px;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const history = useHistory();
  const { scrollY } = useViewportScroll();

  const { data, isLoading } = useQuery<IGetSearch>(
    ["search", keyword],
    () => getSearch(keyword!),
    { enabled: !!keyword }
  );

  const movieDetailMatch = useRouteMatch<{ movieId: string }>(
    `${process.env.PUBLIC_URL}/search/movies/:movieId`
  );
  const tvSerieseDetailMatch = useRouteMatch<{ tvSeriesId: string }>(
    `${process.env.PUBLIC_URL}/search/tv/:tvSeriesId`
  );

  const clickedMovie =
    movieDetailMatch?.params.movieId &&
    data?.results.find(
      (movie) => movie.id === +movieDetailMatch.params.movieId
    );

  const clickedTvSeries =
    tvSerieseDetailMatch?.params.tvSeriesId &&
    data?.results.find(
      (tvSeries) => tvSeries.id === +tvSerieseDetailMatch.params.tvSeriesId
    );

  const onOverlayClick = () =>
    history.push(`${process.env.PUBLIC_URL}/search?keyword=${keyword}`);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          {/* 미디어 슬라이드 */}
          <GroupSection>
            <SlideGroup>
              <SlideTitle>영화</SlideTitle>
              <MovieSlideComponent
                data={data?.results.filter(
                  (item) => item.media_type === "movie"
                )}
                keyword={keyword}
              />
              <SlideTitle>TV 시리즈</SlideTitle>
              <SearchTvSeriesComponent
                data={data?.results.filter((item) => item.media_type === "tv")}
                keyword={keyword}
              />
            </SlideGroup>
          </GroupSection>
          {/* 영화 디테일 */}
          <AnimatePresence>
            {movieDetailMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={movieDetailMatch.params.movieId}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.poster_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
          {/* TV 시리즈 디테일 */}
          <AnimatePresence>
            {tvSerieseDetailMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={tvSerieseDetailMatch.params.tvSeriesId}
                >
                  {clickedTvSeries && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedTvSeries.poster_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedTvSeries.title}</BigTitle>
                      <BigOverview>{clickedTvSeries.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Search;
