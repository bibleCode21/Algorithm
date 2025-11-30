/**
 * 현재 후보 위치가 유효한지 확인하는 함수
 * @param candidate 현재까지 배치된 퀸들의 열 위치 배열
 * @param current_col 현재 배치하려는 열 위치
 * @returns 유효한 위치면 true, 아니면 false
 */
function isAvailable(candidate: number[], currentCol: number): boolean {
    const currentRow = candidate.length;
    
    for (let queenRow = 0; queenRow < currentRow; queenRow++) {
        // 같은 열에 퀸이 있거나 대각선에 퀸이 있으면 false
        if (candidate[queenRow] === currentCol || 
            Math.abs(candidate[queenRow] - currentCol) === currentRow - queenRow) {
            return false;
        }
    }
    
    return true;
}

/**
 * 깊이 우선 탐색을 사용한 백트래킹 함수
 * @param N 체스판 크기 (N x N)
 * @param currentRow 현재 배치하려는 행
 * @param currentCandidate 현재까지의 후보 배열
 * @param finalResult 최종 결과를 저장할 배열
 */
function DFS(
    N: number,
    currentRow: number,
    currentCandidate: number[],
    finalResult: number[][]
): void {
    // 모든 행에 퀸을 배치했으면 결과에 추가
    if (currentRow === N) {
        finalResult.push([...currentCandidate]); // 배열 복사
        return;
    }
    
    // 각 열에 대해 시도
    for (let candidateCol = 0; candidateCol < N; candidateCol++) {
        if (isAvailable(currentCandidate, candidateCol)) {
            currentCandidate.push(candidateCol);
            DFS(N, currentRow + 1, currentCandidate, finalResult);
            currentCandidate.pop(); // 백트래킹: 이전 상태로 되돌림
        }
    }
}

/**
 * N-Queen 문제를 해결하는 함수
 * @param N 체스판 크기 (N x N)
 * @returns N개의 퀸을 배치할 수 있는 모든 경우의 수
 */
function solveNQueens(N: number): number[][] {
    const finalResult: number[][] = [];
    DFS(N, 0, [], finalResult);
    return finalResult;
}

// 사용 예시
// const result = solveNQueens(4);
// console.log(result); // [[1, 3, 0, 2], [2, 0, 3, 1]]

export { isAvailable, DFS, solveNQueens };

