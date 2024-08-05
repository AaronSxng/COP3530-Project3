import pygame  # pip install pygame
import clipboard  # pip install clipboard
import sys
from Textbox import TextBox
from algorithms import dijkstra, dfs_shortest_path
import requests

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

    def is_clicked(self, event):
        if event.type == pygame.MOUSEBUTTONDOWN:
            if event.button == 1:  # Left mouse button
                if self.rect.collidepoint(event.pos):
                    self.clicked = ~self.clicked  # Reverse the click state
                    return True
        return False

def fetch_wikipedia_links(page):
    url = "https://en.wikipedia.org/w/api.php"
    params = {
        "action": "query",
        "format": "json",
        "titles": page,
        "prop": "links",
        "pllimit": "max"
    }
    response = requests.get(url, params=params)
    data = response.json()
    pages = data['query']['pages']
    links = []
    for page_id, page_data in pages.items():
        if 'links' in page_data:
            for link in page_data['links']:
                links.append(link['title'])
    return links

def main():
    running = True
    clock = pygame.time.Clock()
    pygame.display.set_caption("Wiki Racers")

    input_text_box = TextBox(screen_width / 2 - 200, 100, 400, 50)
    output_text_box = TextBox(screen_width / 2 - 200, 400, 400, 50)

    button1 = Button(50, 50, 350, 300, text="Dijkstra's Shortest Path Algorithm")
    button2 = Button(50, 450, 350, 300, text='Depth-First Search')
    button3 = Button(screen_width / 2 - 200, 650, 275, 100, text="Wiki Race")
    button4 = Button(screen_width / 2 + 100, 650, 100, 100, text="Copy")

    # Set the fonts of Copy and Wiki Race slightly larger
    button3.font = pygame.font.SysFont(None, 50)
    button4.font = pygame.font.SysFont(None, 50)

    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            if button1.is_clicked(event):
                button2.clicked = False
                print("Button clicked!")

            if button2.is_clicked(event):
                button1.clicked = False

            if button3.is_clicked(event):  # IF WIKI RACE BUTTON IS PRESSED, TRY RUNNING ALGORITHMS
                button3.clicked = False
                button3.draw(screen)  # Reset the color of the button

                start_page = input_text_box.enteredText.split()[0]
                end_page = input_text_box.enteredText.split()[1]

                start_links = fetch_wikipedia_links(start_page)
                end_links = fetch_wikipedia_links(end_page)

                graph = {start_page: start_links, end_page: end_links}

                if button1.clicked:
                    # RUN DIJKSTRA'S
                    time_taken, path = dijkstra(graph, start_page, end_page)
                    output_text_box.text = f"Path: {path}\nTime: {time_taken}"

                elif button2.clicked:
                    # RUN DEPTH-FIRST
                    time_taken, path = dfs_shortest_path(graph, start_page, end_page)
                    output_text_box.text = f"Path: {path}\nTime: {time_taken}"

            if button4.is_clicked(event):
                button4.clicked = False
                clipboard.copy(output_text_box.text)

            input_text_box.handle_event(event)

        screen.fill(BACKGROUND)
        button1.draw(screen)
        button2.draw(screen)
        button3.draw(screen)
        button4.draw(screen)

        input_text_box.draw(screen)
        output_text_box.draw(screen)

        pygame.display.flip()
        clock.tick(30)

    pygame.quit()

if __name__ == "__main__":
    main()
