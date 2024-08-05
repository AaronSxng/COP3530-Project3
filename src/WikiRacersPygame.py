import pygame  # pip install pygame
import clipboard  # pip install clipboard
import sys
import requests
from Textbox import TextBox

# Initialize Pygame
pygame.init()

# Set up the display
screen_width = 1400
screen_height = 800
screen = pygame.display.set_mode((screen_width, screen_height))

# Define colors
BACKGROUND = (200, 200, 200)
BLACK = (0, 0, 0)
GRAY = (150, 150, 150)
HOVER = (150, 150, 200)
CLICK = (150, 150, 225)

# Button class
class Button:
    def __init__(self, x, y, width, height, text='', color=GRAY, hover_color=HOVER, text_color=BLACK):
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self.text = text
        self.color = color
        self.hover_color = hover_color
        self.text_color = text_color
        self.clicked = False
        self.rect = pygame.Rect(x, y, width, height)
        self.font = pygame.font.SysFont(None, 30)

    def text_position(self):
        pass

    # Draw the button
    def draw(self, screen):
        mouse_pos = pygame.mouse.get_pos()
        if self.clicked:
            pygame.draw.rect(screen, CLICK, self.rect)
        elif self.rect.collidepoint(mouse_pos):
            pygame.draw.rect(screen, self.hover_color, self.rect)
        else:
            pygame.draw.rect(screen, self.color, self.rect)

        if self.text:
            text_surface = self.font.render(self.text, True, self.text_color)
            text_rect = text_surface.get_rect(center=self.rect.center)
            screen.blit(text_surface, text_rect)

    # Check if the button is clicked
    def is_clicked(self, event):
        if event.type == pygame.MOUSEBUTTONDOWN:
            if event.button == 1:  # Left mouse button
                if self.rect.collidepoint(event.pos):
                    self.clicked = not self.clicked  # Reverse the click state
                    return True
        return False

# Main function
def main():
    running = True
    clock = pygame.time.Clock()

    # Set window caption
    pygame.display.set_caption("Wiki Racers")

    # Create text boxes for user input and output
    input_text_box = TextBox(screen_width/2 - 200, 100, 400, 50)
    output_text_box = TextBox(screen_width/2 - 200, 400, 400, 50)

    # Create buttons
    button1 = Button(50, 50, 350, 300, text="Dijkstra's Shortest Path Algorithm")
    button2 = Button(50, 450, 350, 300, text='Depth-First Search')
    button3 = Button(screen_width/2 - 200, 650, 275, 100, text="Wiki Race")
    button4 = Button(screen_width/2 + 100, 650, 100, 100, text="Copy")

    # Set the fonts of Copy and Wiki Race slightly larger
    button3.font = pygame.font.SysFont(None, 50)
    button4.font = pygame.font.SysFont(None, 50)

    # Main loop
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:  # Check for quit event
                running = False
            if button1.is_clicked(event):  # Check if button1 is clicked
                button2.clicked = False  # Un-click button2 if button1 is clicked
                print("Button clicked!")

            if button2.is_clicked(event):  # Check if button2 is clicked
                button1.clicked = False  # Un-click button1 if button2 is clicked

            if button3.is_clicked(event):  # If Wiki Race button is clicked
                button3.clicked = False
                button3.draw(screen)  # Reset the color of the button

                input1 = input_text_box.text
                input2 = output_text_box.text

                if input1 and input2:
                    # Fetch graph from the server
                    response = requests.post('http://localhost:5000/shortest-path', json={'graph': graph, 'start': input1, 'end': input2})
                    if response.status_code == 200:
                        data = response.json()
                        if button1.clicked:  # If button1 (Dijkstra) is clicked
                            output_text_box.text = f"Dijkstra: {data['dijkstra']['path']} in {data['dijkstra']['time']} seconds"
                        elif button2.clicked:  # If button2 (DFS) is clicked
                            output_text_box.text = f"DFS: {data['dfs']['path']} in {data['dfs']['time']} seconds"
                    else:
                        output_text_box.text = "Error fetching data from the server"

            if button4.is_clicked(event):  # If Copy button is clicked
                button4.clicked = False
                clipboard.copy(output_text_box.text)  # Copy output text to clipboard

            input_text_box.handle_event(event)  # Handle text box events

        screen.fill(BACKGROUND)  # Fill the background color
        button1.draw(screen)  # Draw button1
        button2.draw(screen)  # Draw button2
        button3.draw(screen)  # Draw button3
        button4.draw(screen)  # Draw button4

        input_text_box.draw(screen)  # Draw input text box
        output_text_box.draw(screen)  # Draw output text box

        pygame.display.flip()  # Update the display
        clock.tick(30)  # Limit the frame rate to 30 FPS

    pygame.quit()  # Quit Pygame

# Run the main function if the script is executed
if __name__ == "__main__":
    main()
