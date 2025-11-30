# 백트래킹 (Backtracking) - N-Queen 문제

백트래킹 알고리즘을 사용하여 N-Queen 문제를 해결하는 TypeScript 구현입니다.

## 📋 목차

- [개요](#개요)
- [N-Queen 문제란?](#n-queen-문제란)
- [알고리즘 설명](#알고리즘-설명)
- [코드 구조](#코드-구조)
- [사용 방법](#사용-방법)
- [예시](#예시)

## 개요

백트래킹(Backtracking)은 문제 해결을 위해 가능한 모든 경우를 시도하되, 해가 될 수 없는 경우는 즉시 포기하고 이전 단계로 돌아가는 알고리즘 기법입니다.

## N-Queen 문제란?

N x N 크기의 체스판에 N개의 퀸을 서로 공격할 수 없도록 배치하는 문제입니다.

**규칙:**
- 퀸은 같은 행, 같은 열, 같은 대각선에 다른 퀸이 있으면 안 됩니다.
- N개의 퀸을 모두 배치해야 합니다.

## 알고리즘 설명

### 1. `isAvailable` 함수
현재 위치에 퀸을 배치할 수 있는지 확인합니다.

```typescript
function isAvailable(candidate: number[], currentCol: number): boolean
```

**검사 항목:**
- 같은 열에 이미 퀸이 있는지 확인
- 대각선에 이미 퀸이 있는지 확인

### 2. `DFS` 함수
깊이 우선 탐색을 사용한 백트래킹 함수입니다.

```typescript
function DFS(
    N: number,
    currentRow: number,
    currentCandidate: number[],
    finalResult: number[][]
): void
```

**동작 과정:**
1. 모든 행에 퀸을 배치했으면 결과에 추가
2. 각 열에 대해 유효한 위치인지 확인
3. 유효하면 퀸을 배치하고 다음 행으로 재귀 호출
4. 재귀 호출 후 백트래킹을 위해 이전 상태로 되돌림 (`pop()`)

### 3. `solveNQueens` 함수
N-Queen 문제를 해결하는 메인 함수입니다.

```typescript
function solveNQueens(N: number): number[][]
```

## 코드 구조

```
BackTracking.ts
├── isAvailable()      // 위치 유효성 검사
├── DFS()              // 백트래킹 재귀 함수
└── solveNQueens()     // 메인 해결 함수
```

## 사용 방법

```typescript
import { solveNQueens } from './BackTracking';

// 4x4 체스판에 4개의 퀸 배치
const result = solveNQueens(4);
console.log(result);
```

## 예시

### N = 4인 경우

**입력:**
```typescript
solveNQueens(4)
```

**출력:**
```typescript
[
  [1, 3, 0, 2],  // 첫 번째 해
  [2, 0, 3, 1]   // 두 번째 해
]
```

**해석:**
- `[1, 3, 0, 2]`: 
  - 0번째 행: 1번째 열에 퀸
  - 1번째 행: 3번째 열에 퀸
  - 2번째 행: 0번째 열에 퀸
  - 3번째 행: 2번째 열에 퀸

### N = 8인 경우 (일반적인 체스판)

```typescript
const result = solveNQueens(8);
console.log(`총 ${result.length}개의 해를 찾았습니다.`);
// 총 92개의 해를 찾았습니다.
```

## 시간 복잡도

- **시간 복잡도**: O(N!)
- **공간 복잡도**: O(N)

## 참고사항

- N이 커질수록 해를 찾는 시간이 기하급수적으로 증가합니다.
- N=1, 2, 3인 경우 해가 없습니다.
- N=4 이상부터 해가 존재합니다.



