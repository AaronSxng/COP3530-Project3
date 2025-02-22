// algorithms.js

export function dijkstra(graph, start, end) {
    let start_time = performance.now();
    let priority_queue = [{ node: start, distance: 0 }];
    let distances = new Map();
    let previous = new Map();
    distances.set(start, 0);

    for (let node of graph.keys()) {
        if (node !== start) {
            distances.set(node, Infinity);
        }
        previous.set(node, null);
    }

    while (priority_queue.length > 0) {
        let current = priority_queue.shift();
        let current_node = current.node;

        if (current_node === end) {
            let path = [];
            let temp = current_node;
            while (temp) {
                path.push(temp);
                temp = previous.get(temp);
            }
            let end_time = performance.now();
            return [(end_time - start_time) / 1000, path.reverse()];
        }

        if (graph.has(current_node)) {
            for (let neighbor of graph.get(current_node)) {
                let distance = distances.get(current_node) + 1;  // Assume each link has a distance of 1
                if (distance < distances.get(neighbor)) {
                    distances.set(neighbor, distance);
                    previous.set(neighbor, current_node);
                    priority_queue.push({ node: neighbor, distance });
                }
            }
        }
    }
    let end_time = performance.now();
    return [(end_time - start_time) / 1000, []];  // Return empty path if not found
}

export function dfs_shortest_path(graph, start, end) {
    let start_time = performance.now();
    let stack = [[start]];
    let visited = new Set();

    while (stack.length > 0) {
        let path = stack.pop();
        let node = path[path.length - 1];

        if (node === end) {
            let end_time = performance.now();
            return [(end_time - start_time) / 1000, path];
        }

        if (!visited.has(node)) {
            visited.add(node); 
            if (graph.has(node)) {
                for (let neighbor of graph.get(node)) {
                    if (!visited.has(neighbor)) {
                        stack.push([...path, neighbor]); 
                    }
                }
            }
        }
    }

    let end_time = performance.now();
    return [(end_time - start_time) / 1000, []];  // Return empty path if not found
}

export function bfs_shortest_path(graph, start, end) {
    let start_time = performance.now();
    let queue = [[start]];
    let visited = new Set();

    while (queue.length > 0) {
        let path = queue.shift();
        let node = path[path.length - 1];

        if (node === end) {
            let end_time = performance.now();
            return [(end_time - start_time) / 1000, path];
        }

        if (!visited.has(node)) {
            visited.add(node); 
            if (graph.has(node)) {
                for (let neighbor of graph.get(node)) {
                    if (!visited.has(neighbor)) {
                        queue.push([...path, neighbor]); 
                    }
                }
            }
        }
    }

    let end_time = performance.now();
    return [(end_time - start_time) / 1000, []];  // Return empty path if not found
}
