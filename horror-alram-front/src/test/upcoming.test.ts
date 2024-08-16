import { expect, test, vi } from 'vitest'
import { getUpcomingMovies } from '../functions/upcoming'
import { isError } from 'util'

// 테스트 데이터 정의
const successResponse = {
    movies: [
        {
            id: 1,
            title: 'test',
            posterPath: 'test.jpg',
            overview: 'test overview',
            theaters: ['test1', 'test2'],
            releaseDate: '2021-10-10'
        }
    ],
    error: {
        data: {
            message: 'success',
            status: 200
        },
        isError: false
    }
}

const errorResponse = {
    movies: [],
    error: {
        data: {
            message: 'error',
            status: 500
        },
        isError: true
    }
}
// 모킹할 함수 정의
vi.mock('../functions/upcoming')

test('getUpcomingMovies 성공', async () => {
    vi.mocked(getUpcomingMovies).mockResolvedValue(successResponse)
    const result = await getUpcomingMovies()
    expect(result).toEqual(successResponse)
})

test('getUpcomingMovies 실패', async () => {
    vi.mocked(getUpcomingMovies).mockResolvedValue(errorResponse)
    const result = await getUpcomingMovies()
    expect(result).toEqual(errorResponse)
})
