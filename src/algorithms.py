import time
import heapq  # Import the heapq module to use a priority queue
from flask import Flask, request, jsonify  # Import Flask for creating web applications

app = Flask(__name__)  # Initialize a Flask application

def dijkstra(graph, start, end):
    start_time = time.time()  # Record the start time for performance measurement
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
            end_time = time.time()  # Record the end time for performance measurement
            return path[::-1], end_time - start_time  # Return the reversed path and time taken

        if current_distance > distances[current_vertex]:  # Ignore outdated distances
            continue  # Skip to the next iteration

        for neighbor in graph[current_vertex]:  # Explore neighbors of the current node
            distance = current_distance + 1  # All edges have weight 1
            if distance < distances[neighbor]:  # If a shorter path is found
                distances[neighbor] = distance  # Update the shortest distance
                previous_nodes[neighbor] = current_vertex  # Update the previous node
                heapq.heappush(priority_queue, (distance, neighbor))  # Push the neighbor into the priority queue

    end_time = time.time()  # Record the end time for performance measurement
    return None, end_time - start_time  # Return None if no path is found and time taken

def dfs_shortest_path(graph, start, end):
    start_time = time.time()  # Record the start time for performance measurement

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
    end_time = time.time()  # Record the end time for performance measurement
    return shortest_path, end_time - start_time  # Return the shortest path and time taken

@app.route('/shortest-path', methods=['POST'])
def shortest_path():
    data = request.get_json()  # Get the JSON data from the POST request
    graph = data['graph']  # Extract the graph from the data
    start = data['start']  # Extract the start node from the data
    end = data['end']  # Extract the end node from the data
    dijkstra_path, dijkstra_time = dijkstra(graph, start, end)  # Compute the shortest path using Dijkstra's algorithm
    dfs_path, dfs_time = dfs_shortest_path(graph, start, end)  # Compute the shortest path using DFS
    return jsonify({  # Return the results as JSON
        'dijkstra': {
            'path': dijkstra_path,
            'time': dijkstra_time
        },
        'dfs': {
            'path': dfs_path,
            'time': dfs_time
        }
    })

if __name__ == '__main__':
    app.run(debug=True)  # Run the Flask application in debug mode
