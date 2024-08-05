import time
import heapq

def dijkstra(graph, start, end):
    start_time = time.time()  # Record the start time
    priority_queue = [(0, start)]  # Initialize the priority queue with the start node
    distances = {vertex: float('inf') for vertex in graph}  # Set initial distances to infinity
    distances[start] = 0  # Distance to start node is zero
    previous_nodes = {vertex: None for vertex in graph}  # Track previous nodes

    while priority_queue:
        current_distance, current_vertex = heapq.heappop(priority_queue)  # Get the node with the smallest distance

        if current_vertex == end:  # If we reach the end node, reconstruct the path
            path = []
            while current_vertex is not None:  # Backtrack from end to start
                path.append(current_vertex)
                current_vertex = previous_nodes[current_vertex]
            end_time = time.time()  # Record end time
            return end_time - start_time, path[::-1]  # Return elapsed time and the path

        if current_distance > distances[current_vertex]:
            continue  # Skip if we have already found a shorter way to the current node

        for neighbor in graph[current_vertex]:  # Check all neighbors
            distance = current_distance + 1  # Assume each edge has weight 1
            if distance < distances[neighbor]:  # If found a shorter path
                distances[neighbor] = distance  # Update distance
                previous_nodes[neighbor] = current_vertex  # Update the path
                heapq.heappush(priority_queue, (distance, neighbor))  # Push neighbor to the queue

    end_time = time.time()  # Record end time if no path is found
    return end_time - start_time, None  # Return elapsed time and None if no path

def dfs_shortest_path(graph, start, end):
    start_time = time.time()  # Record start time

    def dfs(current, end, path, visited, paths):
        if current in visited:
            return  # Skip already visited nodes
        visited.add(current)  # Mark current node as visited
        path.append(current)  # Add current node to path
        if current == end:  # If end node is reached
            paths.append(list(path))  # Store the current path
        else:
            for neighbor in graph.get(current, []):  # Explore neighbors
                if neighbor not in visited:
                    dfs(neighbor, end, path, visited, paths)  # Recursive DFS call
        path.pop()  # Backtrack
        visited.remove(current)  # Unmark current node

    paths = []
    dfs(start, end, [], set(), paths)  # Start DFS
    shortest_path = min(paths, key=len) if paths else None  # Find the shortest path
    end_time = time.time()  # Record end time
    return end_time - start_time, shortest_path  # Return elapsed time and the shortest path
