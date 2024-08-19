import { ImageList, ImageListItem, ImageListItemBar, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import { MovieResponse, ResponseError } from '../type/movie';

interface MovieImageListProps {
    movies: Array<MovieResponse>;
    error: ResponseError;
    handleOpen: (movie: MovieResponse) => void;
    guideText: string;
}

export default function MovieImageList({ movies, error, handleOpen, guideText }: MovieImageListProps): JSX.Element {

    const isMobile = useMediaQuery('(min-width:756px)');
    const handleClickOpen = (movie: MovieResponse) => {
        handleOpen(movie);
    }
    const Div = styled('div')({
        margin: 10,
        color: 'white',
        textAlign: 'center',
    });

    return (
        <ImageList className="image-list" sx={{
            display: 'flex',
            flexDirection: isMobile ? 'row' : 'column', // 방향 설정
            flexWrap: 'nowrap', // 한 줄로 배치
            overflowY: isMobile ? 'auto' : 'initial', // 세로 스크롤 설정
            gap: 10,
            paddingBottom: '64px', // 하단 여백 값, 필요에 따라 조정
        }}>
            {error.isError && <Div>서버 문제로 영화 정보를 가져오지 못했습니다. 다시 시도해주세요.</Div>}
            {!error.isError && movies.length === 0 && <Div>{guideText}</Div>}
            {!error.isError && movies.length > 0 && movies.map((movie: MovieResponse) => (
                <>
                    <ImageListItem className='image-item' key={movie.id} sx={{
                        height: "100%", // 이미지 높이 설정
                        width: isMobile ? 'auto' : '100%', // 이미지 너비 설정
                    }}>
                        <img src={`${process.env.REACT_APP_POSTER_API_URL}${movie.posterPath}`}
                            alt={movie.title} onClick={() => handleClickOpen(movie)}
                            loading="lazy"

                        />
                        <ImageListItemBar
                            title={movie.title}
                            subtitle={movie.releaseDate}
                            position="top"
                            onClick={() => handleClickOpen(movie)}
                        />
                        <ImageListItemBar
                            sx={{ color: 'white' }}
                            title={movie.theaters.length > 0 ? '상영관' : '상영관 정보 없음'}
                            subtitle={movie.theaters.length > 0 ? movie.theaters.join(', ') : '상영관 정보 없음'}
                            position="below"
                        />
                    </ImageListItem>
                </>
            ))}

        </ImageList>
    );
}