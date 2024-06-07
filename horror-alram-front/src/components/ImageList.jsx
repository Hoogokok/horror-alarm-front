import { ImageList, ImageListItem, ImageListItemBar } from '@mui/material';
import { useMediaQuery } from '@mui/material';

export default function UpcomingImageList({ movies, error, handleOpen }) {
    const isMobile = useMediaQuery('(min-width:756px)');
    const handleClickOpen = (movie) => {
        handleOpen(movie);
    }

    return (
        <ImageList className="image-list" sx={{
            width: '100%',
            height: '100%',
            display: 'flex', // flex 레이아웃으로 변경
            flexDirection: isMobile ? 'row' : 'column', // 방향 설정
            flexWrap: 'nowrap', // 한 줄로 배치
            overflowY: isMobile ? 'auto' : 'initial', // 세로 스크롤 설정
            gap: 10,
        }}>
            {error && <div>서버 문제로 영화 정보를 가져오지 못했습니다. 다시 시도해주세요.</div>}
            {!error && movies.length === 0 && <div>개봉 예정 영화가 없습니다.</div>}
            {!error && movies.length > 0 && movies.map((movie) => (
                <ImageListItem className='image-item' key={movie.id} onClick={() => handleClickOpen(movie)} sx={{ height: 150 }}>
                    <img src={`${process.env.REACT_APP_POSTER_API_URL}${movie.posterPath}`} alt={movie.title} />
                    <ImageListItemBar
                        title={movie.title}
                        subtitle={movie.releaseDate}
                        position="overlay"
                    />
                </ImageListItem>
            ))}
        </ImageList>
    );
}