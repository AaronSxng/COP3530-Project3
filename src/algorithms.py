import time
import heapq

def dijkstra(graph, start, end):
    # Record the start time for performance measurement
    start_time = time.time()
    
    # Initialize the priority queue with the starting vertex and distance 0
    priority_queue = [(0, start)]
    
    # Set initial distances to infinity for all vertices
    distances = {vertex: float('inf') for vertex in graph}
    distances[start] = 0
    
    # Dictionary to store the previous node for path reconstruction
    previous_nodes = {vertex: None for vertex in graph}

    while priority_queue:
        # Get the vertex with the smallest distance
        current_distance, current_vertex = heapq.heappop(priority_queue)

        # If we reached the end vertex, reconstruct the path and return it with the elapsed time
        if current_vertex == end:
            path = []
            while current_vertex is not None:
                path.append(current_vertex)
                current_vertex = previous_nodes[current_vertex]
            end_time = time.time()
            return end_time - start_time, path[::-1]  # Return time taken and path

        # Skip if the distance is not optimal
        if current_distance > distances[current_vertex]:
            continue

        # Explore neighbors of the current vertex
        for neighbor in graph[current_vertex]:
            distance = current_distance + 1  # Assume all edges have a weight of 1
            if distance < distances[neighbor]:
                # Update the shortest distance and path
                distances[neighbor] = distance
                previous_nodes[neighbor] = current_vertex
                heapq.heappush(priority_queue, (distance, neighbor))

    # If no path is found, return None with the elapsed time
    end_time = time.time()
    return end_time - start_time, None

def dfs_shortest_path(graph, start, end):
    # Record the start time for performance measurement
    start_time = time.time()

    # Helper function for Depth-First Search
    def dfs(current, end, path, visited, paths):
        if current in visited:
            return
        visited.add(current)
        path.append(current)
        if current == end:
            paths.append(list(path))
        else:
            for neighbor in graph.get(current, []):
                if neighbor not in visited:
                    dfs(neighbor, end, path, visited, paths)
        path.pop()
        visited.remove(current)

    # List to store all possible paths from start to end
    paths = []
    dfs(start, end, [], set(), paths)
    
    # Find the shortest path based on length
    shortest_path = min(paths, key=len) if paths else None
    
    # Record the end time and return the shortest path with the elapsed time
    end_time = time.time()
    return end_time - start_time, shortest_path
