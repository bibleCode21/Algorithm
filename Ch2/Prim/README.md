# 프림 알고리즘 (Prim's Algorithm)

## 목차
- [개념](#개념)
- [최소 신장 트리(MST)란?](#최소-신장-트리mst란)
- [특징](#특징)
- [동작 원리](#동작-원리)
- [MinHeap 자료구조](#minheap-자료구조)
  - [기본 개념](#기본-개념)
  - [제네릭 구현](#제네릭-구현)
  - [주요 메서드](#주요-메서드)
  - [heapifyUp과 heapifyDown](#heapifyup과-heapifydown)
- [알고리즘 구현](#알고리즘-구현)
  - [기본 Prim 알고리즘](#기본-prim-알고리즘)
  - [개선된 Prim 알고리즘 (heapdict 방식)](#개선된-prim-알고리즘-heapdict-방식)
- [시간 복잡도](#시간-복잡도)
- [실행 예시](#실행-예시)
- [장점과 단점](#장점과-단점)
- [크루스칼 vs 프림](#크루스칼-vs-프림)
- [실행 방법](#실행-방법)

---

## 개념

프림 알고리즘은 **가중치가 있는 무방향 그래프**에서 **최소 신장 트리(Minimum Spanning Tree, MST)**를 찾는 그리디 알고리즘입니다.

시작 정점에서 출발하여, 이미 연결된 정점들과 연결되지 않은 정점을 연결하는 간선 중 가장 가중치가 작은 간선을 선택하는 과정을 반복합니다.

## 최소 신장 트리(MST)란?

**신장 트리(Spanning Tree)**
- 그래프의 모든 정점을 포함하는 트리
- n개의 정점을 가진 그래프의 신장 트리는 n-1개의 간선을 가짐
- 사이클이 없어야 함

**최소 신장 트리(Minimum Spanning Tree)**
- 여러 신장 트리 중에서 간선 가중치의 합이 최소인 트리
- 네트워크 설계, 도로 건설, 통신망 구축 등에 활용

### 예시
```
원본 그래프:
  A --7-- B
  |       |
  5       8
  |       |
  D --6-- F

가능한 신장 트리들:
1. A-B(7), A-D(5), D-F(6) = 총 18
2. A-D(5), B-F(8), D-F(6) = 총 19
3. A-B(7), A-D(5), B-F(8) = 총 20  ← 최소 신장 트리!
```

## 특징

- **알고리즘 종류**: 그리디 알고리즘
- **시간 복잡도**: O(E log V) - E는 간선의 개수, V는 정점의 개수
- **공간 복잡도**: O(V + E) - 인접 리스트와 우선순위 큐
- **적용 대상**: 가중치가 있는 무방향 그래프
- **핵심 자료구조**: MinHeap (우선순위 큐)
- **결과**: 항상 최적해를 보장
- **정점 중심 알고리즘**: 정점을 하나씩 MST에 추가

## 동작 원리

프림 알고리즘은 다음 5단계로 동작합니다:

### 1. 초기화
시작 정점을 선택하고, 해당 정점의 인접 간선들을 우선순위 큐(MinHeap)에 추가합니다.

```
시작 정점: A
연결된 정점: {A}
우선순위 큐: [(5,A-D), (7,A-B)]
```

### 2. 간선 선택
우선순위 큐에서 가장 가중치가 작은 간선을 선택합니다.

```
선택된 간선: (5,A-D) ← 가장 작은 가중치
```

### 3. 정점 추가
선택된 간선의 연결되지 않은 정점을 MST에 추가합니다.

```
연결된 정점: {A, D}
MST 간선: [(5,A-D)]
```

### 4. 후보 간선 추가
새로 추가된 정점의 인접 간선 중, 아직 연결되지 않은 정점으로 가는 간선들을 우선순위 큐에 추가합니다.

```
D의 인접 간선: (7,D-E), (6,D-F)
연결되지 않은 정점: E, F
우선순위 큐에 추가: [(6,D-F), (7,A-B), (7,D-E)]
```

### 5. 반복
모든 정점이 연결될 때까지 2-4단계를 반복합니다.

```
반복 과정:
1. (6,D-F) 선택 → F 추가
2. (7,A-B) 선택 → B 추가
3. (7,D-E) 선택 → E 추가
...
```

## MinHeap 자료구조

프림 알고리즘의 핵심은 **MinHeap**을 사용하여 항상 최소 가중치 간선을 효율적으로 선택하는 것입니다.

### 기본 개념

**힙이란?**
- 완전 이진 트리 기반의 자료구조
- 배열로 구현하며, 인덱스 i의 노드에 대해:
  - 부모: `Math.floor((i-1)/2)`
  - 왼쪽 자식: `2*i + 1`
  - 오른쪽 자식: `2*i + 2`

**최소 힙의 특성:**
- 부모 노드는 항상 자식 노드보다 작거나 같음
- 루트 노드(인덱스 0)가 항상 최소값
- **중요**: 왼쪽 자식과 오른쪽 자식 간의 크기는 상관없음!

### 제네릭 구현

Python의 `heapq`와 유사한 기능을 제공하지만, **제네릭 타입**을 지원하여 다양한 데이터 타입을 처리할 수 있습니다.

```typescript
export class MinHeap<T> {
    heap: T[];
    compareFn: (a: T, b: T) => number;

    constructor(compareFn?: (a: T, b: T) => number) {
        this.heap = [];
        this.compareFn = compareFn || ((a: any, b: any) => a - b);
    }
}
```

**제네릭의 장점:**
- 숫자, 문자열, 객체 등 다양한 타입 지원
- 커스텀 비교 함수로 정렬 기준 설정 가능
- 타입 안정성 보장

### 주요 메서드

#### 1. insert(data: T): 요소 삽입
```typescript
insert(data: T): void {
    this.heap.push(data);
    this.heapifyUp();
}
```

**시간 복잡도**: O(log n)
- 배열 끝에 추가: O(1)
- heapifyUp: O(log n)

#### 2. pop(): 최소값 추출
```typescript
pop(): T | null {
    if (this.heap.length === 0) {
        return null;
    }
    
    const root = this.heap[0];
    this.heap[0] = this.heap[this.heap.length - 1];
    this.heap.pop();
    this.heapifyDown();
    return root;
}
```

**시간 복잡도**: O(log n)
- 루트 추출: O(1)
- 마지막 요소를 루트로 이동: O(1)
- heapifyDown: O(log n)

#### 3. peek(): 최소값 확인 (제거하지 않음)
```typescript
peek(): T | null {
    return this.heap.length > 0 ? this.heap[0] : null;
}
```

**시간 복잡도**: O(1)

#### 4. isEmpty(): 힙이 비어있는지 확인
```typescript
isEmpty(): boolean {
    return this.heap.length === 0;
}
```

**시간 복잡도**: O(1)

### heapifyUp과 heapifyDown

#### heapifyUp: 상향 조정
새로운 요소를 힙의 맨 끝에 추가한 후, 힙 속성을 복구하는 과정입니다.

**동작 과정:**
1. 새로 추가된 요소(맨 끝 인덱스)부터 시작
2. 부모 노드와 비교
3. 현재 노드가 부모보다 작으면 교환
4. 루트에 도달하거나 부모보다 크거나 같을 때까지 반복

**예시:**
```
[1, 5, 3]에 0을 추가
→ [1, 5, 3, 0]
→ 0이 부모(5)보다 작으므로 교환 → [1, 0, 3, 5]
→ 0이 부모(1)보다 작으므로 교환 → [0, 1, 3, 5]
```

#### heapifyDown: 하향 조정
루트 노드를 제거한 후, 마지막 요소를 루트로 옮기고 힙 속성을 복구하는 과정입니다.

**동작 과정:**
1. 루트(인덱스 0)부터 시작
2. 왼쪽 자식과 오른쪽 자식 중 가장 작은 값 찾기
3. 현재 노드가 가장 작은 자식보다 크면 교환
4. 리프 노드에 도달하거나 자식들보다 작거나 같을 때까지 반복

**예시:**
```
[1, 3, 2, 7, 5]에서 1(루트)을 제거하고 5를 루트로 이동
→ [5, 3, 2, 7]
→ 5가 자식(2, 3) 중 최소값(2)보다 크므로 교환 → [2, 3, 5, 7]
→ 5가 자식(7)보다 작으므로 종료
```

## 알고리즘 구현

이 섹션에서는 두 가지 Prim 알고리즘 구현을 소개합니다:
1. **기본 Prim 알고리즘**: 간선 중심의 직관적인 구현
2. **개선된 Prim 알고리즘**: 노드의 최소 가중치를 추적하는 효율적인 구현

### 기본 Prim 알고리즘

#### 전체 코드 구조

```typescript
type Edge = [number, string, string];  // [가중치, 노드1, 노드2]

function prim(startNode: string, edges: Edge[]): Edge[] {
    const mst: Edge[] = [];
    
    // 1. 인접 간선 리스트 생성
    const adjacentEdges = new Map<string, Edge[]>();
    
    for (const [weight, n1, n2] of edges) {
        // 무방향 그래프이므로 양방향으로 추가
        if (!adjacentEdges.has(n1)) {
            adjacentEdges.set(n1, []);
        }
        adjacentEdges.get(n1)!.push([weight, n1, n2]);
        
        if (!adjacentEdges.has(n2)) {
            adjacentEdges.set(n2, []);
        }
        adjacentEdges.get(n2)!.push([weight, n2, n1]);
    }
    
    // 2. 연결된 노드들을 추적
    const connectedNodes = new Set<string>([startNode]);
    
    // 3. 후보 간선 리스트를 MinHeap으로 관리
    const candidateEdgeHeap = new MinHeap<Edge>((a, b) => a[0] - b[0]);
    
    // 4. 시작 노드의 인접 간선들을 힙에 추가
    const startEdges = adjacentEdges.get(startNode) || [];
    for (const edge of startEdges) {
        candidateEdgeHeap.insert(edge);
    }
    
    // 5. 힙이 빌 때까지 반복
    while (!candidateEdgeHeap.isEmpty()) {
        const edge = candidateEdgeHeap.pop();
        if (edge === null) break;
        
        const [weight, n1, n2] = edge;
        
        // n2가 아직 연결되지 않은 노드라면
        if (!connectedNodes.has(n2)) {
            // 연결된 노드에 추가
            connectedNodes.add(n2);
            // MST에 간선 추가
            mst.push([weight, n1, n2]);
            
            // n2의 인접 간선들을 후보 리스트에 추가
            const n2Edges = adjacentEdges.get(n2) || [];
            for (const adjacentEdge of n2Edges) {
                // 아직 연결되지 않은 노드로 가는 간선만 추가
                if (!connectedNodes.has(adjacentEdge[2])) {
                    candidateEdgeHeap.insert(adjacentEdge);
                }
            }
        }
    }
    
    return mst;
}
```

### 구현 세부사항

#### 1. 인접 간선 리스트 생성
```typescript
const adjacentEdges = new Map<string, Edge[]>();
```
- 각 정점의 인접 간선들을 저장
- 무방향 그래프이므로 양방향으로 간선 추가
- Python의 `defaultdict(list)`와 유사한 역할

#### 2. 연결된 노드 추적
```typescript
const connectedNodes = new Set<string>([startNode]);
```
- 이미 MST에 포함된 정점들을 추적
- 사이클 방지에 사용

#### 3. MinHeap으로 우선순위 큐 구현
```typescript
const candidateEdgeHeap = new MinHeap<Edge>((a, b) => a[0] - b[0]);
```
- 가중치(첫 번째 요소)를 기준으로 비교
- 항상 최소 가중치 간선을 O(log n)에 추출

#### 4. 그리디 선택
```typescript
const edge = candidateEdgeHeap.pop();  // 최소 가중치 간선 선택
```
- 매 단계에서 가장 작은 가중치 간선 선택
- 그리디 알고리즘의 핵심

### 개선된 Prim 알고리즘 (heapdict 방식)

Python의 `heapdict`와 유사한 방식으로 구현된 개선된 Prim 알고리즘입니다. 각 노드까지의 최소 가중치를 명시적으로 추적하여 더 효율적으로 동작합니다.

#### 핵심 아이디어

기본 Prim 알고리즘과의 차이점:
- **keys Map**: 각 노드까지의 최소 가중치를 저장
- **pi Map**: 각 노드가 MST에 추가될 때, **어떤 노드와의 간선을 통해 추가되었는지**를 추적
  - 예: `pi['D'] = 'A'` → D는 A와의 간선을 통해 MST에 추가됨
  - **중요**: 무방향 그래프이므로 "부모-자식" 관계가 아니라, 단순히 "어떤 노드와의 간선으로 추가되었는지"를 의미
  - MST를 구성할 때 간선을 추적하기 위한 정보일 뿐, 방향성이 있는 부모-자식 관계는 아님
- **힙 구조**: `[weight, node]` 형태로 저장하여 최소 가중치 노드를 효율적으로 선택

#### 전체 코드 구조

```typescript
const advancedPrim = (startNode: string, edges: Edge[]): [Edge[], number] => {
    const mst: Edge[] = [];
    
    // 그래프를 인접 리스트로 변환 (무방향 그래프)
    const graph = new Map<string, Map<string, number>>();
    
    // 모든 노드 수집
    const allNodes = new Set<string>();
    for (const [weight, n1, n2] of edges) {
        allNodes.add(n1);
        allNodes.add(n2);
        
        // n1 -> n2
        if (!graph.has(n1)) {
            graph.set(n1, new Map());
        }
        graph.get(n1)!.set(n2, weight);
        
        // n2 -> n1 (무방향)
        if (!graph.has(n2)) {
            graph.set(n2, new Map());
        }
        graph.get(n2)!.set(n1, weight);
    }
    
    // keys: 각 노드까지의 최소 가중치
    // pi: 각 노드가 MST에 추가될 때, 어떤 노드와의 간선을 통해 추가되었는지를 추적
    //     예: pi['D'] = 'A' → D는 A와의 간선을 통해 MST에 추가됨
    const keys = new Map<string, number>();
    const pi = new Map<string, string | null>(); // [node, MST에 추가될 때 연결된 노드]
    const visited = new Set<string>();
    
    // 모든 노드를 무한대로 초기화
    for (const node of allNodes) {
        keys.set(node, Infinity);
        pi.set(node, null);
    }
    
    // 시작 노드는 0으로 설정
    keys.set(startNode, 0);
    pi.set(startNode, startNode);
    
    // MinHeap: [weight, node] 형태로 저장
    const heap = new MinHeap<[number, string]>((a, b) => a[0] - b[0]);
    
    // 모든 노드를 힙에 추가
    for (const [node, weight] of keys.entries()) {
        heap.insert([weight, node]);
    }
    
    // 힙이 빌 때까지 반복
    while (!heap.isEmpty()) {
        const item = heap.pop();
        if (item === null) break;
        
        const [currentKey, currentNode] = item;
        
        // 이미 처리된 노드는 건너뛰기 (힙에 중복으로 들어갈 수 있음)
        if (visited.has(currentNode)) {
            continue;
        }
        
        visited.add(currentNode);
        
        // MST에 간선 추가 (시작 노드가 아닌 경우)
        const parent = pi.get(currentNode);
        if (parent !== null && parent !== undefined && parent !== currentNode) {
            mst.push([currentKey, parent, currentNode]);
        }
        
        // 인접 노드들의 가중치 업데이트
        const neighbors = graph.get(currentNode);
        if (neighbors) {
            for (const [adjacent, weight] of neighbors.entries()) {
                // 아직 방문하지 않았고, 더 작은 가중치를 발견한 경우
                if (!visited.has(adjacent) && weight < keys.get(adjacent)!) {
                    keys.set(adjacent, weight);
                    pi.set(adjacent, currentNode);
                    // 힙에 업데이트된 가중치로 다시 추가
                    heap.insert([weight, adjacent]);
                }
            }
        }
    }
    
    // 총 가중치 계산
    let total = 0;
    for (const [weight] of mst) {
        total += weight;
    }
    
    return [mst, total];
}
```

#### 구현 세부사항

##### 1. 그래프 구조 변환
```typescript
const graph = new Map<string, Map<string, number>>();
```
- 인접 리스트를 `Map<string, Map<string, number>>` 형태로 저장
- 각 노드에서 인접 노드와 가중치를 빠르게 조회 가능

##### 2. keys와 pi 초기화
```typescript
const keys = new Map<string, number>();  // 각 노드까지의 최소 가중치
const pi = new Map<string, string | null>();  // 각 노드가 MST에 추가될 때 연결된 노드
```
- 모든 노드를 무한대로 초기화
- 시작 노드는 0으로 설정
- **pi의 의미**: `pi[node]`는 node가 MST에 추가될 때, **어떤 노드와의 간선을 통해 추가되었는지**를 나타냄
  - 예: A에서 시작해서 A-D 간선(5)을 통해 D가 추가되면, `pi['D'] = 'A'`
  - **중요**: 무방향 그래프이므로 "부모"가 아니라 "연결된 노드"를 의미
  - 간선 (A, D)와 (D, A)는 동일하므로, 단순히 MST 구성 과정의 추적 정보일 뿐

##### 3. 힙에 모든 노드 추가
```typescript
for (const [node, weight] of keys.entries()) {
    heap.insert([weight, node]);
}
```
- 초기에 모든 노드를 힙에 추가
- 가중치가 업데이트될 때마다 힙에 다시 추가 (중복 허용)

##### 4. 가중치 업데이트
```typescript
if (!visited.has(adjacent) && weight < keys.get(adjacent)!) {
    keys.set(adjacent, weight);
    pi.set(adjacent, currentNode);  // adjacent가 MST에 추가될 때, currentNode와의 간선을 통해 추가됨
    heap.insert([weight, adjacent]);
}
```
- 더 작은 가중치를 발견하면 업데이트
- `pi[adjacent] = currentNode`: adjacent 노드가 MST에 추가될 때, currentNode와의 간선을 통해 추가됨을 기록
- 힙에 중복으로 추가되지만, `visited` Set으로 필터링

#### 기본 알고리즘 vs 개선된 알고리즘

| 특징 | 기본 Prim | 개선된 Prim |
|------|----------|------------|
| **데이터 구조** | 간선 중심 (Edge[]) | 노드 중심 (keys, pi) |
| **힙 내용** | 간선 리스트 | [weight, node] 쌍 |
| **중복 처리** | Set으로 간단히 처리 | visited Set으로 필터링 |
| **가중치 추적** | 암묵적 | 명시적 (keys Map) |
| **연결 노드 추적** | 간선에서 추론 | 명시적 (pi Map) |
| **Python 유사성** | 일반적인 구현 | heapdict 방식 |

#### pi Map에 대한 중요 설명

**pi는 "부모"가 아닙니다!**

Prim 알고리즘은 무방향 그래프에서 작동하므로, "부모-자식" 관계는 없습니다. `pi`는 단순히 **MST를 구성할 때 각 노드가 어떤 노드와의 간선을 통해 추가되었는지**를 추적하는 정보입니다.

**예시:**
```
시작: A
1. A-D 간선(5)을 통해 D 추가 → pi['D'] = 'A'
   → 의미: D는 A와의 간선을 통해 MST에 추가됨
   
2. D-F 간선(6)을 통해 F 추가 → pi['F'] = 'D'
   → 의미: F는 D와의 간선을 통해 MST에 추가됨
```

**중요한 점:**
- `pi['D'] = 'A'`는 "A가 D의 부모"가 아니라, "D가 MST에 추가될 때 A와의 간선을 사용했다"는 의미
- 무방향 그래프이므로 간선 (A, D)와 (D, A)는 동일
- MST는 트리이므로, 시작 노드를 루트로 보면 각 노드는 하나의 "연결된 노드"를 가지지만, 이것은 단순히 MST 구성 과정의 추적 정보일 뿐
- "부모"라는 용어는 혼란을 줄 수 있으므로, "연결된 노드" 또는 "MST에 추가될 때 연결된 노드"라고 이해하는 것이 정확합니다

#### `pi` Map의 의미 이해하기

**핵심 개념**: `pi[node]`는 "node가 MST에 추가될 때, 어떤 노드와 연결되어 추가되었는가"를 저장합니다.

**예시로 이해하기:**

```
시작 노드: A
그래프: A-D(5), D-F(6), A-B(7), ...

실행 과정:
1. A가 시작 노드로 MST에 추가됨
   - pi['A'] = 'A' (시작 노드는 자기 자신)

2. D가 MST에 추가됨 (A-D 간선으로)
   - pi['D'] = 'A'  → "D가 MST에 추가될 때 A와 연결되어 추가됨"
   - MST 간선: [5, 'A', 'D']

3. F가 MST에 추가됨 (D-F 간선으로)
   - pi['F'] = 'D'  → "F가 MST에 추가될 때 D와 연결되어 추가됨"
   - MST 간선: [6, 'D', 'F']

4. B가 MST에 추가됨 (A-B 간선으로)
   - pi['B'] = 'A'  → "B가 MST에 추가될 때 A와 연결되어 추가됨"
   - MST 간선: [7, 'A', 'B']
```

**"부모"라는 용어에 대해:**

- Prim 알고리즘은 **무방향 그래프**에서 작동합니다
- A-D와 D-A는 동일한 간선입니다
- `pi['D'] = 'A'`는 "D가 A와 연결되어 추가됨"을 의미할 뿐, 방향성을 의미하지 않습니다
- 다만, MST를 **트리 구조**로 볼 때, 시작 노드(A)를 루트로 하면:
  - A는 루트
  - D는 A의 "자식" (또는 A가 D의 "부모")
  - F는 D의 "자식" (또는 D가 F의 "부모")
- 따라서 `pi`를 "부모"라고 부르는 것은 MST를 트리로 해석할 때의 개념입니다

**요약:**
- `pi[node]` = node가 MST에 추가될 때 연결된 노드
- 무방향 그래프이므로 실제로는 단순히 "연결 관계"를 의미
- MST를 트리로 볼 때만 "부모-자식" 관계로 해석 가능

#### 장점

1. **명시적 가중치 추적**: 각 노드까지의 최소 가중치를 명확히 추적
2. **연결 추적**: MST 구성 시 각 노드가 어떤 노드와의 간선을 통해 추가되었는지 명시적으로 저장
3. **heapdict 호환성**: Python의 `heapdict`와 유사한 방식으로 이해하기 쉬움
4. **총 가중치 반환**: 함수가 MST와 총 가중치를 함께 반환

#### 주의사항

- 힙에 중복 노드가 들어갈 수 있지만, `visited` Set으로 필터링하여 문제 없음
- 시간 복잡도는 기본 알고리즘과 동일하게 O(E log V)

## 시간 복잡도

| 연산 | 시간 복잡도 | 설명 |
|------|------------|------|
| 인접 리스트 생성 | O(E) | 모든 간선을 한 번씩 처리 |
| MinHeap 초기화 | O(1) | 빈 힙 생성 |
| insert 연산 | O(log V) | 최대 V개의 간선이 힙에 존재 |
| pop 연산 | O(log V) | 최대 V번 호출 |
| 전체 알고리즘 | **O(E log V)** | E개의 간선 처리 × log V |

**최적화 포인트:**
- MinHeap 사용: 최소값 추출을 O(log V)에 수행
- Set 사용: 연결된 노드 확인을 O(1)에 수행
- 인접 리스트: 각 정점의 인접 간선을 O(1)에 접근

**밀집 그래프 vs 희소 그래프:**
- **밀집 그래프** (E ≈ V²): O(V² log V)
- **희소 그래프** (E ≈ V): O(V log V)

## 실행 예시

### 예제 그래프

```
정점: A, B, C, D, E, F, G
간선:
  A - B: 7    B - C: 8    D - E: 7
  A - D: 5    B - D: 9    D - F: 6
  B - E: 7    C - E: 5    E - F: 8
  E - G: 9    F - G: 11
```

### 실행 과정 (시작 정점: A)

```
=== 초기 상태 ===
연결된 정점: {A}
우선순위 큐: [(5,A-D), (7,A-B)]

=== 1단계 ===
✅ 간선 선택: (5,A-D) - 가중치 5
   D 추가 → 연결된 정점: {A, D}
   MST: [(5,A-D)]
   D의 인접 간선 추가: (7,D-E), (6,D-F)
   우선순위 큐: [(6,D-F), (7,A-B), (7,D-E)]

=== 2단계 ===
✅ 간선 선택: (6,D-F) - 가중치 6
   F 추가 → 연결된 정점: {A, D, F}
   MST: [(5,A-D), (6,D-F)]
   F의 인접 간선 추가: (8,E-F), (11,F-G)
   우선순위 큐: [(7,A-B), (7,D-E), (8,E-F), (11,F-G)]

=== 3단계 ===
✅ 간선 선택: (7,A-B) - 가중치 7
   B 추가 → 연결된 정점: {A, D, F, B}
   MST: [(5,A-D), (6,D-F), (7,A-B)]
   B의 인접 간선 추가: (8,B-C), (9,B-D), (7,B-E)
   우선순위 큐: [(7,B-E), (7,D-E), (8,B-C), (8,E-F), (9,B-D), (11,F-G)]

=== 4단계 ===
✅ 간선 선택: (7,B-E) - 가중치 7
   E 추가 → 연결된 정점: {A, D, F, B, E}
   MST: [(5,A-D), (6,D-F), (7,A-B), (7,B-E)]
   E의 인접 간선 추가: (5,C-E), (9,E-G)
   우선순위 큐: [(5,C-E), (7,D-E), (8,B-C), (8,E-F), (9,B-D), (9,E-G), (11,F-G)]

=== 5단계 ===
✅ 간선 선택: (5,C-E) - 가중치 5
   C 추가 → 연결된 정점: {A, D, F, B, E, C}
   MST: [(5,A-D), (6,D-F), (7,A-B), (7,B-E), (5,C-E)]
   C의 인접 간선 추가: (8,B-C)
   우선순위 큐: [(7,D-E), (8,B-C), (8,E-F), (9,B-D), (9,E-G), (11,F-G)]

=== 6단계 ===
❌ 간선 (7,D-E): D와 E가 이미 연결됨 → 건너뜀
❌ 간선 (8,B-C): B와 C가 이미 연결됨 → 건너뜀
❌ 간선 (8,E-F): E와 F가 이미 연결됨 → 건너뜀
❌ 간선 (9,B-D): B와 D가 이미 연결됨 → 건너뜀
✅ 간선 선택: (9,E-G) - 가중치 9
   G 추가 → 연결된 정점: {A, D, F, B, E, C, G}
   MST: [(5,A-D), (6,D-F), (7,A-B), (7,B-E), (5,C-E), (9,E-G)]

🎉 MST 완성! (7개 정점 → 6개 간선)
```

### 실행 결과 (터미널)

```bash
=== Prim 알고리즘 테스트 ===
입력 간선: [[7,'A','B'], [5,'A','D'], ...]

시작 노드: A

최소 신장 트리(MST):
  A - D: 5
  D - F: 6
  A - B: 7
  B - E: 7
  C - E: 5
  E - G: 9

총 가중치: 39
```

## 장점과 단점

### 장점

1. **밀집 그래프에 효율적**
   - 정점 중심 알고리즘
   - 간선이 많을 때 유리
   - O(E log V)는 간선 수에 비례

2. **구현이 직관적**
   - 정점을 하나씩 추가하는 방식
   - 이해하기 쉬운 알고리즘

3. **항상 최적해 보장**
   - 그리디 알고리즘이지만 항상 MST를 찾음
   - 증명된 정확성

4. **온라인 알고리즘 가능**
   - 동적으로 간선 추가 가능
   - 부분 그래프에서도 작동

### 단점

1. **우선순위 큐 필요**
   - MinHeap 구현 필요
   - 추가 메모리 사용

2. **정점 중심 알고리즘**
   - 정점이 많으면 비효율적
   - 희소 그래프에는 크루스칼이 더 효율적

3. **시작 정점에 의존**
   - 시작 정점 선택에 따라 실행 경로가 달라짐
   - 하지만 최종 결과는 동일

## 크루스칼 vs 프림

| 특징 | 크루스칼 | 프림 |
|------|---------|------|
| **접근 방식** | 간선 중심 | 정점 중심 |
| **시간 복잡도** | O(E log E) | O(E log V) |
| **적합한 그래프** | 희소 그래프 | 밀집 그래프 |
| **자료구조** | Union-Find | 우선순위 큐 (MinHeap) |
| **구현 난이도** | 중간 | 쉬움 |
| **간선 정렬** | 필요 | 불필요 |
| **시작 정점** | 불필요 | 필요 |

**선택 기준:**
- **간선 수 << 정점²** (희소 그래프) → 크루스칼
- **간선 수 ≈ 정점²** (밀집 그래프) → 프림

**예시:**
- 도로 네트워크 (희소) → 크루스칼
- 완전 그래프 (밀집) → 프림

## 실행 방법

### TypeScript로 실행

```bash
# 프로젝트 루트에서
npx ts-node Ch2/Prim/Prim.ts
```

### 예상 출력

```
=== Prim 알고리즘 테스트 ===
입력 간선: [
  [ 7, 'A', 'B' ], [ 5, 'A', 'D' ],
  [ 8, 'B', 'C' ], [ 9, 'B', 'D' ], [ 7, 'B', 'E' ],
  [ 5, 'C', 'E' ],
  [ 7, 'D', 'E' ], [ 6, 'D', 'F' ],
  [ 8, 'E', 'F' ], [ 9, 'E', 'G' ],
  [ 11, 'F', 'G' ]
]

시작 노드: A

최소 신장 트리(MST):
  A - D: 5
  D - F: 6
  A - B: 7
  B - E: 7
  C - E: 5
  E - G: 9

총 가중치: 39

=== 개선된 Prim 알고리즘 테스트 ===
시작 노드: A

최소 신장 트리(MST):
  A - D: 5
  D - F: 6
  A - B: 7
  D - E: 7
  E - C: 5
  E - G: 9

총 가중치: 39
```

두 알고리즘 모두 동일한 결과를 반환하며, 총 가중치도 39로 동일합니다.

---

## 참고 자료

- **응용 분야**
  - 네트워크 설계 (최소 비용으로 모든 노드 연결)
  - 도로 건설 (최소 비용으로 모든 도시 연결)
  - 전력망 구축
  - 클러스터링 알고리즘

- **관련 알고리즘**
  - 크루스칼 알고리즘 (Kruskal's Algorithm)
  - 보루프카 알고리즘 (Borůvka's Algorithm)
  - 다익스트라 알고리즘 (Dijkstra's Algorithm)

---

💡 **핵심 요약**

프림 알고리즘은:
1. 시작 정점에서 출발
2. 연결된 정점과 연결되지 않은 정점을 연결하는 간선 중 최소 가중치 간선 선택
3. MinHeap을 사용하여 효율적으로 최소값 추출
4. 모든 정점이 연결될 때까지 반복
5. O(E log V) 시간에 최소 신장 트리 구성

**두 가지 구현 방식:**
- **기본 Prim**: 간선 중심의 직관적인 구현
- **개선된 Prim**: 노드의 최소 가중치를 명시적으로 추적하는 heapdict 방식

**MinHeap의 마법**: 제네릭 타입과 커스텀 비교 함수를 통해 다양한 데이터 타입을 효율적으로 처리할 수 있습니다! 🚀

