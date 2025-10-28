// MinHeap 제네릭 구현
// Prim 알고리즘을 위한 우선순위 큐

export class MinHeap<T> {
    heap: T[];
    compareFn: (a: T, b: T) => number;

    /**
     * MinHeap 생성자
     * @param compareFn 비교 함수. a가 b보다 작으면 음수, 같으면 0, 크면 양수 반환
     *                  기본값: 숫자 비교
     */
    constructor(compareFn?: (a: T, b: T) => number) {
        this.heap = [];
        this.compareFn = compareFn || ((a: any, b: any) => a - b);
    }

    /**
     * 힙에 요소 삽입
     */
    insert(data: T): void {
        this.heap.push(data);
        this.heapifyUp();
    }

    /**
     * 삽입 후 힙 속성 유지 (Min Heap)
     */
    heapifyUp(): void {
        let index = this.heap.length - 1;
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            // Min Heap: 자식이 부모보다 작으면 교환
            if (this.compareFn(this.heap[index], this.heap[parentIndex]) < 0) {
                [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
                index = parentIndex;
            } else {
                break;
            }
        }
    }

    /**
     * 최소값(루트) 추출
     */
    pop(): T | null {
        if (this.heap.length === 0) {
            return null;
        }

        if (this.heap.length === 1) {
            return this.heap.pop()!;
        }

        const root = this.heap[0];
        this.heap[0] = this.heap[this.heap.length - 1];
        this.heap.pop();
        this.heapifyDown();
        return root;
    }

    /**
     * 추출 후 힙 속성 유지 (Min Heap)
     */
    heapifyDown(): void {
        let index = 0;
        while (index < this.heap.length) {
            const leftChildIndex = index * 2 + 1;
            const rightChildIndex = index * 2 + 2;

            if (leftChildIndex >= this.heap.length) {
                break;
            }

            let smallestIndex = index;

            // 왼쪽 자식과 비교
            if (leftChildIndex < this.heap.length && 
                this.compareFn(this.heap[leftChildIndex], this.heap[smallestIndex]) < 0) {
                smallestIndex = leftChildIndex;
            }

            // 오른쪽 자식과 비교
            if (rightChildIndex < this.heap.length && 
                this.compareFn(this.heap[rightChildIndex], this.heap[smallestIndex]) < 0) {
                smallestIndex = rightChildIndex;
            }

            // 현재 노드가 가장 작으면 종료
            if (smallestIndex === index) {
                break;
            }

            // 교환
            [this.heap[index], this.heap[smallestIndex]] = [this.heap[smallestIndex], this.heap[index]];
            index = smallestIndex;
        }
    }

    /**
     * 힙이 비어있는지 확인
     */
    isEmpty(): boolean {
        return this.heap.length === 0;
    }

    /**
     * 힙의 크기 반환
     */
    size(): number {
        return this.heap.length;
    }

    /**
     * 최소값 확인 (제거하지 않음)
     */
    peek(): T | null {
        return this.heap.length > 0 ? this.heap[0] : null;
    }
}

// 테스트 코드
// 숫자 MinHeap 테스트
const numberHeap = new MinHeap<number>();
numberHeap.insert(15);
numberHeap.insert(10);
numberHeap.insert(8);
numberHeap.insert(5);
numberHeap.insert(4);
numberHeap.insert(20);
console.log('숫자 MinHeap:', numberHeap.heap); // [4, 5, 8, 15, 10, 20]

// 튜플 MinHeap 테스트 (Prim 알고리즘용)
// [가중치, 노드1, 노드2] 형태
type Edge = [number, string, string];
const edgeHeap = new MinHeap<Edge>((a, b) => a[0] - b[0]); // 첫 번째 요소(가중치)로 비교
edgeHeap.insert([7, 'A', 'B']);
edgeHeap.insert([5, 'A', 'D']);
edgeHeap.insert([8, 'B', 'C']);
edgeHeap.insert([3, 'X', 'Y']);
console.log('엣지 MinHeap:', edgeHeap.heap); // 가중치 기준으로 정렬됨
console.log('최소 가중치 엣지:', edgeHeap.pop()); // [3, 'X', 'Y']

