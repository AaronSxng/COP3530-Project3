import time
import heapq  # Import the heapq module to use a priority queue

def dijkstra(graph, start, end):
    # Find the shortest path using Dijkstra's algorithm.
    priority_queue = [(0, start)]  # Initialize priority queue with the start node and distance 0
    distances = {vertex: float('inf') for vertex in graph}  # Set initial distances to infinity for all nodes
    distances[start] = 0  # Distance to the start node is 0
    previous_nodes = {vertex: None for vertex in graph}  # Track the previous node for each node to reconstruct path

    while priority_queue:  # Continue while there are nodes to process
        current_distance, current_vertex = heapq.heappop(priority_queue)  # Get the node with the smallest distance

        if current_vertex == end:  # If the end node is reached
            path = []  # Initialize the path list
            while current_vertex is not None:  # Reconstruct the path
                path.append(current_vertex)  # Add the current node to the path
                current_vertex = previous_nodes[current_vertex]  # Move to the previous node
            return path[::-1]  # Return the reversed path

        if current_distance > distances[current_vertex]:  # Ignore outdated distances
            continue  # Skip to the next iteration

        for neighbor in graph[current_vertex]:  # Explore neighbors of the current node
            distance = current_distance + 1  # All edges have weight 1
            if distance < distances[neighbor]:  # If a shorter path is found
                distances[neighbor] = distance  # Update the shortest distance
                previous_nodes[neighbor] = current_vertex  # Update the previous node
                heapq.heappush(priority_queue, (distance, neighbor))  # Push the neighbor into the priority queue
    return None  # Return None if no path is found

def dfs_shortest_path(graph, start, end):
    # Find the shortest path using DFS.

    def dfs(current, end, path, visited, paths):
        if current in visited:  # If the current node is already visited
            return  # Return to avoid cycles
        visited.add(current)  # Mark the current node as visited
        path.append(current)  # Add the current node to the path
        if current == end:  # If the end node is reached
            paths.append(list(path))  # Add the current path to the list of paths
        else:
            for neighbor in graph.get(current, []):  # Explore neighbors of the current node
                if neighbor not in visited:  # If the neighbor is not visited
                    dfs(neighbor, end, path, visited, paths)  # Recursively call DFS
        path.pop()  # Remove the current node from the path (backtrack)
        visited.remove(current)  # Mark the current node as unvisited (backtrack)

    paths = []  # Initialize the list of all possible paths
    dfs(start, end, [], set(), paths)  # Call the DFS function
    shortest_path = min(paths, key=len) if paths else None  # Find the shortest path
    return shortest_path  # Return the shortest path

def main():
    # Example graph represented as an adjacency list
    graph = {
        'A': ['B', 'C', 'D'],
        'B': ['A', 'E', 'D'],
        'C': ['A', 'D'],
        'D': ['A', 'B', 'C', 'E'],
        'E': ['B', 'D']
    }

    start = 'A'
    end = 'E'

    # Test Dijkstra's algorithm
    print("Testing Dijkstra's algorithm:")
    start_time = time.time()
    dijkstra_path = dijkstra(graph, start, end)
    end_time = time.time()
    print(f"Shortest path from {start} to {end} using Dijkstra's algorithm: {dijkstra_path}")
    print(f"Time taken by Dijkstra's algorithm: {end_time - start_time} seconds")

    # Test DFS for shortest path
    print("\nTesting DFS algorithm:")
    start_time = time.time()
    dfs_path = dfs_shortest_path(graph, start, end)
    end_time = time.time()
    print(f"Shortest path from {start} to {end} using DFS: {dfs_path}")
    print(f"Time taken by DFS: {end_time - start_time} seconds")

# Call the main function directly at the top level
main()
