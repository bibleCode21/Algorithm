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

