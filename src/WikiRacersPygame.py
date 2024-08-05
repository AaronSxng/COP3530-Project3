import pygame # pip install pygame
import clipboard # pip install clipboard
import sys
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

    def text_position(self, ):
        pass

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
                    self.clicked = ~self.clicked # Reverse the click state
                    return True
        return False



def main():
    running = True
    clock = pygame.time.Clock()

    pygame.display.set_caption("Wiki Racers")

    input_text_box = TextBox(screen_width/2 -200, 100, 400, 50)
    output_text_box = TextBox(screen_width/2 -200, 400, 400, 50)

    button1 = Button(50, 50, 350, 300, text="Dijkstra's Shortest Path Algorithm")
    button2 = Button(50, 450, 350, 300, text='Depth-First Search')
    button3 = Button(screen_width/2 -200, 650, 275, 100, text="Wiki Race")
    button4 = Button(screen_width/2 +100, 650, 100, 100, text="Copy")

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

            if button3.is_clicked(event): # IF WIKI RACE BUTTON IS PRESSED, TRY RUNNING ALGORITHMS
                button3.clicked = False
                button3.draw(screen) # Reset the color of the button

                # HERE CHECK INPUT, TO SEE IF IT IS IN THE SET OF LINKS

                if button1.clicked:
                    # RUN DIJKSTRA'S
                    output_text_box.text = "www.link1.com"

                elif button2.clicked:
                    # RUN DEPTH-FIRST
                    output_text_box.text = "www.link2butreallylongthistimetoseehowwellithandlesinput.com"


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
