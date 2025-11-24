// Prim 알고리즘 구현
// MinHeap을 이용하여 최소 신장 트리 구성

import { MinHeap } from "./HeapType";

type Edge = [number, string, string]; // [가중치, 노드1, 노드2]

const myedges: Edge[] = [
    [7, 'A', 'B'], [5, 'A', 'D'],
    [8, 'B', 'C'], [9, 'B', 'D'], [7, 'B', 'E'],
    [5, 'C', 'E'],
    [7, 'D', 'E'], [6, 'D', 'F'],
    [8, 'E', 'F'], [9, 'E', 'G'],
    [11, 'F', 'G']
];

/**
 * Prim 알고리즘
 * @param startNode 시작 노드
 * @param edges 간선 리스트 [가중치, 노드1, 노드2]
 * @returns 최소 신장 트리(MST)의 간선 리스트
 */
function prim(startNode: string, edges: Edge[]): Edge[] {
    const mst: Edge[] = [];
    
    // 인접 간선 리스트 생성
    const adjacentEdges = new Map<string, Edge[]>();
    
    for (const [weight, n1, n2] of edges) {
        // n1에서 n2로 가는 간선
        if (!adjacentEdges.has(n1)) {
            adjacentEdges.set(n1, []);
        }
        adjacentEdges.get(n1)!.push([weight, n1, n2]);
        
        // n2에서 n1로 가는 간선 (무방향 그래프)
        if (!adjacentEdges.has(n2)) {
            adjacentEdges.set(n2, []);
        }
        adjacentEdges.get(n2)!.push([weight, n2, n1]);
    }
    
    // 연결된 노드들을 추적
    const connectedNodes = new Set<string>([startNode]);
    
    // 후보 간선 리스트를 MinHeap으로 관리 (가중치 기준)
    const candidateEdgeHeap = new MinHeap<Edge>((a, b) => a[0] - b[0]);
    
    // 시작 노드의 인접 간선들을 힙에 추가 (heapify 역할)
    const startEdges = adjacentEdges.get(startNode) || [];
    for (const edge of startEdges) {
        candidateEdgeHeap.insert(edge);
    }
    
    // 힙이 빌 때까지 반복
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

/**
 * 개선된 Prim 알고리즘 (heapdict 방식)
 * 각 노드의 최소 가중치를 추적하여 더 효율적으로 동작
 * @param startNode 시작 노드
 * @param edges 간선 리스트 [가중치, 노드1, 노드2]
 * @returns [최소 신장 트리(MST)의 간선 리스트, 총 가중치]
 */
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
    
    // keys: 각 노드까지의 최소 가중치 (힙에 저장할 데이터)
    // pi: 각 노드가 MST에 추가될 때, 어떤 노드와의 간선을 통해 추가되었는지를 추적
    //     예: pi['D'] = 'A' → D는 A와의 간선을 통해 MST에 추가됨
    //     주의: 무방향 그래프이므로 "부모"가 아니라 "연결된 노드"를 의미
    const keys = new Map<string, number>(); // [node, weight]
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
        // pi[currentNode]는 currentNode가 MST에 추가될 때, 어떤 노드와의 간선을 통해 추가되었는지를 의미
        // 예: pi['D'] = 'A' → D는 A와의 간선을 통해 MST에 추가됨
        // 주의: 무방향 그래프이므로 "부모"가 아니라 "연결된 노드"를 의미
        const connectedNode = pi.get(currentNode);
        if (connectedNode !== null && connectedNode !== undefined && connectedNode !== currentNode) {
            // MST에 간선 추가: [가중치, 연결된 노드, 현재 노드]
            mst.push([currentKey, connectedNode, currentNode]);
        }
        
        // 인접 노드들의 가중치 업데이트
        const neighbors = graph.get(currentNode);
        if (neighbors) {
            for (const [adjacent, weight] of neighbors.entries()) {
                // 아직 방문하지 않았고, 더 작은 가중치를 발견한 경우
                if (!visited.has(adjacent) && weight < keys.get(adjacent)!) {
                    keys.set(adjacent, weight);
                    // adjacent가 MST에 추가될 때, currentNode와의 간선을 통해 추가됨을 기록
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

// 테스트 실행
console.log('=== Prim 알고리즘 테스트 ===');
console.log('입력 간선:', myedges);
console.log('\n시작 노드: A');
const result = prim('A', myedges);
console.log('\n최소 신장 트리(MST):');
result.forEach(([weight, n1, n2]) => {
    console.log(`  ${n1} - ${n2}: ${weight}`);
});

let totalWeight = 0;
result.forEach(([weight]) => {
    totalWeight += weight;
});
console.log(`\n총 가중치: ${totalWeight}`);

// 개선된 Prim 알고리즘 테스트
console.log('\n=== 개선된 Prim 알고리즘 테스트 ===');
console.log('시작 노드: A');
const [advancedResult, advancedTotalWeight] = advancedPrim('A', myedges);
console.log('\n최소 신장 트리(MST):');
advancedResult.forEach(([weight, n1, n2]) => {
    console.log(`  ${n1} - ${n2}: ${weight}`);
});
console.log(`\n총 가중치: ${advancedTotalWeight}`);

